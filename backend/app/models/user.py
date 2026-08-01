"""
PHASE 1: User table.
"""

from datetime import datetime
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # PHASE 2+: relationships to other tables
    # this will directly map user to resume (list of resumes) and it can be accessed like user.resumes
    
    resumes: Mapped[list["Resume"]] = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")
    interviews: Mapped[list["Interview"]] = relationship("Interview", back_populates="owner", cascade="all, delete-orphan")


