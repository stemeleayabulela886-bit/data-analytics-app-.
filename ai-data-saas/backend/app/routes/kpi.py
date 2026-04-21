from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.kpi_service import generate_kpis

router = APIRouter(prefix="/kpi")

@router.post("/")
async def kpi(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    kpis = generate_kpis(df)

    return {"kpis": kpis}