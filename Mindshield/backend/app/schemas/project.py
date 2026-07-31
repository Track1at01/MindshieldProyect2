from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.user import UserResponse

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    name: Optional[str] = Field(None, min_length=1, max_length=200)

class MemberResponse(BaseModel):
    project_id: int
    user_id: int
    user: UserResponse

    class Config:
        from_attributes = True

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    owner: Optional[UserResponse] = None
    members: List[MemberResponse] = []

    class Config:
        from_attributes = True