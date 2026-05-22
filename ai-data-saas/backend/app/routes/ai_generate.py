from time import time
from fastapi import APIRouter
from app.services.action_ai import detect_action

router = APIRouter(prefix="/ai")


def make_id(offset: int = 0) -> int:
    return int(time() * 1000) + offset


@router.post("/generate")
async def generate_from_prompt(payload: dict):
    """
    Simple AI endpoint that parses a free-text prompt and returns
    a suggested set of visuals and KPIs. This does NOT call OpenAI;
    it uses local heuristics via `detect_action` to decide actions.
    """
    prompt = (payload.get("prompt") or "").lower()

    visuals = []
    kpis = []

    # Use existing action detection to decide on actions
    action = detect_action(prompt)

    if "bar" in prompt or "chart" in prompt or "dashboard" in prompt or action == "kpi":
        visuals.append({"id": make_id(1), "title": "AI Generated Regional Performance", "type": "bar"})
    if "line" in prompt or "trend" in prompt:
        visuals.append({"id": make_id(2), "title": "AI Generated Trend", "type": "line"})
    if "donut" in prompt or "pie" in prompt or "distribution" in prompt:
        visuals.append({"id": make_id(3), "title": "AI Generated Distribution", "type": "donut"})
    if "map" in prompt or "region" in prompt or "country" in prompt:
        visuals.append({"id": make_id(4), "title": "AI Generated Map View", "type": "map"})
    if "gauge" in prompt or "performance" in prompt or "health" in prompt:
        visuals.append({"id": make_id(5), "title": "AI Generated Gauge Metric", "type": "gauge"})
    if "kpi" in prompt or "revenue" in prompt or "sales" in prompt or action == "kpi":
        kpis.append({"id": make_id(6), "title": "Projected Revenue Growth", "value": "$84,210", "trend": "+18.4", "isPositive": True})

    # Fallback suggestion when nothing recognized
    if not visuals and not kpis:
        visuals.append({"id": make_id(7), "title": "Suggested Overview", "type": "bar"})

    return {"visuals": visuals, "kpis": kpis, "message": "Generated layout suggestions."}
