from fastapi import APIRouter
from app.core.security import hash_password, create_token
from app.notifications import send_welcome_email

router = APIRouter(prefix="/auth")

users = []

@router.post("/signup")
def signup(email: str, password: str):
    users.append({"email": email, "password": hash_password(password)})
    send_welcome_email(email)
    return {"message": "User created"}

@router.post("/login")
def login(email: str, password: str):
    for user in users:
        if user["email"] == email:
            token = create_token({"email": email})
            return {"token": token}
    return {"error": "Invalid login"}
