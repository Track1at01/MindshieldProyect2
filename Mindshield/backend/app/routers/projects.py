from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.models.user import User
from app.models.project import Project
from app.services.project import create_project, get_project, update_project, delete_project, add_member
from app.dependencies import get_current_user, require_admin
from app.exceptions import NotFoundException

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).filter(
        (Project.owner_id == current_user.id) | 
        (Project.members.any(id=current_user.id))
    ).all()

@router.post("", response_model=ProjectResponse)
def create(project_data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_project(db, project_data, current_user.id)

@router.get("/{project_id}", response_model=ProjectResponse)
def get(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_project(db, project_id, current_user.id)

@router.put("/{project_id}", response_model=ProjectResponse)
def update(project_id: int, project_data: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_project(db, project_id, project_data, current_user.id)

@router.delete("/{project_id}")
def delete(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_project(db, project_id, current_user.id)
    return {"message": "Project deleted"}

@router.post("/{project_id}/members/{user_id}", response_model=ProjectResponse)
def add_project_member(project_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return add_member(db, project_id, current_user.id, user_id)