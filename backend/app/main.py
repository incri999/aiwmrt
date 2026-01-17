from fastapi import FastAPI, UploadFile, File, HTTPException
from app.gemini import classify_waste
from app.database import save_record

app = FastAPI(
    title="AI Waste Management API",
    version="1.0.0"
)

# ✅ CORS FIX (THIS IS WHAT YOU WERE MISSING)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for internship/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-waste")
async def analyze_waste(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()

        # 🔹 Existing working classification
        result = classify_waste(image_bytes)

        # 🔹 Safe DB logging (will NOT break API)
        try:
            save_record(result)
        except Exception as db_error:
            print("Neon DB error:", db_error)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
