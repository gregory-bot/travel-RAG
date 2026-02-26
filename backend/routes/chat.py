from fastapi import APIRouter, HTTPException
from schemas.request_models import ChatRequest
from schemas.response_models import ChatResponse
from services.retrieval_service import retrieve_documents
from services.llm_service import (
    generate_response,
    generate_greeting_response,
    generate_thanks_response,
    generate_farewell_response,
    generate_clarification_response
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

def extract_intent(text):
    """Extract user intent from query"""
    intents = {
        "trip_planning": r"\b(plan|planning|itinerary|trip|travel|visit|vacation|holiday)\b",
        "family_friendly": r"\b(family|kids|children|child|baby|toddler)\b",
        "wildlife": r"\b(wildlife|safari|animals|lions|elephants|giraffes|zebras|game|reserve|national park)\b",
        "budget": r"\b(budget|cheap|affordable|expensive|cost|price)\b",
        "accommodation": r"\b(hotel|lodge|accommodation|stay|sleep|place to stay)\b",
        "adventure": r"\b(adventure|hiking|trekking|climbing|extreme)\b",
        "beach": r"\b(beach|coastal|sand|ocean|sea|swimming)\b",
        "culture": r"\b(culture|cultural|tradition|museum|heritage|local)\b",
        "food": r"\b(food|cuisine|restaurant|eat|dining|taste)\b",
    }
    detected_intents = []
    for intent, pattern in intents.items():
        if re.search(pattern, text, re.IGNORECASE):
            detected_intents.append(intent)
    return detected_intents

# ============= RESPONSE GENERATION =============

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Agentic chat endpoint - AI thinks intelligently about user needs"""
    try:
        user_text = request.query.strip()

        # ===== QUICK CONVERSATIONAL RESPONSES =====
        if is_greeting(user_text):
            return ChatResponse(
                answer="Hey there! 👋 I'm your Kenya travel agent. Tell me about your dream trip - whether it's wildlife safaris, beach getaways, family adventures, or cultural experiences, I'm here to help plan something amazing!",
                sources=[],
                retrieved_documents=[]
            )
        if is_thanks(user_text):
            return ChatResponse(
                answer="Happy to help! Any other questions about Kenya? I can help with itineraries, recommendations, travel tips, or anything else you need!",
                sources=[],
                retrieved_documents=[]
            )
        if is_farewell(user_text):
            return ChatResponse(
                answer="Safe travels! Come back anytime you need help planning your Kenya adventure. Looking forward to hearing about your trip! 🌍✈️",
                sources=[],
                retrieved_documents=[]
            )
        if is_empty_or_unclear(user_text):
            return ChatResponse(
                answer="I'm here to help! Tell me what you're looking for - are you planning a family trip? Interested in wildlife? Want adventure activities? Budget constraints? Beach time? Or maybe cultural experiences? The more details you share, the better I can help!",
                sources=[],
                retrieved_documents=[]
            )

        # ===== INTELLIGENT AGENT RESPONSE =====
        intents = extract_intent(user_text)
        retrieved_docs = retrieve_documents(user_text, top_k=7)
        agent_prompt = build_agent_prompt(user_text, intents, retrieved_docs)
        answer = generate_response(agent_prompt, retrieved_docs, is_conversational=True)
        sources = list(set([doc.get("source", "Tourism Document") for doc in retrieved_docs]))
        return ChatResponse(
            answer=answer,
            sources=sources,
            retrieved_documents=retrieved_docs
        )
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

def build_agent_prompt(user_query: str, intents: list, retrieved_docs: list) -> str:
    """Build an intelligent agent prompt that understands user needs"""
    context = "\n\n".join([doc['text'] for doc in retrieved_docs]) if retrieved_docs else ""
    intent_summary = build_intent_summary(intents)
    prompt = f"""You are an intelligent Kenya travel agent AI. Your job is to understand what the user really wants and provide personalized, helpful guidance.

USER PROFILE & INTENT:
{intent_summary}

AVAILABLE INFORMATION:
{context if context else "You can use your general knowledge about Kenya tourism"}

USER'S REQUEST:
"{user_query}"

YOUR TASK:
Think through the user's needs as an AI agent would:
1. What are they really looking for? (family trip? adventure? relaxation?)
2. What constraints do they have? (budget? timeline? kids?)
3. What would be the BEST recommendations for them?

GUIDELINES:
- Think like an intelligent agent, not a search engine
- Understand the user's underlying needs (they might not ask directly)
- Provide personalized, specific recommendations
- Be conversational and warm, like a trusted travel advisor
- If they mention family + wildlife, recommend family-friendly safari options
- If budget-conscious, suggest affordable alternatives
- Offer a complete vision (where to go, what to do, duration, tips)
- Ask follow-up questions if needed to refine recommendations
- Don't say "I couldn't find..." - instead use your knowledge to help
- Think creatively about what would make their trip amazing
- Respond with a complete, detailed itinerary or recommendation. Do not just give an introduction—provide a full answer.

Respond naturally as an intelligent travel agent would:"""
    return prompt

def build_intent_summary(intents: list) -> str:
    """Build a summary of detected user intents"""
    intent_descriptions = {
        "trip_planning": "Looking to plan a trip/itinerary",
        "family_friendly": "Traveling with family/kids",
        "wildlife": "Interested in wildlife/safari/animals",
        "budget": "Cost-conscious traveler",
        "accommodation": "Looking for places to stay",
        "adventure": "Seeking adventure activities",
        "beach": "Interested in beach destinations",
        "culture": "Interested in cultural experiences",
        "food": "Interested in local cuisine",
    }
    if not intents:
        return "General Kenya travel inquiry"
    summary = "Traveler is interested in: " + ", ".join([
        intent_descriptions.get(intent, intent) for intent in intents
    ])
    return summary

# ============= HEALTH CHECK =============

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Chat API is running and ready for conversations!"
    }