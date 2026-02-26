# Kenya Travel RAG Backend

Python FastAPI backend for the Kenya Travel & Tourism RAG system.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
Create a `.env` file with:
```
DB_HOST=pg-390d9840-facefit643-d755.c.aivencloud.com
DB_PORT=13201
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=avnadmin

OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

EMBEDDING_MODEL=openai  # or gemini
LLM_MODEL=gemini        # or openai
```

3. Initialize database and index sample data:
```bash
python scripts/scrape_and_index.py
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /chat
Query the RAG system
```json
{
  "query": "What are the best wildlife destinations in Kenya?"
}
```

### GET /destinations
List all destinations

### GET /destinations/{name}
Get specific destination details

### GET /health
Health check endpoint

## Database Schema

### tourism_documents table
- `id`: Serial primary key
- `text`: Document text content
- `embedding`: Float array for vector embeddings
- `metadata`: JSONB with location, category, source, etc.
- `created_at`: Timestamp

## Architecture

- **FastAPI**: REST API framework
- **PostgreSQL**: Vector storage with pgvector extension (fallback to numpy if not available)
- **OpenAI/Gemini**: Embedding and LLM services
- **Pydantic**: Request/response validation
