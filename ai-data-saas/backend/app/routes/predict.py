from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.ml_service import predict

router = APIRouter(prefix="/predict")

@router.post("/")
async def make_prediction(file: UploadFile = File(...), target: str = ""):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    result = predict(df, target)

    return {"predictions": result[:10]}
