"""
For purposes of this takehome, decided to use an in-memory store to 
store the events for ease of implementation. This can be swapped out
for a database-backed implementation without touching the rest of the app.
"""
from models import Alert
import json

_alerts: dict[str, Alert] = {}

def _init_alerts() -> None:
    with open("crud/data.json", "r") as f:
        data = json.load(f)
        for alert in data["alerts"]:
            _alerts[alert["id"]] = Alert(**alert)

def get_all() -> list[Alert]:
    return list(_alerts.values())