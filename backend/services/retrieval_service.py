from services.embedding_service import get_embedding
from database.postgres_client import search_similar_documents

def retrieve_documents(query: str, top_k: int = 5):
    try:
        query_embedding = get_embedding(query)

        similar_docs = search_similar_documents(query_embedding, top_k)

        results = []
        for doc in similar_docs:
            results.append({
                "text": doc["text"],
                "source": doc.get("metadata", {}).get("source", "Tourism Document"),
                "score": doc.get("score", 0.0),
                "location": doc.get("metadata", {}).get("location", ""),
                "category": doc.get("metadata", {}).get("category", "")
            })

        return results

    except Exception as e:
        print(f"Error retrieving documents: {e}")
        return []
