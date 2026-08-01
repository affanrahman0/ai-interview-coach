"""
PHASE 3: Interview endpoints - start an interview (generate questions), submit an answer, get next question.
"""
from app.models.evaluation import Evaluation
from app.services.evaluation_service import evaluate_answer
from app.utils.json_helpers import to_json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.interview import Interview
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.interview_schema import InterviewCreate, InterviewOut, AnswerSubmit
from app.services.ai_service import generate_interview_questions

router = APIRouter()


@router.post("/start", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
def start_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch current user's active resume if available
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    # 2. Create new Interview record
    interview = Interview(
        user_id=current_user.id,
        resume_id=resume.id if resume else None,
        interview_type=payload.interview_type,
        difficulty=payload.difficulty,
        num_questions=payload.num_questions,
        status="in_progress",
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    # 3. Generate questions using AI / fallback generator
    raw_resume_text = str(resume.raw_text or "") if resume else ""
    questions_text = generate_interview_questions(
        resume_text=raw_resume_text,
        interview_type=payload.interview_type,
        difficulty=payload.difficulty,
        num_questions=payload.num_questions,
    )

    # 4. Save generated questions to database
    for i, q_text in enumerate(questions_text, start=1):
        db.add(Question(interview_id=interview.id, order_index=i, text=q_text))
    
    db.commit()
    db.refresh(interview)

    return interview


@router.post("/answer")
def submit_answer(
    payload: AnswerSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Verify question exists
    question = db.query(Question).filter(Question.id == payload.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Question not found"
        )

    # 2. Save or update answer
    existing_answer = db.query(Answer).filter(Answer.question_id == payload.question_id).first()
    if existing_answer:
        existing_answer.text = payload.text
        answer = existing_answer
    else:
        answer = Answer(question_id=payload.question_id, text=payload.text)
        db.add(answer)

    db.commit()
    db.refresh(answer)

    # 3. Trigger per-answer AI Evaluation
    eval_data = evaluate_answer(str(question.text), payload.text)
    
    existing_eval = db.query(Evaluation).filter(Evaluation.answer_id == answer.id).first()
    if existing_eval:
        db.delete(existing_eval)
        db.commit()

    evaluation = Evaluation(
        answer_id=answer.id,
        technical_score=eval_data.get("technical_score", 0.0),
        communication_score=eval_data.get("communication_score", 0.0),
        completeness_score=eval_data.get("completeness_score", 0.0),
        confidence_score=eval_data.get("confidence_score", 0.0),
        missing_concepts=to_json(eval_data.get("missing_concepts")),
        better_answer=eval_data.get("better_answer", ""),
        learning_resources=to_json(eval_data.get("learning_resources")),
    )
    db.add(evaluation)
    db.commit()

    return {"message": "Answer submitted and evaluated successfully", "answer_id": answer.id}



@router.get("/{interview_id}", response_model=InterviewOut)
def get_interview(
    interview_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
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
        
    return interview
