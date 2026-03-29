import { useEffect, useState } from "react";
import { fetchAlerts } from "../api/alert.ts";
import { AlertSummary } from "../types.ts";

export function useAlerts(): { alerts: AlertSummary[]; error: string | null; loading: boolean; refetch: () => void } {
    const [alerts, setAlerts] = useState<AlertSummary[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchAlerts().then((alerts: AlertSummary[]) => {
            setAlerts(alerts);
            setLoading(false);
        }).catch(error => {
            setError(error?.message)
            setLoading(false);
        })
    }, [tick]);

    return { alerts, error, loading, refetch: () => setTick(t => t + 1) };
}