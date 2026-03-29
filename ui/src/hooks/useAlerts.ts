import { useEffect, useState } from "react";
import { fetchAlerts } from "../api/alert.ts";
import { Alert } from "../types.ts";

export function useAlerts(): { alerts: Alert[]; error: string | null; loading: boolean; refetch: () => void } {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchAlerts().then((alerts: Alert[]) => {
            setAlerts(alerts);
            setLoading(false);
        }).catch(error => {
            setError(error?.message)
            setLoading(false);
        })
    }, [tick]);

    return { alerts, error, loading, refetch: () => setTick(t => t + 1) };
}