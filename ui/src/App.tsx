import {useAlerts} from "./hooks/useAlerts.ts";
import {AlertsTable} from "./components/AlertsTable.tsx";
import {useCallback, useMemo, useState} from "react";
import {AlertDetailSlideout} from "./components/AlertDetailSlideout.tsx";
import {CreateAlertSlideout} from "./components/CreateAlertSlideout.tsx";
import {DeliveryEvent} from "./types.ts";
import {useWebSocket} from "./hooks/useWebSocket.ts";

export default function App() {
    const { alerts, loading, error, refetch } = useAlerts()
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null)
    const [createAlertOpen, setCreateAlertOpen] = useState(false)
    const [deliveryEvents, setDeliveryEvents] = useState<DeliveryEvent[]>([])

    const handleIncomingEvent = useCallback((event: DeliveryEvent) => {
        setDeliveryEvents((current) => {
            const alreadyExists = current.some((existing) => existing.id === event.id)
            if (alreadyExists) return current

            return [...current, event]
        })
    }, [])

    const selectedAlertLiveEvents = useMemo(() => {
        if (!selectedAlertId) return []

        return deliveryEvents.filter((event) => event.alert_id === selectedAlertId)
    }, [deliveryEvents, selectedAlertId])

    const { isConnected, error: websocketError } = useWebSocket(handleIncomingEvent)

    return (
        <div className="App">
            <h1>Alerts</h1>
            { loading && <p>Loading...</p> }
            { error && <p style={{ color: 'red' }}>Error: {error}</p> }

            {
                !loading && !error && (
                    <AlertsTable alerts={alerts} loading={loading} onRefresh={refetch} onCreateAlert={() => setCreateAlertOpen(true)} onRowClick={(alertId) => {
                        console.log(alertId)
                        setSelectedAlertId(alertId)
                    }}/>
                )
            }

            <CreateAlertSlideout isOpen={createAlertOpen} onClose={() => {
                setCreateAlertOpen(false)
                refetch()
            }} />

            <AlertDetailSlideout
                alertId={selectedAlertId}
                isOpen={selectedAlertId !== null}
                onClose={() => setSelectedAlertId(null)}
                liveEvents={selectedAlertLiveEvents}
            />
        </div>
    )
}