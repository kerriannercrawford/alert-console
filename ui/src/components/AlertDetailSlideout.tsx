import {AlertDetail, AlertDetailSlideoutProps, EventType} from "../types.ts";
import {useAlertDetail} from "../hooks/useAlertDetail.ts";
import {useCreateDeliveryEvent} from "../hooks/useCreateDeliveryEvent.ts";
import {useEffect, useMemo, useState} from "react";

const eventTypeOptions: EventType[] = ["queued", "sent", "delivered", "failed", "read"]

export function AlertDetailSlideout({ alertId, onClose, isOpen, liveEvents }: AlertDetailSlideoutProps) {
    const { alertDetail, loading, error } = useAlertDetail(alertId)
    const [localAlertDetail, setLocalAlertDetail] = useState<AlertDetail | null>(null)
    const [selectedEventType, setSelectedEventType] = useState<EventType>("queued")
    const [recipientCount, setRecipientCount] = useState<number | null>(null)
    const { simulate, loading: simulating, error: simError } = useCreateDeliveryEvent()

    useEffect(() => {
        setLocalAlertDetail(alertDetail ?? null)
    }, [alertDetail])

    useEffect(() => {
        if (!liveEvents.length) return

        setLocalAlertDetail((current) => {
            if (!current) return current

            const existingIds = new Set(current.events.map((event) => event.id))
            const newEvents = liveEvents.filter((event) => !existingIds.has(event.id))

            if (!newEvents.length) return current

            return {
                ...current,
                events: [...current.events, ...newEvents],
            }
        })
    }, [liveEvents])

    const sortedEvents = useMemo(() => {
        if (!localAlertDetail) return []

        return [...localAlertDetail.events].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
    }, [localAlertDetail])

    return (
        <>
            <div className={`drawer-backdrop${isOpen ? " is-open" : ""}`} onClick={onClose} />
            <aside className={`drawer${isOpen ? " is-open" : ""}`}>
                <div className="drawer-header">
                    <h2>Alert Details</h2>
                    <button onClick={onClose}>Close</button>
                </div>

                {alertId && loading && <p>Loading alert details...</p>}
                {alertId && error && <p>{error}</p>}

                {alertId && alertDetail && (
                    <>
                        <div className="drawer-body">
                            <h3>{alertDetail.alert.title}</h3>
                            <p><strong>ID:</strong> {alertDetail.alert.id}</p>
                            <p><strong>Message:</strong> {alertDetail.alert.message}</p>
                            <p><strong>Severity:</strong> {alertDetail.alert.severity}</p>
                            <p><strong>Audience:</strong> {alertDetail.alert.audience}</p>
                            <p><strong>Channel:</strong> {alertDetail.alert.channel}</p>
                            <p><strong>Status:</strong> {alertDetail.alert.status}</p>
                            <p><strong>Created At:</strong> {new Date(alertDetail.alert.created_at).toLocaleString()}</p>

                            <h4>Delivery Events</h4>
                            <ul>
                                {sortedEvents.map((event) => (
                                    <li key={event.id}>
                                        <strong>{event.event_type}</strong> — {new Date(event.timestamp).toLocaleString()}
                                        {event.recipient_count != null && <> ({event.recipient_count} recipients)</>}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="drawer-footer">
                            <select
                                className="simulate-select"
                                value={selectedEventType}
                                onChange={(e) => setSelectedEventType(e.target.value as EventType)}
                                disabled={simulating}
                            >
                                {eventTypeOptions.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <input
                                className="simulate-recipients"
                                type="number"
                                min={1}
                                placeholder="# recipients"
                                value={recipientCount ?? ""}
                                onChange={(e) => setRecipientCount(e.target.value ? parseInt(e.target.value) : null)}
                                disabled={simulating}
                            />
                            <button
                                className="simulate-btn"
                                disabled={simulating}
                                onClick={() => simulate(alertId, { event_type: selectedEventType, recipient_count: recipientCount })}
                            >
                                {simulating ? "Simulating…" : "Simulate Event"}
                            </button>
                            {simError && <p className="error">{simError}</p>}
                        </div>
                    </>
                )}
            </aside>
        </>
    )
}