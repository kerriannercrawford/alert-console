"""
For purposes of this takehome, decided to use an in-memory store to 
store the events for ease of implementation. This can be swapped out
for a database-backed implementation without touching the rest of the app.
"""
from models import Alert, Severity, Status, Channel
import json

_alerts: dict[str, Alert] = {}

def _init_alerts() -> None:
    with open("crud/data.json", "r") as f:
        data = json.load(f)
        for alert in data["alerts"]:
            _alerts[alert["id"]] = Alert(**alert)

def get_all(
    status: Status | None,
    severity: Severity | None,
    channel: Channel | None,
) -> list[Alert]:
    alerts = list(_alerts.values())

    if status is not None:
        alerts = [alert for alert in alerts if alert.status == status]

    if severity is not None:
        alerts = [alert for alert in alerts if alert.severity == severity]

    if channel is not None:
        alerts = [alert for alert in alerts if alert.channel == channel]

    return alerts