from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.activity import ActivityResponse
from app.models.activity import Activity
from app.dependencies import get_current_user
from app.models.user import User
from app.services.project import get_project

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("/project/{project_id}", response_model=List[ActivityResponse])
def get_project_activities(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    get_project(db, project_id, current_user.id)
    return db.query(Activity).filter(
        Activity.project_id == project_id
    ).order_by(Activity.created_at.desc()).all()

@router.get("/task/{task_id}", response_model=List[ActivityResponse])
def get_task_activities(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.task import get_task
    get_task(db, task_id, current_user.id)
    return db.query(Activity).filter(
        Activity.task_id == task_id
    ).order_by(Activity.created_at.desc()).all()