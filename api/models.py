from pydantic import BaseModel
from typing import Literal

class Alert(BaseModel):
    id: str
    title: str
    message: str
    severity: Literal["low", "medium", "high", "critical"]
    audience: Literal["responders", "admins", "all"]
    channel: Literal["sms", "email", "push", "chat"]
    status: Literal["draft", "active", "resolved"]
    created_at: str

class DeliveryEvent(BaseModel):
    id: str
    alert_id: str
    event_type: Literal["queued", "sent", "delivered", "failed", "read"]
    timestamp: str
    recipient: str | None = None
    recipient_count: int | None = None
