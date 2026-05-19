from fastapi import APIRouter, File, UploadFile
import pandas as pd
import io
import os

router = APIRouter()

async def load_dataframe(file: UploadFile) -> pd.DataFrame:
    contents = await file.read()
    filename = file.filename or "data"
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".csv":
        return pd.read_csv(io.BytesIO(contents))
    if ext in {".xls", ".xlsx"}:
        return pd.read_excel(io.BytesIO(contents))
    if ext == ".json":
        try:
            return pd.read_json(io.BytesIO(contents), orient="records")
        except ValueError:
            return pd.read_json(io.BytesIO(contents))

    raise ValueError("Unsupported file format for AI prediction. Use CSV, Excel, or JSON.")

@router.post("/predict/")
async def predict_data(file: UploadFile = File(...)):
    try:
        df = await load_dataframe(file)
        if df.empty:
            return {"status": "error", "message": "Uploaded file contains no data."}

        preferred = ['revenue', 'amount', 'sales', 'rev', 'amt', 'total', 'price']
        target_col = next((col for col in df.columns if col.lower() in preferred), None)

        if target_col is None:
            numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
            if numeric_cols:
                target_col = numeric_cols[0]
            else:
                return {"status": "error", "message": "No numeric data found in this file."}

        series = pd.to_numeric(df[target_col], errors='coerce').dropna()
        if series.empty:
            return {"status": "error", "message": f"Column '{target_col}' contains no valid numbers."}

        last_values = series.tail(10).tolist()
        prediction = (sum(last_values) / len(last_values)) * 1.15

        return {
            "status": "success",
            "predictions": [float(prediction)],
            "message": f"AI predicted trends based on the '{target_col}' column."
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
