from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse

class ActivityResponse(BaseModel):
    id: int
    action: str
    details: str
    project_id: int
    task_id: int
    user_id: int
    created_at: datetime
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True