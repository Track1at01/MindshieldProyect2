from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth_router, projects_router, tasks_router, comments_router, websocket_router
from app.exceptions import KanbanException

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kanban API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler
@app.exception_handler(KanbanException)
async def kanban_exception_handler(request, exc: KanbanException):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(comments_router)
app.include_router(websocket_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}