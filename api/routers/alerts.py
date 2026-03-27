from fastapi import APIRouter
from crud.alerts import get_all
from models import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=list[Alert])
async def list_alerts() -> list[Alert]:
    return get_all()