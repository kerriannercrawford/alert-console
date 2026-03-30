import { CreateDeliveryEvent, DeliveryEvent } from '../types.ts'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createDeliveryEvent } from '../api/alert.ts'

export function useCreateDeliveryEvent(): {
    simulate: (alertId: string, data: CreateDeliveryEvent) => Promise<DeliveryEvent | null>;
    loading: boolean;
} {
    const [loading, setLoading] = useState(false)

    async function simulate(alertId: string, data: CreateDeliveryEvent): Promise<DeliveryEvent | null> {
        setLoading(true)
        try {
            return await createDeliveryEvent(alertId, data)
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to simulate event')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { simulate, loading }
}
