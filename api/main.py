from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.alerts import router as alerts_router
from crud.alerts import _init_alerts
from crud.deliveryEvents import _init_delivery_events

_init_alerts()
_init_delivery_events()

app = FastAPI(title="Event App", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alerts_router)

@app.get("/", response_model=str)
async def test_endpoint() -> str:
    return "hello world"