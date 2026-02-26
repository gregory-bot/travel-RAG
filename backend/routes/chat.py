from fastapi import APIRouter, HTTPException
from schemas.request_models import ChatRequest
from schemas.response_models import ChatResponse
from services.retrieval_service import retrieve_documents
from services.llm_service import (
    generate_response, 
    generate_greeting_response,
    generate_thanks_response,
    generate_farewell_response,
    generate_clarification_response,
    generate_no_results_response
)
import re

router = APIRouter()

# ============= CONVERSATION PATTERN DETECTION =============

def is_greeting(text):
    """Detect greetings"""
    greetings = [
        r"\bhello\b", r"\bhi\b", r"\bhey\b", 
        r"\bgood (morning|afternoon|evening|night)\b",
        r"\bgreetings\b", r"\bhowdy\b"
    ]
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in greetings)

def is_thanks(text):
    """Detect thanks/appreciation"""
    thanks = [
        r"\bthank(s| you| u)?\b", r"\bthx\b", 
        r"\bappreciate it\b", r"\bappreciate\b",
        r"\bthanks a lot\b", r"\bgreat\b (help|info)",
        r"\bmuch appreciated\b"
    ]
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in thanks)

def is_farewell(text):
    """Detect farewells"""
    farewells = [
        r"\bbye\b", r"\bgoodbye\b", r"\bsee you\b",
        r"\bsee ya\b", r"\bcatch you\b", r"\buntil later\b",
        r"\btalk soon\b", r"\blater\b"
    ]
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in farewells)

def is_empty_or_unclear(text):
    """Detect unclear or empty input"""
    return not text.strip() or text.strip() in ["?", ".", "!", "...", "???"]

def is_exclamation(text):
    """Detect exclamations or emotional reactions"""
    exclamations = [
        r"\bamazing\b", r"\bwow\b", r"\bcool\b", r"\bawesome\b",
        r"\bgreat\b", r"\bincredible\b", r"\bfantastic\b"
    ]
    return any(re.search(pattern, text, re.IGNORECASE) for pattern in exclamations)

def is_how_question(text):
    """Detect 'how' questions - often need more conversational treatment"""
    return re.search(r"\bhow\b", text, re.IGNORECASE)

def is_opinion_or_chat(text):
    """Detect casual chat, opinions, or non-question statements"""
    # If text ends with ! or multiple words but no question mark, it's likely opinion/chat
    return not text.strip().endswith("?") and len(text.strip().split()) > 2

# ============= RESPONSE GENERATION =============

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Enhanced chat endpoint with conversational AI"""
    try:
        user_text = request.query.strip()

        # ===== CONVERSATIONAL RESPONSES (No retrieval needed) =====
        
        if is_greeting(user_text):
            return ChatResponse(
                answer=generate_greeting_response(),
                sources=[],
                retrieved_documents=[]
            )
        
        if is_thanks(user_text):
            return ChatResponse(
                answer=generate_thanks_response(),
                sources=[],
                retrieved_documents=[]
            )
        
        if is_farewell(user_text):
            return ChatResponse(
                answer=generate_farewell_response(),
                sources=[],
                retrieved_documents=[]
            )
        
        if is_empty_or_unclear(user_text):
            return ChatResponse(
                answer=generate_clarification_response(),
                sources=[],
                retrieved_documents=[]
            )

        # ===== DOCUMENT RETRIEVAL FOR INFORMATIONAL RESPONSES =====
        
        retrieved_docs = retrieve_documents(user_text, top_k=5)
        best_score = max([doc.get("score", 0.0) for doc in retrieved_docs], default=0.0)

        # If no relevant docs found
        if not retrieved_docs or best_score < 0.15:
            return ChatResponse(
                answer=generate_no_results_response(user_text),
                sources=[],
                retrieved_documents=[]
            )

        # Determine if this is conversational chat or a direct question
        is_conversational_query = is_exclamation(user_text) or is_opinion_or_chat(user_text)
        
        # Generate response with appropriate tone
        if best_score < 0.35:
            # Low confidence - acknowledge it
            answer = generate_response(user_text, retrieved_docs, is_conversational=is_conversational_query)
            answer = f"Based on what I found: {answer}"
        else:
            # Good confidence - respond naturally
            answer = generate_response(user_text, retrieved_docs, is_conversational=is_conversational_query)

        sources = list(set([doc.get("source", "Tourism Document") for doc in retrieved_docs]))

        return ChatResponse(
            answer=answer,
            sources=sources,
            retrieved_documents=retrieved_docs
        )

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# ============= HEALTH CHECK =============

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Chat API is running and ready for conversations!"
    }