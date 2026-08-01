"""
PHASE 3: Pydantic schemas for creating an interview and submitting answers.
"""

from pydantic import BaseModel
from typing import Literal, List, Optional


class InterviewCreate(BaseModel):
    interview_type: Literal["HR", "DSA", "Backend", "Frontend", "Python", "Java", "SQL", "System Design"]
    difficulty: Literal["Easy", "Medium", "Hard"]
    num_questions: Literal[5, 10, 15]


class QuestionOut(BaseModel):
    id: int
    order_index: int
    text: str

    class Config:
        from_attributes = True


class InterviewOut(BaseModel):
    id: int
    interview_type: str
    difficulty: str
    num_questions: int
    status: str
    questions: Optional[List[QuestionOut]] = []

    class Config:
        from_attributes = True


class AnswerSubmit(BaseModel):
    question_id: int
    text: str
