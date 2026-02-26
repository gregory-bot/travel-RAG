import os
from dotenv import load_dotenv

load_dotenv()

LLM_MODEL = os.getenv("LLM_MODEL", "gemini")

def generate_response(query: str, retrieved_docs: list, is_conversational: bool = False):
    """Generate a response with better conversational abilities"""
    
    context = "\n\n".join([doc['text'] for doc in retrieved_docs]) if retrieved_docs else ""
    
    if is_conversational:
        # More natural, conversational prompt
        prompt = f"""You are a friendly, knowledgeable Kenya tourism expert assistant. You engage naturally in conversation, not like a bot.

Context about Kenya (use if relevant):
{context if context else "No specific context available, but you can use your general knowledge about Kenya tourism."}

User message: "{query}"

Guidelines:
- Respond naturally and conversationally, not formally
- Be warm and engaging, like a friend helping with travel plans
- Keep responses concise but informative
- If they ask questions, answer them. If they comment, respond naturally
- Use humor when appropriate
- Don't constantly say "according to the documents" - just integrate info naturally
- Feel free to suggest related topics or ask follow-up questions
- If context is available, weave it in naturally

Respond in a natural, human way:"""
    else:
        # Traditional question-answer prompt
        prompt = f"""You are a Kenya tourism expert assistant. Answer the user's question using the provided context below. Keep your answer short, clear, and helpful.

Context:
{context}

Question: {query}

Answer (be informative but concise):"""

    if LLM_MODEL == "openai":
        return generate_openai_response(prompt)
    elif LLM_MODEL == "gemini":
        return generate_gemini_response(prompt)
    else:
        return "Error: Unknown LLM model configured"

def generate_openai_response(prompt: str):
    """Generate response using OpenAI"""
    try:
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a friendly, helpful Kenya tourism expert. Engage naturally in conversation. Be warm, knowledgeable, and helpful without being overly formal."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,  # Increased for more natural responses
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"Error generating OpenAI response: {e}")
        return f"Sorry, I encountered an error: {str(e)}"

def generate_gemini_response(prompt: str):
    """Generate response using Gemini"""
    try:
        import google.generativeai as genai

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        # Use Gemini 2.5 Flash for faster, conversational responses
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            generation_config={
                'temperature': 0.8,  # More creative and conversational
                'top_p': 0.95,
                'max_output_tokens': 500,
            }
        )

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        print(f"Error generating Gemini response: {e}")
        return f"Sorry, I encountered an error: {str(e)}"

def generate_greeting_response():
    """Generate varied greeting responses"""
    import random
    responses = [
        "Hey there! 👋 How can I help you explore Kenya?",
        "Hello! Welcome! What would you like to know about Kenya?",
        "Hi! Great to meet you. Ready to plan an amazing Kenya adventure?",
        "Hey! I'm here to help with all your Kenya travel questions.",
        "Hello! What brings you here today? Planning a Kenya trip?",
    ]
    return random.choice(responses)

def generate_thanks_response():
    """Generate varied thanks responses"""
    import random
    responses = [
        "You're welcome! Feel free to ask me anything else about Kenya.",
        "Happy to help! Got any other Kenya travel questions?",
        "No problem! Let me know if you need more info.",
        "Glad I could help! Anything else you'd like to know?",
        "Anytime! I'm here if you need more travel tips.",
    ]
    return random.choice(responses)

def generate_farewell_response():
    """Generate varied farewell responses"""
    import random
    responses = [
        "Safe travels! Come back if you need more help planning your Kenya adventure. 🌍",
        "Bye! Hope you have an amazing time in Kenya!",
        "See you soon! Feel free to reach out anytime. Safe travels! ✈️",
        "Goodbye! Looking forward to hearing about your Kenya adventures!",
        "Take care! Enjoy Kenya and feel free to return with more questions.",
    ]
    return random.choice(responses)

def generate_clarification_response():
    """Generate responses when input is unclear"""
    import random
    responses = [
        "I'm here to help! Tell me what you'd like to know about Kenya - destinations, activities, accommodation, budgets, you name it!",
        "Not quite sure what you mean. Ask me anything about Kenya travel - wildlife, beaches, mountains, or anything else!",
        "I'm ready to help! What would you like to explore in Kenya?",
        "Let me know what you're curious about! I can help with destinations, travel tips, accommodation, and more.",
    ]
    return random.choice(responses)

def generate_no_results_response(query: str):
    """Generate empathetic response when no docs found"""
    import random
    responses = [
        f"Hmm, I couldn't find specific info about '{query}' in my documents, but feel free to ask about popular Kenya destinations like Masai Mara, the Rift Valley, or coastal areas!",
        f"I don't have specific information about that right now. Try asking about Kenya's main attractions - wildlife, beaches, mountains, or cultural sites!",
        f"That's an interesting question about '{query}'! I don't have that exact info, but I'd love to help with Kenya travel planning in other ways.",
    ]
    return random.choice(responses)