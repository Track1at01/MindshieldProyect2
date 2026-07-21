from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime, server_default="now()")
    
    owned_projects = relationship("Project", back_populates="owner", foreign_keys="Project.owner_id")
    tasks = relationship("Task", back_populates="assignee")
    comments = relationship("Comment", back_populates="author")
    activities = relationship("Activity", back_populates="user")
    project_memberships = relationship("ProjectMember", back_populates="user")