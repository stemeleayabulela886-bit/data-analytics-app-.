from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.ai_service import generate_insights

router = APIRouter(prefix="/insights")

@router.post("/")
async def insights(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    data_json = df.head(20).to_json()
    result = generate_insights(data_json)

    return {"insights": result}
