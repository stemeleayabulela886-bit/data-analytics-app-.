from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.data_cleaning import clean_data

router = APIRouter(prefix="/clean")

@router.post("/")
async def clean(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    cleaned_df, report = clean_data(df)

    return {
        "report": report,
        "preview": cleaned_df.head().to_dict()
    }