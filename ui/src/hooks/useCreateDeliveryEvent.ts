import { CreateDeliveryEvent, DeliveryEvent } from '../types.ts'
import { useState } from 'react'
import { createDeliveryEvent } from '../api/alert.ts'

export function useCreateDeliveryEvent(): {
    simulate: (alertId: string, data: CreateDeliveryEvent) => Promise<DeliveryEvent | null>;
    loading: boolean;
    error: string | null;
} {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function simulate(alertId: string, data: CreateDeliveryEvent): Promise<DeliveryEvent | null> {
        setLoading(true)
        setError(null)
        try {
            return await createDeliveryEvent(alertId, data)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to simulate event')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { simulate, loading, error }
}
