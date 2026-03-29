import {AlertDetail} from "../types.ts";
import {useEffect, useState} from "react";
import {fetchAlertDetails} from "../api/alert.ts";

export function useAlertDetail(alertId?: string | null): { alertDetail?: AlertDetail | null; error: string | null; loading: boolean } {
    const [alertDetail, setAlertDetail] = useState<AlertDetail | null>()
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!alertId) {
            setAlertDetail(null)
            return
        }

        fetchAlertDetails(alertId).then((alertDetail) => {
            setAlertDetail(alertDetail);
            setLoading(false);
        }).catch(error => setError(error?.message));
    }, [alertId])

    return { alertDetail, error, loading };
}