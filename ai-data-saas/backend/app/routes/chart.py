from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.chart_service import suggest_chart

router = APIRouter(prefix="/chart")

@router.post("/")
async def chart(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    suggestion = suggest_chart(df)

    return {"chart": suggestion}