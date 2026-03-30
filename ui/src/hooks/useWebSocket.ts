import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DeliveryEvent } from '../types.ts'
import { connectToAlertStream } from '../api/websocket.ts'

export function useWebSocket(onMessage: (data: DeliveryEvent) => void) {
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socket = connectToAlertStream(
            (data) => {
                onMessage(data as DeliveryEvent)
            },
            () => {
                setIsConnected(true)
            },
            () => {
                setIsConnected(false)
                toast.error('Lost real-time connection. Live updates may be delayed.')
            },
            () => {
                setIsConnected(false)
            }
        )

        return () => {
            socket.close()
        }
    }, [onMessage])

    return { isConnected }
}