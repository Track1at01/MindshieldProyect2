from sqlalchemy.orm import Session
from app.models.task import Task, TaskStatus
from app.models.activity import Activity
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.project import get_project
from app.exceptions import NotFoundException, ForbiddenException

def get_task(db: Session, task_id: int, user_id: int) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise NotFoundException("Task")
    get_project(db, task.project_id, user_id)
    return task

def create_task(db: Session, task_data: TaskCreate, user_id: int) -> Task:
    get_project(db, task_data.project_id, user_id)
    
    # Get max position for status
    max_pos = db.query(Task).filter(
        Task.project_id == task_data.project_id,
        Task.status == task_data.status
    ).count()
    
    task = Task(**task_data.model_dump(), position=max_pos)
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Log activity
    activity = Activity(
        action="task_created",
        details=f"Task '{task.title}' created",
        project_id=task.project_id,
        task_id=task.id,
        user_id=user_id
    )
    db.add(activity)
    db.commit()
    
    return task

def update_task(db: Session, task_id: int, task_data: TaskUpdate, user_id: int) -> Task:
    task = get_task(db, task_id, user_id)
    
    old_status = task.status
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    
    # Log status change
    if task_data.status and old_status != task_data.status:
        activity = Activity(
            action="task_moved",
            details=f"Task moved from {old_status} to {task_data.status}",
            project_id=task.project_id,
            task_id=task.id,
            user_id=user_id
        )
        db.add(activity)
        db.commit()
    
    return task

def delete_task(db: Session, task_id: int, user_id: int):
    task = get_task(db, task_id, user_id)
    db.delete(task)
    db.commit()