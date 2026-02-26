from pydantic import BaseModel
from typing import List, Optional

class RetrievedDocument(BaseModel):
    text: str
    source: str
    score: Optional[float] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    retrieved_documents: List[dict]

class DestinationResponse(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
