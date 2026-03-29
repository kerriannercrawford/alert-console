import { useAlerts } from './hooks/useAlerts.ts'
import { AlertsTable } from './components/AlertsTable.tsx'
import { useCallback, useMemo, useState } from 'react'
import { AlertDetailSlideout } from './components/AlertDetailSlideout.tsx'
import { CreateAlertSlideout } from './components/CreateAlertSlideout.tsx'
import { DeliveryEvent } from './types.ts'
import { useWebSocket } from './hooks/useWebSocket.ts'

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

    const latestEventByAlertId = useMemo(() => {
        const map: Record<string, DeliveryEvent> = {}

        for (const alert of alerts) {
            if (alert.latest_event) {
                map[alert.id] = alert.latest_event
            }
        }

        for (const event of deliveryEvents) {
            const current = map[event.alert_id]
            if (!current || new Date(event.timestamp) > new Date(current.timestamp)) {
                map[event.alert_id] = event
            }
        }

        return map
    }, [alerts, deliveryEvents])

    const { error: websocketError } = useWebSocket(handleIncomingEvent)

    return (
        <div className="App">
            <h1>Alerts</h1>
            { loading && <p>Loading...</p> }
            { (error || websocketError) && <p style={{ color: 'red' }}>Error: {error || websocketError}</p> }

            {
                !loading && !error && (
                    <AlertsTable
                        alerts={alerts}
                        loading={loading}
                        latestEventByAlertId={latestEventByAlertId}
                        onRefresh={refetch}
                        onCreateAlert={() => setCreateAlertOpen(true)}
                        onRowClick={(alertId) => {
                            setSelectedAlertId(alertId)
                        }}
                    />
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
