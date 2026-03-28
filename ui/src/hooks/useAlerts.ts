import { useEffect, useState } from "react";
import { fetchAlerts } from "../api/alert.ts";
import { Alert } from "../types.ts";

export function useAlerts(): { alerts: Alert[]; error: string | null; loading: boolean } {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAlerts().then((alerts: Alert[]) => {
            setAlerts(alerts);
            setLoading(false);
        }).catch(error => {
            setError(error?.message)
        })
    }, []);

    return { alerts, error, loading };
}