from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse
from typing import Optional

class ActivityResponse(BaseModel):
    id: int
    action: str
    details: Optional[str] = None
    project_id: int
    task_id: Optional[int] = None
    user_id: int
    created_at: datetime
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True