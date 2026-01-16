from pydantic import BaseModel

class WasteResponse(BaseModel):
    waste_type: str
    confidence: float
    disposal_method: str
    sustainability_tip: str
