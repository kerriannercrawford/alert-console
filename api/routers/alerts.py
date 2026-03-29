from fastapi import APIRouter
from api.crud.alerts import get_all, create, get_by_id, create_delivery_event
from api.models import (
    Alert,
    AlertSummary,
    Status,
    Severity,
    Channel,
    CreateAlert,
    AlertDetail,
    DeliveryEvent,
    CreateDeliveryEvent
)
from api.routers.websocket import broadcast_event

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("", response_model=list[AlertSummary])
async def list_alerts(
    status: Status | None = None,
    severity: Severity | None = None,
    channel: Channel | None = None,
) -> list[AlertSummary]:
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
    event = create_delivery_event(alert_id, data)
    await broadcast_event(event.model_dump())
    return event