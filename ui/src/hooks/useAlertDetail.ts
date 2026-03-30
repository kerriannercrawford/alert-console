import { AlertDetail } from '../types.ts'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchAlertDetails } from '../api/alert.ts'

export function useAlertDetail(alertId?: string | null): { alertDetail?: AlertDetail | null; loading: boolean } {
    const [alertDetail, setAlertDetail] = useState<AlertDetail | null>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!alertId) {
            setAlertDetail(null)
            setLoading(false)
            return
        }

        setLoading(true)
        fetchAlertDetails(alertId).then((alertDetail) => {
            setAlertDetail(alertDetail)
            setLoading(false)
        }).catch(error => {
            toast.error(error?.message ?? 'Failed to load alert details')
            setLoading(false)
        })
    }, [alertId])

    return { alertDetail, loading }
}