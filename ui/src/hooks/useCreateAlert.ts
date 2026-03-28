import {Alert, CreateAlert} from "../types.ts";
import {useEffect, useState} from "react";
import {createAlert} from "../api/alert.ts";


export function useCreateAlert(data: CreateAlert): { alert?: Alert; error: string | null } {
    const [alert, setAlert] = useState<Alert>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        createAlert(data).then((alert: Alert) => {
            setAlert(alert);
        }).catch(error => {
            setError(error?.message)
        })
    })

    return { alert, error };
}