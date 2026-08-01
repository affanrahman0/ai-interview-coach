"""
PHASE 3: Answer table - user's response to a question.
"""

from datetime import datetime
from sqlalchemy import Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

# so here Mapped[int] = mapped_column(Integer). this kind of syntax denotes a column in the database i.e int in python and Integer in database. This is just a type hint and a way to tell the database what type of data to store in the column.

class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id"), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    question: Mapped["Question"] = relationship("Question", back_populates="answer")
    evaluation: Mapped["Evaluation | None"] = relationship("Evaluation", back_populates="answer", uselist=False)
