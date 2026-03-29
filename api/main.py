from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.crud.alerts import init_data
from api.routers.alerts import router as alerts_router
from api.routers.websocket import router as websocket_router

init_data()

app = FastAPI(title="Event App", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alerts_router)
app.include_router(websocket_router)

@app.get("/", response_model=str)
async def test_endpoint() -> str:
    return "hello world"
