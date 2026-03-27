"""
For purposes of this takehome, decided to use an in-memory store to 
store the events for ease of implementation. This can be swapped out
for a database-backed implementation without touching the rest of the app.
"""
from models import DeliveryEvent
import json

_delivery_events: dict[str, DeliveryEvent] = {}

def _init_delivery_events() -> None:
    with open("crud/data.json", "r") as f:
        data = json.load(f)
        for delivery_event in data["delivery_events"]:
            _delivery_events[delivery_event["id"]] = DeliveryEvent(**delivery_event)

def get_all() -> list[DeliveryEvent]:
    return list(_delivery_events.values())