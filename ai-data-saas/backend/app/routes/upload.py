from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

router = APIRouter(prefix="/upload")

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
    except Exception as ex:
        raise HTTPException(status_code=400, detail=f"Unable to parse uploaded CSV: {str(ex)}")

    return {
        "columns": list(df.columns),
        "rows": len(df)
    }
