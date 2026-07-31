from sqlalchemy.orm import Session
from app.models.project import Project, ProjectMember
from app.models.user import User
from app.models.activity import Activity
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.exceptions import NotFoundException, ForbiddenException


def get_project(db: Session, project_id: int, user_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise NotFoundException("Project")
    if project.owner_id != user_id and user_id not in [m.user_id for m in project.members]:
        raise ForbiddenException()
    return project

def create_project(db: Session, project_data: ProjectCreate, owner_id: int) -> Project:
    project = Project(**project_data.model_dump(), owner_id=owner_id)
    db.add(project)
    db.commit()
    db.refresh(project)

    # Log activity
    activity = Activity(
        action="project_created",
        details=f"Project '{project.name}' created",
        project_id=project.id,
        user_id=owner_id
    )
    db.add(activity)
    db.commit()

    return project

def update_project(db: Session, project_id: int, project_data: ProjectUpdate, user_id: int) -> Project:
    project = get_project(db, project_id, user_id)
    if project.owner_id != user_id:
        raise ForbiddenException()

    for field, value in project_data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project_id: int, user_id: int):
    project = get_project(db, project_id, user_id)
    if project.owner_id != user_id:
        raise ForbiddenException()

    db.delete(project)
    db.commit()

def add_member(db: Session, project_id: int, user_id: int, member_id: int):
    project = get_project(db, project_id, user_id)
    if project.owner_id != user_id:
        raise ForbiddenException()

    member = db.query(User).filter(User.id == member_id).first()
    if not member:
        raise NotFoundException("User")

    already_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == member_id
    ).first()

    if not already_member:
        new_member = ProjectMember(project_id=project_id, user_id=member_id)
        db.add(new_member)
        db.commit()

    return project