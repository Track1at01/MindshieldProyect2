from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.models.user import User
from app.models.task import Task, TaskStatus
from app.services.tasks import create_task, get_task, update_task, delete_task
from app.dependencies import get_current_user
from app.exceptions import NotFoundException

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskResponse])
def list_tasks(
    project_id: int,
    status: Optional[TaskStatus] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.project import get_project
    get_project(db, project_id, current_user.id)
    
    query = db.query(Task).filter(Task.project_id == project_id)
    
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))
    
    return query.order_by(Task.position).all()

@router.post("", response_model=TaskResponse)
def create(task_data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_task(db, task_data, current_user.id)

@router.get("/{task_id}", response_model=TaskResponse)
def get(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_task(db, task_id, current_user.id)

@router.put("/{task_id}", response_model=TaskResponse)
def update(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_task(db, task_id, task_data, current_user.id)

@router.delete("/{task_id}")
def delete(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_task(db, task_id, current_user.id)
    return {"message": "Task deleted"}