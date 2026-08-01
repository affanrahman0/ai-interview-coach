"""
PHASE 4: Pydantic schemas for per-answer evaluation and final interview feedback.
"""

from pydantic import BaseModel, field_validator
from typing import List, Optional
from app.utils.json_helpers import from_json


class EvaluationOut(BaseModel):
    technical_score: float
    communication_score: float
    completeness_score: float
    confidence_score: Optional[float] = None
    missing_concepts: Optional[List[str]] = []
    better_answer: Optional[str] = None
    learning_resources: Optional[List[str]] = []

    @field_validator("missing_concepts", "learning_resources", mode="before")
    @classmethod
    def decode_json_fields(cls, v):
        if isinstance(v, str):
            return from_json(v)
        return v or []

    class Config:
        from_attributes = True


class FeedbackOut(BaseModel):
    overall_score: float
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    improvement_areas: Optional[List[str]] = []
    topics_to_study: Optional[List[str]] = []
    report_pdf_url: Optional[str] = None

    @field_validator("strengths", "weaknesses", "improvement_areas", "topics_to_study", mode="before")
    @classmethod
    def decode_json_fields(cls, v):
        if isinstance(v, str):
            return from_json(v)
        return v or []

    class Config:
        from_attributes = True
