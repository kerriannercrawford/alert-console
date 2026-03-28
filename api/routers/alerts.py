from fastapi import APIRouter
from crud.alerts import get_all
from models import Alert, Status, Severity, Channel

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=list[Alert])
async def list_alerts(
    status: Status | None = None,
    severity: Severity | None = None,
    channel: Channel | None = None,
) -> list[Alert]:
    return get_all(
        status=status,
        severity=severity,
        channel=channel
    )