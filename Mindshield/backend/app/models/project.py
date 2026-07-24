from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from app.database import Base

project_members = Table(
    "project_members",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String(1000))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default="now()")
    
    owner = relationship("User", back_populates="owned_projects", foreign_keys=[owner_id])
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    members = relationship("User", secondary=project_members, back_populates="project_memberships")
    activities = relationship("Activity", back_populates="project", cascade="all, delete-orphan")

# The association table is already defined above as project_members.
# Keeping a separate ORM class for it is unnecessary and causes duplicate table registration.
