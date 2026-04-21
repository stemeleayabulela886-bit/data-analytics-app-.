from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard")

fake_db = []

class DashboardData(BaseModel):
    user_id: int
    name: str
    data: str

@router.post("/save")
def save_dashboard(dashboard: DashboardData):
    fake_db.append({
        "user_id": dashboard.user_id,
        "name": dashboard.name,
        "data": dashboard.data
    })
    return {"message": "Dashboard saved", "id": len(fake_db)}

@router.get("/list/{user_id}")
def list_dashboards(user_id: int):
    user_dashboards = [d for d in fake_db if d["user_id"] == user_id]
    return {"dashboards": user_dashboards}

@router.get("/{dashboard_id}")
def get_dashboard(dashboard_id: int):
    if dashboard_id <= len(fake_db):
        return {"dashboard": fake_db[dashboard_id - 1]}
    return {"error": "Dashboard not found"}
