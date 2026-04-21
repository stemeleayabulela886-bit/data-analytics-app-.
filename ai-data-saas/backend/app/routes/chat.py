from fastapi import APIRouter, UploadFile, File
import pandas as pd
import io
import openai

router = APIRouter(prefix="/chat")

openai.api_key = "YOUR_API_KEY"

@router.post("/")
async def chat(file: UploadFile = File(...), question: str = ""):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    prompt = f"""
    You are a data analyst AI.

    Dataset:
    {df.head(20)}

    User question:
    {question}

    Give clear insights, recommendations, and actions.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"response": response['choices'][0]['message']['content']}
