
import base64
import os
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_json(text: str) -> str:
    """
    Extracts the first JSON object found in a string.
    """
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in Gemini response")
    return match.group(0)

def classify_waste(image_bytes: bytes) -> dict:
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
You are an AI waste classification system.

CRITICAL RULES:
- Respond with ONLY valid JSON
- Do NOT use markdown
- Do NOT include explanations
- Do NOT include ```json fences

Return EXACTLY this format:

{
  "waste_type": "plastic | paper | metal | glass | organic | e-waste | hazardous | unknown",
  "confidence": 0-100,
  "disposal_method": "short clear method",
  "sustainability_tip": "one useful eco-friendly tip"
}
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=[
            {
                "role": "user",
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": image_base64,
                        }
                    }
                ]
            }
        ]
    )

    raw_text = response.text.strip()
    json_text = extract_json(raw_text)

    import json
    return json.loads(json_text)



