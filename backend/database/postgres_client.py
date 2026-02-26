import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT")) if os.getenv("DB_PORT") else None,
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", 384))

def get_db_connection():
    try:
        # Remove None values from config to avoid psycopg2 errors
        cfg = {k: v for k, v in DB_CONFIG.items() if v is not None}
        conn = psycopg2.connect(**cfg)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise


def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Ensure pgvector extension is available
        cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")

        # Create the documents table using pgvector `vector` type
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS tourism_documents (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                embedding vector({EMBEDDING_DIM}) NOT NULL,
                metadata JSONB DEFAULT '{{}}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_tourism_metadata
            ON tourism_documents USING GIN (metadata);
        """)

        cursor.execute(f"""
            CREATE INDEX IF NOT EXISTS idx_tourism_embedding
            ON tourism_documents USING ivfflat (embedding vector_l2_ops)
            WITH (lists = 100);
        """)

        conn.commit()
        cursor.close()
        conn.close()

        print("Database initialized successfully")

    except Exception as e:
        print(f"Error initializing database: {e}")
        raise


def _embedding_to_vector_literal(embedding: list) -> str:
    # Convert list of floats to pgvector literal string e.g. '[0.1,0.2,...]'
    return "[" + ",".join([str(float(x)) for x in embedding]) + "]"


def store_document(text: str, embedding: list, metadata: dict = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if metadata is None:
            metadata = {}

        emb_literal = _embedding_to_vector_literal(embedding)

        cursor.execute("""
            INSERT INTO tourism_documents (text, embedding, metadata)
            VALUES (%s, %s::vector, %s)
            RETURNING id;
        """, (text, emb_literal, psycopg2.extras.Json(metadata)))

        doc_id = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return doc_id

    except Exception as e:
        print(f"Error storing document: {e}")
        raise


def search_similar_documents(query_embedding: list, top_k: int = 5):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        emb_literal = _embedding_to_vector_literal(query_embedding)

        cursor.execute("""
            SELECT
                id,
                text,
                metadata,
                1 - (embedding <=> %s::vector) as similarity
            FROM tourism_documents
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """, (emb_literal, emb_literal, top_k))

        results = []
        for row in cursor.fetchall():
            results.append({
                "id": row[0],
                "text": row[1],
                "metadata": row[2],
                "score": float(row[3]) if row[3] is not None else None
            })

        cursor.close()
        conn.close()

        return results

    except Exception as e:
        print(f"Using fallback cosine similarity search: {e}")
        return search_similar_documents_fallback(query_embedding, top_k)


def search_similar_documents_fallback(query_embedding: list, top_k: int = 5):
    import numpy as np

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, text, embedding, metadata
            FROM tourism_documents;
        """)

        all_docs = cursor.fetchall()

        if not all_docs:
            return []

        query_vec = np.array(query_embedding)
        similarities = []

        for doc in all_docs:
            doc_id, text, embedding, metadata = doc
            # embedding may come back as a list-like or string; try to coerce
            try:
                doc_vec = np.array(embedding)
            except Exception:
                # fallback: parse string like '[0.1,0.2]'
                emb_str = str(embedding)
                emb_str = emb_str.strip('[]')
                doc_vec = np.array([float(x) for x in emb_str.split(',') if x.strip()])

            cosine_sim = np.dot(query_vec, doc_vec) / (
                np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
            )

            similarities.append({
                "id": doc_id,
                "text": text,
                "metadata": metadata,
                "score": float(cosine_sim)
            })

        similarities.sort(key=lambda x: x["score"], reverse=True)

        cursor.close()
        conn.close()

        return similarities[:top_k]

    except Exception as e:
        print(f"Error in fallback search: {e}")
        return []
