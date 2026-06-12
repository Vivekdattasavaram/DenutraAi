import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_groq():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("API Key not found!")
        return

    print(f"API Key found: {api_key[:5]}...")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a test."},
            {"role": "user", "content": "hello"}
        ],
        "temperature": 0.5
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data, timeout=30.0)
            response.raise_for_status()
            result = response.json()
            print("Response:", result["choices"][0]["message"]["content"])
    except Exception as e:
        print(f"Chatbot error: {e}")
        try:
            print("Response body:", response.text)
        except:
            pass

if __name__ == "__main__":
    asyncio.run(test_groq())
