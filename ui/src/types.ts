export type Severity = "low" | "medium" | "high" | "critical"
export type Audience = "responders" | "admins" | "all"
export type Channel = "sms" | "email" | "push" | "chat"
export type Status = "draft" | "active" | "resolved"
export type EventType = "queued" | "sent" | "delivered" | "failed" | "read"

export type Alert = {
    id: string
    title: string
    message: string
    severity: Severity
    audience: Audience
    channel: Channel
    status: Status
    created_at: string
}

export type CreateAlert = {
    title: string
    message: string
    severity: Severity
    audience: Audience
    channel: Channel
    status: Status
}

export type DeliveryEvent = {
    id: string
    alert_id: string
    event_type: EventType
    timestamp: string
    recipient?: string | null
    recipient_count?: number | null
}

export type CreateDeliveryEvent = {
    event_type: EventType
    recipient?: string | null
    recipient_count?: number | null
}

export type AlertDetail = {
    alert: Alert
    events: DeliveryEvent[]
}