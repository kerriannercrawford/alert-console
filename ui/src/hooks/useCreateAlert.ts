import { Alert, CreateAlert } from '../types.ts'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createAlert } from '../api/alert.ts'


export function useCreateAlert(): { alert?: Alert | null; create: (data: CreateAlert) => Promise<Alert | null>; loading: boolean } {
    const [alert, setAlert] = useState<Alert | null>(null)
    const [loading, setLoading] = useState(false)

    async function create(data: CreateAlert): Promise<Alert | null> {
        try {
            setLoading(true)

            const newAlert = await createAlert(data)
            setAlert(newAlert)

            return newAlert
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to create alert')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { create, alert, loading }
}