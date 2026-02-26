from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, destinations, documents
from database.postgres_client import init_db
import uvicorn

app = FastAPI(title="Kenya Travel RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(destinations.router, prefix="/destinations", tags=["destinations"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {
        "message": "Kenya Travel RAG API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
