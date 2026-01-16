import google.generativeai as genai
import os, json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-pro")

def classify_waste(image_bytes: bytes):
    prompt = """
You are an AI waste management expert.

Identify the waste in the image and classify it STRICTLY.

Return ONLY valid JSON:
{
  "waste_type": "Plastic | Organic | Recyclable | E-Waste | General",
  "confidence": 0.0-1.0,
  "disposal_method": "short instruction",
  "sustainability_tip": "short tip"
}
"""

    response = model.generate_content(
        [
            prompt,
            {"mime_type": "image/png", "data": image_bytes}
        ],
        generation_config={"temperature": 0.2}
    )

    try:
        return json.loads(response.text)
    except Exception:
        raise RuntimeError(response.text)
