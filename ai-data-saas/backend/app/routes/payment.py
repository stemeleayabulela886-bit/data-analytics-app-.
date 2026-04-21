from fastapi import APIRouter
from app.services.payment import create_checkout

router = APIRouter(prefix="/payment")

@router.get("/checkout")
def checkout():
    url = create_checkout()
    return {"url": url}
