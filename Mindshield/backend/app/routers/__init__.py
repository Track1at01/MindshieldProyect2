from app.routers.auth import router as auth_router
from app.routers.projects import router as projects_router
from app.routers.tasks import router as tasks_router
from app.routers.comments import router as comments_router
from app.routers.activities import router as activities_router
from app.routers.websocket import router as websocket_router

__all__ = ["auth_router", "projects_router", "tasks_router", "comments_router", "activities_router", "websocket_router"]