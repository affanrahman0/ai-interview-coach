from io import BytesIO
from fastapi import UploadFile
import pdfplumber


def extract_text_from_pdf(file: UploadFile) -> str:
    """Extracts raw text from an uploaded PDF resume."""
    text = ""
    with pdfplumber.open(BytesIO(file.file.read())) as pdf:
        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"
    return text.strip()


def parse_resume_sections(raw_text: str) -> dict:
    """
    Keyword-based skill extraction for Phase 2.
    Scans raw text for common technical skills.
    (In Phase 3+, this can be upgraded to an LLM prompt call).
    """
    common_skills = [
        "Python", "Java", "C++", "JavaScript", "TypeScript", "React", "Node.js", 
        "FastAPI", "Django", "Flask", "SQL", "PostgreSQL", "MongoDB", "Docker", 
        "AWS", "Git", "HTML", "CSS", "Machine Learning", "REST API", "SQLAlchemy"
    ]
    
    extracted_skills = []
    text_lower = raw_text.lower()
    
    for skill in common_skills:
        if skill.lower() in text_lower:
            extracted_skills.append(skill)
            
    return {
        "skills": extracted_skills,
        "education": [],
        "experience": [],
        "projects": [],
    }
