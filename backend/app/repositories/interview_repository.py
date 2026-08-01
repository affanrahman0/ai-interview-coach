"""
PHASE 3: Data-access layer for Interview / Question / Answer.
"""

# from sqlalchemy.orm import Session
# from app.models.interview import Interview
#
#
# def get_interviews_by_user(db: Session, user_id: int):
#     return db.query(Interview).filter(Interview.user_id == user_id).order_by(
#         Interview.created_at.desc()
#     ).all()
#
#
# def get_interview_by_id(db: Session, interview_id: int, user_id: int):
#     return db.query(Interview).filter(
#         Interview.id == interview_id, Interview.user_id == user_id
#     ).first()
