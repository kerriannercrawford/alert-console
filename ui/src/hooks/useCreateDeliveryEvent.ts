import {CreateDeliveryEvent, DeliveryEvent} from "../types.ts";
import {useEffect, useState} from "react";
import {createDeliveryEvent} from "../api/alert.ts";


export function useCreateDeliveryEvent(alertId: string, data: CreateDeliveryEvent): { deliveryEvent?: DeliveryEvent; error: string | null } {
    const [deliveryEvent, setDeliveryEvent] = useState<DeliveryEvent>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        createDeliveryEvent(alertId, data).then((event: DeliveryEvent) => {
            setDeliveryEvent(event);
        }).catch(error => {
            setError(error?.message)
        })
    })

    return { deliveryEvent, error };
}