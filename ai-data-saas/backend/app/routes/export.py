from fastapi import APIRouter
from app.export import create_pdf_report

router = APIRouter(prefix="/export")

@router.post("/pdf")
async def export_pdf(user_name: str, summary_text: str):
    pdf_path = create_pdf_report(user_name, summary_text)
    return {"pdf_path": pdf_path}