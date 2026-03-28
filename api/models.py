from pydantic import BaseModel
from typing import Literal

Severity = Literal["low", "medium", "high", "critical"]
Audience = Literal["responders", "admins", "all"]
Channel = Literal["sms", "email", "push", "chat"]
Status = Literal["draft", "active", "resolved"]
EventType = Literal["queued", "sent", "delivered", "failed", "read"]

class Alert(BaseModel):
    id: str
    title: str
    message: str
    severity: Severity
    audience: Audience
    channel: Channel
    status: Status
    created_at: str

class CreateAlert(BaseModel):
    title: str
    message: str
    severity: Severity
    audience: Audience
    channel: Channel
    status: Status

class DeliveryEvent(BaseModel):
    id: str
    alert_id: str
    event_type: EventType
    timestamp: str
    recipient: str | None = None
    recipient_count: int | None = None

class CreateDeliveryEvent(BaseModel):
    event_type: EventType
    recipient: str | None = None
    recipient_count: int | None = None

class AlertDetail(BaseModel):
    alert: Alert
    events: list[DeliveryEvent]