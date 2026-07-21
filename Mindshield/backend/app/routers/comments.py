from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.comment import CommentCreate, CommentResponse
from app.models.comment import Comment
from app.models.activity import Activity
from app.services.task import get_task
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/comments", tags=["comments"])

@router.get("/task/{task_id}", response_model=List[CommentResponse])
def get_comments(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_task(db, task_id, current_user.id)
    return db.query(Comment).filter(Comment.task_id == task_id).order_by(Comment.created_at.desc()).all()

@router.post("", response_model=CommentResponse)
def create(comment_data: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    get_task(db, comment_data.task_id, current_user.id)
    
    comment = Comment(**comment_data.model_dump(), author_id=current_user.id)
    db.add(comment)
    
    # Log activity
    activity = Activity(
        action="comment_added",
        details=f"Comment added to task {comment_data.task_id}",
        project_id=db.query(Comment).first().task.project_id if False else None,
        task_id=comment_data.task_id,
        user_id=current_user.id
    )
    
    db.commit()
    db.refresh(comment)
    return comment