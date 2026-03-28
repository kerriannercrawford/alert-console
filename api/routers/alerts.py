from fastapi import APIRouter
from api.crud.alerts import get_all, create, get_by_id, create_delivery_event
from api.models import (
    Alert,
    Status,
    Severity,
    Channel,
    CreateAlert,
    AlertDetail,
    DeliveryEvent,
    CreateDeliveryEvent
)

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

@router.post("", response_model=Alert)
async def create_alert(data: CreateAlert) -> Alert:
    return create(data)

@router.get("/{alert_id}", response_model=AlertDetail)
async def get_alert(alert_id: str) -> AlertDetail:
    return get_by_id(alert_id)

@router.post("/{alert_id}/events", response_model=DeliveryEvent)
async def add_delivery_event(alert_id: str, data: CreateDeliveryEvent) -> DeliveryEvent:
    return create_delivery_event(alert_id, data)