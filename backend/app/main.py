from fastapi import FastAPI, UploadFile, File
from app.gemini import classify_waste
from app.schemas import WasteResponse
from app.supabase import save_record

app = FastAPI(title="AI Waste Management API")

@app.post("/analyze-waste", response_model=WasteResponse)
async def analyze_waste(image: UploadFile = File(...)):
    image_bytes = await image.read()
    result = classify_waste(image_bytes)

    save_record(result)
    return result
