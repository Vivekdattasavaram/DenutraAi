import os
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(dotenv_path=env_path, override=True)

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import httpx
from dependencies import get_current_user
import models

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

class ChatMessage(BaseModel):
    message: str
    language: str = "English"

class ChatResponse(BaseModel):
    reply: str
    language: str

SYSTEM_PROMPT = """
You are Dentura AI, an expert oral health assistant.
Provide concise, medically accurate, and friendly dental advice.
You MUST reply exclusively in the following language: {language}
Only discuss oral health, dental hygiene, diet related to teeth, and dental procedures.
Do not provide general medical advice outside of dentistry.
"""

def get_demo_fallback(message: str, language: str) -> dict:
    # Basic fallback translation mapping
    if language == "Tamil":
        reply = "பல் துலக்குவது மற்றும் வாய் ஆரோக்கியத்தை பேணுவது மிகவும் முக்கியம். [Demo Mode]"
    elif language == "Hindi":
        reply = "दिन में दो बार ब्रश करना और मौखिक स्वच्छता बनाए रखना बहुत महत्वपूर्ण है। [Demo Mode]"
    else:
        reply = "Dentists recommend brushing twice daily and maintaining good oral hygiene. [Demo Mode]"
        
    return {"reply": reply, "language": language}

@router.post("/message", response_model=ChatResponse)
async def send_message(payload: ChatMessage, current_user: models.User = Depends(get_current_user)):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return get_demo_fallback(payload.message, payload.language)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    dynamic_prompt = SYSTEM_PROMPT.replace("{language}", payload.language)
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": dynamic_prompt},
            {"role": "user", "content": payload.message}
        ],
        "temperature": 0.5
    }

    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data, timeout=30.0)
            response.raise_for_status()
            result = response.json()
            
            reply_text = result["choices"][0]["message"]["content"]
            
            return {"reply": reply_text.strip(), "language": payload.language}
            
    except Exception as e:
        print(f"Chatbot error: {e}")
        return get_demo_fallback(payload.message, payload.language)
