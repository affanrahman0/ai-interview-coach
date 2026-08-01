"""
PHASE 2: Resume table - stores uploaded resume metadata + parsed content.
"""

from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    file_url: Mapped[str] = mapped_column(String, nullable=False)          # path or Cloudinary URL
    raw_text: Mapped[str | None] = mapped_column(Text, nullable=True)      # extracted text
    skills: Mapped[str | None] = mapped_column(Text, nullable=True)        # JSON-encoded list
    education: Mapped[str | None] = mapped_column(Text, nullable=True)     # JSON-encoded list
    experience: Mapped[str | None] = mapped_column(Text, nullable=True)    # JSON-encoded list
    projects: Mapped[str | None] = mapped_column(Text, nullable=True)      # JSON-encoded list
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Given any Resume object in code (for instance, when inspecting a resume upload), you can instantly access the user who owns it via resume.owner. For example: resume.owner.email or resume.owner.full_name
    owner: Mapped["User"] = relationship("User", back_populates="resumes")
    
    # PHASE 3: interview relationships (once Interview model is created)
    # interviews: Mapped[list["Interview"]] = relationship("Interview", back_populates="resume")
