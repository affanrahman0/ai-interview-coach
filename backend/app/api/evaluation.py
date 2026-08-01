from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.interview import Interview
from app.models.feedback import Feedback
from app.schemas.evaluation_schema import FeedbackOut
from app.services.evaluation_service import generate_final_feedback
from app.utils.json_helpers import to_json

router = APIRouter()


@router.post("/{interview_id}/complete", response_model=FeedbackOut, status_code=status.HTTP_200_OK)
def complete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id, 
        Interview.user_id == current_user.id
    ).first()
    
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Interview session not found"
        )

    # 1. Generate aggregated feedback report using AI
    feedback_data = generate_final_feedback(interview)

    # 2. Check if feedback already exists for this interview
    existing_feedback = db.query(Feedback).filter(Feedback.interview_id == interview.id).first()
    if existing_feedback:
        db.delete(existing_feedback)
        db.commit()

    # 3. Create Feedback record
    feedback = Feedback(
        interview_id=interview.id,
        overall_score=feedback_data.get("overall_score", 0.0),
        strengths=to_json(feedback_data.get("strengths")),
        weaknesses=to_json(feedback_data.get("weaknesses")),
        improvement_areas=to_json(feedback_data.get("improvement_areas")),
        topics_to_study=to_json(feedback_data.get("topics_to_study")),
    )
    db.add(feedback)

    # 4. Mark interview as completed
    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)
    interview.overall_score = int(feedback_data.get("overall_score", 0.0))

    db.commit()
    db.refresh(feedback)
    return feedback


@router.get("/{interview_id}/report", response_model=FeedbackOut)
def get_report(
    interview_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    feedback = db.query(Feedback).join(Interview).filter(
        Interview.id == interview_id, 
        Interview.user_id == current_user.id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Report not found for this interview"
        )
        
    return feedback
