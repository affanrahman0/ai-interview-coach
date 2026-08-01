"""
PHASE 4: Evaluation table - AI scoring for a single answer.
"""

from sqlalchemy import Integer, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    answer_id: Mapped[int] = mapped_column(Integer, ForeignKey("answers.id"), nullable=False, unique=True)

    technical_score: Mapped[float] = mapped_column(Float, nullable=False)
    communication_score: Mapped[float] = mapped_column(Float, nullable=False)
    completeness_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    missing_concepts: Mapped[str | None] = mapped_column(Text, nullable=True)   # JSON-encoded list
    better_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    learning_resources: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON-encoded list

    answer: Mapped["Answer"] = relationship("Answer", back_populates="evaluation")
