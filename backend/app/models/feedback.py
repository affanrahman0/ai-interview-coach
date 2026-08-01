"""
PHASE 4: Feedback table - final report generated at the end of an interview.
"""

from sqlalchemy import Integer, Text, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    interview_id: Mapped[int] = mapped_column(Integer, ForeignKey("interviews.id"), nullable=False, unique=True)

    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)          # JSON-encoded list
    weaknesses: Mapped[str | None] = mapped_column(Text, nullable=True)         # JSON-encoded list
    improvement_areas: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON-encoded list
    topics_to_study: Mapped[str | None] = mapped_column(Text, nullable=True)    # JSON-encoded list
    report_pdf_url: Mapped[str | None] = mapped_column(Text, nullable=True)     # PHASE 6

    interview: Mapped["Interview"] = relationship("Interview", back_populates="feedback")
