import { useEffect, useState } from 'react'
import { DeliveryEvent } from '../types.ts'
import { connectToAlertStream } from '../api/websocket.ts'

export function useWebSocket(onMessage: (data: DeliveryEvent) => void) {
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const socket = connectToAlertStream(
            (data) => {
                onMessage(data as DeliveryEvent)
            },
            () => {
                setIsConnected(true)
                setError(null)
            },
            (error) => {
                setError(error?.type || 'WebSocket error')
                setIsConnected(false)
            },
            () => {
                setIsConnected(false)
            }
        )

        return () => {
            socket.close()
        }
    }, [onMessage])

    return { isConnected, error }
}