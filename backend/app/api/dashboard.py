"""
PHASE 5: Dashboard endpoints - history, averages, progress graph, weakest topics.
"""

from typing import cast
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.interview import Interview
from app.models.feedback import Feedback
from app.utils.json_helpers import from_json

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Fetch all completed interviews for the current user
    interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id, 
        Interview.status == "completed"
    ).all()

    if not interviews:
        return {
            "total_interviews": 0,
            "average_score": 0,
            "best_score": 0,
            "weakest_topics": [],
            "total_practice_time_minutes": 0,
        }

    # 1. Calculate Scores
    scores = [cast(float, i.overall_score) for i in interviews if i.overall_score is not None]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    best_score = max(scores) if scores else 0

    # 2. Aggregate Weakest Topics to Study across all feedback reports
    feedback_reports = db.query(Feedback).join(Interview).filter(
        Interview.user_id == current_user.id
    ).all()
    
    topics_list = []
    for report in feedback_reports:
        topics_list.extend(from_json(str(report.topics_to_study)))

    # Get top 5 unique topics
    unique_topics = list(set(topics_list))[:5]

    # 3. Calculate Total Practice Time (in minutes)
    total_minutes = 0
    for i in interviews:
        if i.completed_at and i.created_at:
            delta = i.completed_at - i.created_at
            total_minutes += int(delta.total_seconds() / 60)

    return {
        "total_interviews": len(interviews),
        "average_score": avg_score,
        "best_score": best_score,
        "weakest_topics": unique_topics,
        "total_practice_time_minutes": total_minutes,
    }


@router.get("/history")
def get_interview_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).order_by(desc(Interview.created_at)).all()

    history = []
    for i in interviews:
        history.append({
            "id": i.id,
            "interview_type": i.interview_type,
            "difficulty": i.difficulty,
            "num_questions": i.num_questions,
            "status": i.status,
            "overall_score": i.overall_score,
            "created_at": i.created_at,
            "completed_at": i.completed_at,
        })
        
    return history
