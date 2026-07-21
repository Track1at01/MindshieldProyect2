from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.task import TaskStatus, TaskPriority
from app.schemas.user import UserResponse

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None
    tags: Optional[str] = Field(None, max_length=500)

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None
    position: Optional[int] = None
    tags: Optional[str] = Field(None, max_length=500)

class TaskResponse(TaskBase):
    id: int
    project_id: int
    position: int
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True