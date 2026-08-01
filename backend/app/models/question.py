"""
PHASE 3: Question table - AI-generated questions for an interview.
"""

from sqlalchemy import Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    interview_id: Mapped[int] = mapped_column(Integer, ForeignKey("interviews.id"), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)   # position in the interview (1, 2, 3...)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    interview: Mapped["Interview"] = relationship("Interview", back_populates="questions")
    answer: Mapped["Answer | None"] = relationship("Answer", back_populates="question", uselist=False)
