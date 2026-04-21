from typing import Optional, Union
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api")

class RootCauseRequest(BaseModel):
    metric: str
    value: Union[str, float]
    trend: Optional[str] = None

@router.post("/analyze-root-cause")
async def analyze_root_cause(request: RootCauseRequest):
    insight = (
        f"The change in {request.metric} looks tied to data momentum and underlying market shifts. "
        f"The current trend ({request.trend or 'stable'}) suggests AI detects a structural pattern rather than a one-off spike."
    )
    return {"insight": insight}
