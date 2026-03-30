export function connectToAlertStream(
    onMessage: (data: unknown) => void,
    onOpen: () => void,
    onError: (error: Event) => void,
    onClose: () => void
): WebSocket {
    const socket = new WebSocket('ws://localhost:8000/ws')

    socket.onopen = () => {
        onOpen()
    }

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage(data)
        } catch {
            console.error('Failed to parse WebSocket message:', event.data)
        }
    }

    socket.onerror = (error) => {
        onError(error)
    }

    socket.onclose = () => {
        onClose()
    }

    return socket
}