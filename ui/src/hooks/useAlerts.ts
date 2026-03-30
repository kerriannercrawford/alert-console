import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchAlerts } from '../api/alert.ts'
import { AlertSummary } from '../types.ts'

export function useAlerts(): { alerts: AlertSummary[]; loading: boolean; refetch: () => void } {
    const [alerts, setAlerts] = useState<AlertSummary[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [tick, setTick] = useState(0)

    useEffect(() => {
        setLoading(true)
        fetchAlerts().then((alerts: AlertSummary[]) => {
            setAlerts(alerts)
            setLoading(false)
        }).catch(error => {
            toast.error(error?.message ?? 'Failed to load alerts')
            setLoading(false)
        })
    }, [tick])

    return { alerts, loading, refetch: () => setTick(t => t + 1) }
}