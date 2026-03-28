import {Alert} from "../types.ts";
import {useEffect, useState} from "react";
import {fetchAlertDetails} from "../api/alert.ts";

export function useAlertDetail(alertId: string): { alert?: Alert; error: string | null; loading: boolean } {
    const [alert, setAlert] = useState<Alert>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAlertDetails(alertId).then((alertDetail) => {
            setAlert(alertDetail.alert);
            setLoading(false);
        }).catch(error => setError(error?.message));
    }, [])

    return { alert, error, loading };
}