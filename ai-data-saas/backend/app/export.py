from reportlab.pdfgen import canvas

def create_pdf_report(user_name, summary_text):
    c = canvas.Canvas(f"{user_name}_report.pdf")
    c.drawString(100, 750, f"Data Analysis Report for {user_name}")
    c.drawString(100, 700, summary_text)
    c.save()
    return f"{user_name}_report.pdf"