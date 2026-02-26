from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="User's question about Kenya tourism")

class DocumentRequest(BaseModel):
    text: str = Field(..., description="Text content to be embedded and stored")
    metadata: dict = Field(default={}, description="Metadata for the document")
