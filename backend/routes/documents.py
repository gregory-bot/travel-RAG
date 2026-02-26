from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
from schemas.request_models import DocumentRequest
from database.postgres_client import get_db_connection, store_document
from services.embedding_service import get_embedding, get_batch_embeddings_parallel
from services.document_service import extract_text_from_bytes, chunk_text
from services import progress as progress_service
import json
import io
import threading
import uuid


def _process_upload_background(upload_id: str, uploads: List[UploadFile], parsed_meta: dict):
    # runs in background thread
    try:
        print(f"[UPLOAD] Starting upload_id={upload_id} with {len(uploads)} file(s)")
        total_chunks = 0
        all_chunks = []
        all_metas = []

        # extract and chunk
        for upload in uploads:
            print(f"[UPLOAD] Reading and chunking file: {upload.filename}")
            contents = upload.file.read()
            text = extract_text_from_bytes(upload.filename or 'unknown', contents)
            chunks = chunk_text(text, chunk_size_tokens=400, chunk_overlap=50)
            print(f"[UPLOAD] File {upload.filename} split into {len(chunks)} chunks")
            for idx, chunk in enumerate(chunks):
                meta = parsed_meta.copy()
                meta.update({'source': upload.filename, 'chunk_index': idx})
                all_chunks.append(chunk)
                all_metas.append(meta)
                print(f"[CHUNK] Preview chunk {idx+1}: {chunk[:120]}...")

        total_chunks = len(all_chunks)
        print(f"[UPLOAD] Total chunks to process: {total_chunks}")
        progress_service.set_total(upload_id, total_chunks)

        # parallel embeddings with progress updates
        def _progress_cb(uid, done):
            print(f"[UPLOAD] Embedding progress: {done}/{total_chunks} chunks done")
            progress_service.update_progress(uid, done)

        print(f"[UPLOAD] Starting embedding for all chunks...")
        embeddings = get_batch_embeddings_parallel(all_chunks, max_workers=8, progress_callback=_progress_cb, upload_id=upload_id)

        # store
        print(f"[UPLOAD] Storing chunks in database...")
        stored_count = 0
        for chunk_text_content, emb, meta in zip(all_chunks, embeddings, all_metas):
            if emb is None:
                print(f"[UPLOAD] Skipping chunk (no embedding)")
                continue
            store_document(text=chunk_text_content, embedding=emb, metadata=meta)
            stored_count += 1
            print(f"[UPLOAD] Stored chunk {stored_count}/{total_chunks}")

        print(f"[UPLOAD] All chunks stored. Upload {upload_id} complete.")
        progress_service.finish_progress(upload_id, message='Indexing complete')

    except Exception as e:
        print(f"[UPLOAD ERROR] {e}")
        progress_service.finish_progress(upload_id, message=f'Error: {e}')

router = APIRouter()

# Endpoint to trigger tourism data ingestion
@router.post('/ingest-tourism-data')
async def ingest_tourism_data():
    try:
        from scripts.scrape_and_index import index_sample_data
        index_sample_data()
        return {"message": "Tourism data ingested successfully."}
    except Exception as e:
        return {"error": str(e)}


@router.post("", status_code=201)
async def add_document(request: DocumentRequest):
    try:
        embedding = get_embedding(request.text)

        doc_id = store_document(
            text=request.text,
            embedding=embedding,
            metadata=request.metadata or {}
        )

        return {"id": doc_id, "message": "Document indexed"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing document: {str(e)}")


@router.post('/upload')
async def upload_documents(files: List[UploadFile] = File(...), metadata: Optional[str] = Form(None)):
    try:
        parsed_meta = {}
        if metadata:
            try:
                parsed_meta = json.loads(metadata)
            except Exception:
                parsed_meta = {}

        # create upload id and register progress
        upload_id = str(uuid.uuid4())
        progress_service.create_progress(upload_id, total_steps=1)

        # Convert UploadFile objects to simple objects for background thread
        uploads = []
        for f in files:
            # read into memory (small uploads expected)
            content = await f.read()
            simple = type('U', (), {})()
            simple.filename = f.filename
            simple.file = io.BytesIO(content)
            uploads.append(simple)

        # spawn background thread
        t = threading.Thread(target=_process_upload_background, args=(upload_id, uploads, parsed_meta), daemon=True)
        t.start()

        return {'upload_id': upload_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading documents: {str(e)}")


@router.get('/progress/{upload_id}')
async def get_upload_progress(upload_id: str):
    p = progress_service.get_progress(upload_id)
    if p is None:
        raise HTTPException(status_code=404, detail='Upload ID not found')
    return p


@router.get("", response_model=List[dict])
async def list_documents(limit: int = 50):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, metadata->>'source' as source, metadata->>'chunk_index' as chunk_index, metadata->>'chunk_total' as chunk_total, created_at FROM tourism_documents ORDER BY created_at DESC LIMIT %s", (limit,))
        rows = cursor.fetchall()

        docs = []
        for r in rows:
            docs.append({"id": r[0], "source": r[1], "chunk_index": r[2], "chunk_total": r[3], "created_at": r[4]})

        cursor.close()
        conn.close()

        return docs

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")
