"""
PHASE 2: Resume endpoints - upload, view, replace, delete.
"""

import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume_schema import ResumeOut
from app.services.resume_parser import extract_text_from_pdf, parse_resume_sections
from app.utils.json_helpers import to_json

router = APIRouter()

# Directory to store uploaded resume PDFs locally during development
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Validate file extension
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Only PDF files are supported"
        )

    # 2. Extract raw text from PDF
    file.file.seek(0)
    raw_text = extract_text_from_pdf(file)
    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Could not extract text from the provided PDF"
        )

    # 3. Parse resume sections (extract skills, etc.)
    parsed = parse_resume_sections(raw_text)

    # 4. Save PDF file locally to disk
    file_path = os.path.join(UPLOAD_DIR, f"user_{current_user.id}_{file.filename}")
    file.file.seek(0)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # 5. Check if user already has a resume uploaded; if so, replace it
    existing_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if existing_resume:
        db.delete(existing_resume)
        db.commit()

    # 6. Save new Resume record in database
    new_resume = Resume(
        user_id=current_user.id,
        file_url=file_path,
        raw_text=raw_text,
        skills=to_json(parsed.get("skills")),
        education=to_json(parsed.get("education")),
        experience=to_json(parsed.get("experience")),
        projects=to_json(parsed.get("projects")),
    )
    
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume


@router.get("/", response_model=ResumeOut)
def get_resume(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No resume uploaded yet"
        )
    return resume


@router.delete("/")
def delete_resume(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No resume to delete"
        )
        
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

# # PHASE 2: PUT /replace could reuse the upload logic (delete old, save new)
