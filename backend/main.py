"""
AI Interview Coach - Backend Entrypoint
=========================================
Uncomment sections as you complete each phase of the project.
Run with: uvicorn main:app --reload
"""
import logging

# Configure global logging to write to a file
logging.basicConfig(
    filename='ai_coach.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ------------------------------------------------------------------
# PHASE 1: Basic app + CORS
# ------------------------------------------------------------------
app = FastAPI(
    title="AI Interview Coach",
    description="AI-powered interview preparation platform",
    version="0.1.0",
)

origins = [
    "http://localhost:5173",   # Vite dev server
    "https://your-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Interview Coach API is running"}


# ------------------------------------------------------------------
# PHASE 1: Database init (create tables on startup - dev only)
# ------------------------------------------------------------------
from app.database.session import engine, Base
from app.models import user  # noqa: F401 (import so tables register)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# ------------------------------------------------------------------
# PHASE 1: Auth routes
# ------------------------------------------------------------------
from app.api import auth as auth_router
app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])


# ------------------------------------------------------------------
# PHASE 2: Resume routes
# ------------------------------------------------------------------
from app.api import resume as resume_router
app.include_router(resume_router.router, prefix="/api/resume", tags=["Resume"])


# ------------------------------------------------------------------
# PHASE 3: Interview routes
# ------------------------------------------------------------------
from app.api import interview as interview_router
app.include_router(interview_router.router, prefix="/api/interview", tags=["Interview"])


# ------------------------------------------------------------------
# PHASE 4: Evaluation routes
# ------------------------------------------------------------------
from app.api import evaluation as evaluation_router
app.include_router(evaluation_router.router, prefix="/api/evaluation", tags=["Evaluation"])


# ------------------------------------------------------------------
# PHASE 5: Dashboard routes
# ------------------------------------------------------------------
from app.api import dashboard as dashboard_router
app.include_router(dashboard_router.router, prefix="/api/dashboard", tags=["Dashboard"])


# ------------------------------------------------------------------
# PHASE 1 (later hardening): Logging middleware
# ------------------------------------------------------------------
# from app.middleware.logging_middleware import LoggingMiddleware
# app.add_middleware(LoggingMiddleware)
