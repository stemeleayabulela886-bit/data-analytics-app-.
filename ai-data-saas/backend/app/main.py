import stripe
from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app.routes import upload, insights, chat, auth, predict, export, database, clean, kpi, action_chat, chart, dashboard, payment, analysis

stripe.api_key = "your_stripe_secret_key"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Store WebSocket connections
connections = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            for conn in connections:
                await conn.send_text(f"Update: {data}")
    except:
        connections.remove(websocket)

app.include_router(upload.router)
app.include_router(insights.router)
app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(export.router)
app.include_router(database.router)
app.include_router(clean.router)
app.include_router(kpi.router)
app.include_router(action_chat.router)
app.include_router(chart.router)
app.include_router(dashboard.router)
app.include_router(payment.router)
app.include_router(analysis.router)

@app.post("/token")
async def login():
    # In a real app, verify username/password here
    return {"access_token": "your_generated_jwt_token", "token_type": "bearer"}

@app.post("/create-checkout-session")
async def create_checkout():
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price": "price_H5ggY9Iz6pS39z",
            "quantity": 1,
        }],
        mode="subscription",
        success_url="https://your-app.com/success",
        cancel_url="https://your-app.com/cancel",
    )
    return {"url": session.url}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    return {"user": "Ayabulela", "status": "Active"}
