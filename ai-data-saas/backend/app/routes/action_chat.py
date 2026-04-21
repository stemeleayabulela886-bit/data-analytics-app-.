from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
from app.services.action_ai import detect_action
from app.services.data_cleaning import clean_data
from app.services.kpi_service import generate_kpis
from app.services.ml_service import predict

router = APIRouter(prefix="/action")

@router.post("/")
async def action_chat(file: UploadFile = File(...), question: str = "", target: str = ""):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    action = detect_action(question)

    if action == "clean":
        _, report = clean_data(df)
        return {"action": "clean", "result": report}

    elif action == "kpi":
        kpis = generate_kpis(df)
        return {"action": "kpi", "result": kpis}

    elif action == "predict":
        result = predict(df, target)
        return {"action": "predict", "result": result[:10]}

    else:
        return {"action": "chat", "message": "Ask something like: clean, predict, or KPI"}