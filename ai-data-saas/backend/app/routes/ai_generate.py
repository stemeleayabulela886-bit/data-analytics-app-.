from fastapi import APIRouter
from app.services.action_ai import detect_action

router = APIRouter(prefix="/ai")


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
        visuals.append({"id": 1, "title": "AI Generated Regional Performance", "type": "bar"})
    if "line" in prompt or "trend" in prompt:
        visuals.append({"id": 2, "title": "AI Generated Trend", "type": "line"})
    if "kpi" in prompt or "revenue" in prompt or "sales" in prompt or action == "kpi":
        kpis.append({"id": 1, "title": "Projected Revenue Growth", "value": "$84,210", "trend": "+18.4", "isPositive": True})

    # Fallback suggestion when nothing recognized
    if not visuals and not kpis:
        visuals.append({"id": 3, "title": "Suggested Overview", "type": "bar"})

    return {"visuals": visuals, "kpis": kpis, "message": "Generated layout suggestions."}
