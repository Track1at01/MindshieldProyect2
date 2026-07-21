from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.user import UserResponse

class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)

class CommentCreate(CommentBase):
    task_id: int

class CommentResponse(CommentBase):
    id: int
    task_id: int
    author_id: int
    created_at: datetime
    author: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True