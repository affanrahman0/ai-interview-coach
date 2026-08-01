"""
PHASE 3: Interview table - one row per interview session.
"""

from datetime import datetime
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("resumes.id"), nullable=True)

    interview_type: Mapped[str] = mapped_column(String, nullable=False)   # HR / DSA / Backend / Frontend / Python / Java / SQL / System Design
    difficulty: Mapped[str] = mapped_column(String, nullable=False)         # Easy / Medium / Hard
    num_questions: Mapped[int] = mapped_column(Integer, nullable=False)      # 5 / 10 / 15

    status: Mapped[str] = mapped_column(String, default="in_progress")      # in_progress / completed
    overall_score: Mapped[int | None] = mapped_column(Integer, nullable=True)        # PHASE 4

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="interviews")
    questions: Mapped[list["Question"]] = relationship("Question", back_populates="interview", cascade="all, delete-orphan")
    feedback: Mapped["Feedback | None"] = relationship("Feedback", back_populates="interview", uselist=False)

