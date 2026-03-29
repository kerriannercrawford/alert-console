import { Alert, CreateAlert } from '../types.ts'
import { useState } from 'react'
import { createAlert } from '../api/alert.ts'


export function useCreateAlert(): { alert?: Alert | null; error: string | null; create: (data: CreateAlert) => Promise<Alert | null>; loading: boolean } {
    const [alert, setAlert] = useState<Alert | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function create(data: CreateAlert): Promise<Alert | null> {
        try {
            setLoading(true)
            setError(null)

            const newAlert = await createAlert(data)
            setAlert(newAlert)

            return newAlert
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Failed to create alert')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { create, alert, error, loading }
}