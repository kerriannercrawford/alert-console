from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["websocket"])

_connections: list[WebSocket] = []

@router.websocket("")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    _connections.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            for connection in _connections:
                await connection.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        _connections.remove(websocket)


async def broadcast_event(event: dict):
    for connection in _connections:
        try:
            await connection.send_json(event)
        except Exception:
            _connections.remove(connection)