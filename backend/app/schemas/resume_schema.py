"""
PHASE 2: Pydantic schemas for resume upload/response.
"""

from pydantic import BaseModel, field_validator
from typing import List, Optional
from app.utils.json_helpers import from_json


class ResumeOut(BaseModel):
    id: int
    file_url: str
    skills: Optional[List[str]] = []
    education: Optional[List[str]] = []
    experience: Optional[List[str]] = []
    projects: Optional[List[str]] = []

    @field_validator("skills", "education", "experience", "projects", mode="before")
    @classmethod
    def decode_json_fields(cls, v):
        if isinstance(v, str):
            return from_json(v)
        return v or []

    class Config:
        from_attributes = True
