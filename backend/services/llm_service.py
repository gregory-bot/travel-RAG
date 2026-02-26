import os
from dotenv import load_dotenv

load_dotenv()

LLM_MODEL = os.getenv("LLM_MODEL", "gemini")

def generate_response(agent_prompt: str, retrieved_docs: list, is_conversational: bool = True):
    """
    Generate a response using an agentic approach.
    The prompt already contains all context and instructions.
    """
    # For agentic approach, always use conversational mode
    # The prompt itself contains all the intelligence
    if LLM_MODEL == "openai":
        return generate_openai_response(agent_prompt)
    elif LLM_MODEL == "gemini":
        return generate_gemini_response(agent_prompt)
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
                'temperature': 0.85,  # More creative and conversational
                'top_p': 0.98,
                'max_output_tokens': 1200,
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
        "Here's a great travel plan for your family holiday in Kenya:",
        "Day 1: Start at Nairobi National Park for a close-up wildlife experience.\nDay 2: Visit the Giraffe Centre and David Sheldrick Elephant Orphanage.\nDay 3: Head to Masai Mara for a safari adventure—kids will love seeing lions, elephants, and zebras.\nDay 4: Explore Lake Naivasha for boat rides and hippo spotting.\nDay 5: Relax at Mombasa beaches or try snorkeling.\nFor more ideas or a custom itinerary, just tell me your interests or travel dates!",
    ]
    return "\n".join(responses)