import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def detect_action(question: str):
    question = question.lower()

    if "clean" in question:
        return "clean"
    elif "predict" in question:
        return "predict"
    elif "kpi" in question or "summary" in question:
        return "kpi"
    else:
        return "chat"