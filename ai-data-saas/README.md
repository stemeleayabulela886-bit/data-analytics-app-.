# AI Data SaaS

A starter fullstack scaffold for an AI-powered data SaaS application.

## Structure

- `backend/` — FastAPI backend
- `frontend/` — React frontend
- `docker-compose.yml` — Compose file for local development

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker

```bash
docker compose up --build
```
