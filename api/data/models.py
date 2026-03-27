from pydantic import BaseModel

class Alert(BaseModel):
    id: str
    title: str
    message: str
    severity: "low" | "medium" | "high" | "critical"
    audience: "responders" | "admins" | "all"
    channel: "sms" | "email" | "push" | "chat"
    status: "draft" | "active" | "resolved"
    created_at: int

class DeliveryEvent(BaseModel):
    id: str
    alert_id: str
    event_type: "queued" | "sent" | "delivered" | "failed" | "read"
    timestamp: int
    recipient: string
    recipient_count: int
