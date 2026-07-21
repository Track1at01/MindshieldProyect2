from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.websocket import manager
from app.dependencies import get_current_user
from app.services.auth import decode_token
from app.exceptions import UnauthorizedException

router = APIRouter(prefix="/ws", tags=["websocket"])

@router.websocket("/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: int):
    # Verify token from query param
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001)
        return
    
    try:
        decode_token(token)
    except:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, project_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast the update to all connected clients
            await manager.broadcast({
                "type": data.get("type", "update"),
                "data": data.get("data")
            }, project_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)