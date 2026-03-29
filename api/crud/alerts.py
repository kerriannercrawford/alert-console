"""
For purposes of this takehome, decided to use an in-memory store to
store the events for ease of implementation. This can be swapped out
for a database-backed implementation without touching the rest of the app.
"""
import json
import uuid
from datetime import datetime, timezone

from api.models import (
    Alert,
    AlertDetail,
    AlertSummary,
    Channel,
    CreateAlert,
    CreateDeliveryEvent,
    DeliveryEvent,
    Severity,
    Status,
)

_alerts: dict[str, Alert] = {}
_events_by_alert: dict[str, list] = {}

def init_data() -> None:
    with open("api/crud/data.json") as f:
        data = json.load(f)
        for alert in data["alerts"]:
            _alerts[alert["id"]] = Alert(**alert)
        for event in data["delivery_events"]:
            if event["alert_id"] not in _events_by_alert:
                _events_by_alert[event["alert_id"]] = []
            _events_by_alert[event["alert_id"]].append(event)

def get_all(
    status: Status | None = None,
    severity: Severity | None = None,
    channel: Channel | None = None,
) -> list[AlertSummary]:
    alerts = list(_alerts.values())

    if status is not None:
        alerts = [alert for alert in alerts if alert.status == status]

    if severity is not None:
        alerts = [alert for alert in alerts if alert.severity == severity]

    if channel is not None:
        alerts = [alert for alert in alerts if alert.channel == channel]

    summaries = []
    for alert in alerts:
        events = _events_by_alert.get(alert.id, [])
        latest = max(
            events,
            key=lambda e: e["timestamp"] if isinstance(e, dict) else e.timestamp,
            default=None,
        )
        if latest is not None and isinstance(latest, dict):
            latest = DeliveryEvent(**latest)
        summaries.append(AlertSummary(**alert.model_dump(), latest_event=latest))

    return summaries

def create(data: CreateAlert) -> Alert:
    alert_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    print(created_at)
    alert = Alert(**data.model_dump(), id=alert_id, created_at=created_at)
    _alerts[alert_id] = Alert(**data.model_dump(), id=alert_id, created_at=created_at)
    return alert

def get_by_id(alert_id: str) -> AlertDetail:
    if alert_id not in _alerts:
        raise Exception("Alert not found")
    alert = _alerts[alert_id]
    events = _events_by_alert.get(alert_id, [])
    return AlertDetail(alert=alert, events=events)

def create_delivery_event(alert_id: str, data: CreateDeliveryEvent) -> DeliveryEvent:
    if alert_id not in _alerts:
        raise Exception("Alert not found")
    if alert_id not in _events_by_alert:
        _events_by_alert[alert_id] = []
    event_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()
    event = DeliveryEvent(
        **data.model_dump(), id=event_id, alert_id=alert_id, timestamp=timestamp
    )
    _events_by_alert[alert_id].append(event)



    return event
