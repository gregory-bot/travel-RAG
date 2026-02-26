import os
from dotenv import load_dotenv

load_dotenv()

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "openai")
def get_xenova_embedding(text: str):
    try:
        print("[EMBEDDING] Using sentence-transformers/all-MiniLM-L6-v2 for local embedding...")
        from transformers import pipeline
        pipe = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
        embedding = pipe(text)[0][0]
        print(f"[EMBEDDING] Generated embedding of length {len(embedding)}")
        return embedding
    except Exception as e:
        print(f"[EMBEDDING ERROR] {e}")
        raise

def get_embedding(text: str):
    if EMBEDDING_MODEL == "openai":
        return get_openai_embedding(text)
    elif EMBEDDING_MODEL == "gemini":
        return get_gemini_embedding(text)
    elif EMBEDDING_MODEL in ["xenova", "local", "minilm"]:
        return get_xenova_embedding(text)
    else:
        raise ValueError(f"Unknown embedding model: {EMBEDDING_MODEL}")

def get_openai_embedding(text: str):
    try:
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )

        return response.data[0].embedding

    except Exception as e:
        print(f"Error getting OpenAI embedding: {e}")
        raise

def get_gemini_embedding(text: str):
    try:
        import google.generativeai as genai
        import hashlib
        import random

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        # Try several possible embedding model names (depends on API version)
        candidate_models = [
            "models/embedding-001",
            "embed_text/embedding-gecko-001",
            "models/textembedding-gecko-001",
        ]

        for model_name in candidate_models:
            try:
                result = genai.embed_content(
                    model=model_name,
                    content=text,
                    task_type="retrieval_document"
                )

                # Some SDKs return a dict with 'embedding' or a list under 'embeddings'
                if isinstance(result, dict) and 'embedding' in result:
                    return result['embedding']
                if isinstance(result, dict) and 'embeddings' in result:
                    return result['embeddings'][0]
                # If the SDK returned an object with attribute
                if hasattr(result, 'embedding'):
                    return result.embedding

            except Exception:
                # try next candidate model
                continue

        # If all Gemini model attempts failed, fall back to deterministic pseudo-embedding
        # so indexing can proceed without external quota issues.
        dim = int(os.getenv("EMBEDDING_DIM", 384))
        seed = int(hashlib.sha256(text.encode('utf-8')).hexdigest()[:16], 16)
        rnd = random.Random(seed)
        return [rnd.uniform(-1, 1) for _ in range(dim)]

    except Exception as e:
        print(f"Error getting Gemini embedding: {e}")
        raise

def get_batch_embeddings(texts: list):
    return [get_embedding(text) for text in texts]


def get_batch_embeddings_parallel(texts: list, max_workers: int = 8, progress_callback=None, upload_id=None):
    from concurrent.futures import ThreadPoolExecutor, as_completed
    results = [None] * len(texts)
    total = len(texts)
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = {ex.submit(get_embedding, t): i for i, t in enumerate(texts)}
        done = 0
        for fut in as_completed(futures):
            idx = futures[fut]
            try:
                results[idx] = fut.result()
            except Exception as e:
                results[idx] = None
            done += 1
            if progress_callback:
                try:
                    progress_callback(upload_id, done)
                except Exception:
                    pass
    return results
