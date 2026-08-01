# PROJECT CONTEXT — AI Interview Coach

**Purpose of this file**: this is the single source of truth for the project. It is written
so that a human OR an AI coding assistant (Antigravity, Claude Code, Cursor, etc.) opening this
repo cold can understand the full intent, architecture, conventions, and current state, and
know exactly what to build next. Read this file completely before making changes.

---

## 1. Project Vision

Build a full-stack AI-powered interview preparation platform that enables users to practice
realistic technical and HR interviews based on their resume, receive personalized feedback,
and track their progress over time.

The application should be fully deployed and accessible via a public URL. It follows clean
software engineering practices, is production-ready, and serves as a portfolio project
demonstrating backend, frontend, AI integration, authentication, database design, deployment,
and software architecture.

**Guiding rule**: This is not "a project to finish." Treat it like a real product that real
users could sign up for. That mindset should shape folder structure, error handling, UI polish,
testing, deployment, and documentation — not just the core feature logic.

## 2. Problem Statement

Students commonly prepare for interviews by solving coding problems, but lack a platform that
gives personalized mock interviews based on their own resume. Existing platforms typically:
- Ask generic questions
- Don't understand the user's background
- Don't remember previous interviews
- Don't provide detailed feedback
- Don't track improvement

AI Interview Coach solves this by generating personalized mock interviews using LLMs, grounded
in the user's actual resume.

## 3. Functional Requirements (full spec)

### Authentication
- Register, Login, Logout, Reset password (later)
- Secure JWT authentication

### Resume Module
- Upload PDF resume, view uploaded resume, delete resume, replace resume
- Backend extracts text, stores extracted content, parses skills / education / experience / projects

### Interview Module
- User chooses: Interview Type (HR, DSA, Backend, Frontend, Python, Java, SQL, System Design),
  Difficulty (Easy, Medium, Hard), Number of Questions (5, 10, 15)
- **AI Question Generator**: generates questions based on Resume + Selected Role + Difficulty
  (e.g. a resume with Python/FastAPI/ML/React should get questions like "Explain JWT
  Authentication", "Tell me about your ML project", "Why FastAPI over Flask?")
- **Interview Session**: Question → User Answer → Next Question → Repeat

### AI Evaluation
For every answer, return: Technical Score, Communication Score, Completeness, Confidence
(estimated), Missing Concepts, Better Answer, Learning Resources.

### Final Report
After the interview, generate: Overall Score, Strengths, Weaknesses, Improvement Areas,
Topics to Study, and a downloadable PDF report.

### Dashboard
Show: Previous Interviews, Average Score, Progress Graph, Best Performance, Weakest Topics,
Total Practice Time.

## 4. Non-Functional Requirements
Responsive UI, secure authentication, fast response, clean architecture, error handling,
logging, scalable backend, REST APIs, production deployment.

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Axios + React Router |
| Backend | FastAPI + Python + SQLAlchemy + JWT + Pydantic |
| Database | PostgreSQL (Neon in production) |
| AI | Groq API or Gemini API |
| File Storage | Cloudinary or local disk |
| Deployment | Frontend → Vercel, Backend → Render, DB → Neon Postgres |
| Tooling | Git, GitHub, GitHub Actions, Docker |

## 6. Repository Layout

```
AI-Interview-Coach/
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI routers (thin: validation + calling services)
│   │   ├── auth/            # hashing.py, jwt_handler.py, dependencies.py
│   │   ├── config/           # settings.py (Pydantic settings from .env)
│   │   ├── database/         # session.py (engine, SessionLocal, Base, get_db)
│   │   ├── models/            # SQLAlchemy ORM models (one file per table)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # business logic (resume parsing, AI calls, evaluation)
│   │   ├── prompts/            # LLM prompt templates, isolated from service code
│   │   ├── repositories/       # DB query layer, called from services/routers
│   │   ├── middleware/          # logging, etc.
│   │   ├── utils/                # small shared helpers (e.g. JSON encode/decode)
│   │   └── tests/                 # pytest tests, mirrors app/ structure
│   ├── main.py                     # FastAPI app entrypoint, wires routers together
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/          # one file per route (Login, Dashboard, InterviewSession, etc.)
│   │   ├── components/       # reusable UI pieces (Navbar, ProtectedRoute, ...)
│   │   ├── layouts/           # MainLayout wraps authenticated pages
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── hooks/                # useAuth, etc.
│   │   ├── services/              # one file per backend resource (authService, resumeService, ...)
│   │   ├── routes/                 # AppRoutes.jsx — central route table
│   │   ├── utils/
│   │   └── assets/
│   ├── index.html
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── db-diagram.md            # includes Mermaid ER diagram
│   ├── api-documentation.md
│   ├── sequence-diagrams.md      # includes Mermaid sequence diagrams for login + interview flow
│   ├── deployment-guide.md
│   └── roadmap.md
├── screenshots/
├── .github/workflows/ci.yml
├── docker-compose.yml
├── README.md
└── PROJECT_CONTEXT.md            # ← this file
```

## 7. Database Tables

`User`, `Resume`, `Interview`, `Question`, `Answer`, `Evaluation`, `Feedback`.
Relationships and fields are fully specified in `docs/db-diagram.md`. Every model file in
`backend/app/models/` already contains the exact SQLAlchemy column definitions (commented out).

## 8. API Flow

```
Login → Upload Resume → Extract Resume → Generate Questions → Conduct Interview
→ Evaluate Answers → Save Results → Dashboard
```

Full endpoint list is in `docs/api-documentation.md` and mirrored in `backend/app/api/*.py`.

## 9. Architectural Conventions (follow these strictly)

1. **Layering**: `api/` (routers) → `services/` (business logic) → `repositories/` (DB queries)
   → `models/` (ORM). Routers should never contain raw SQLAlchemy queries directly once
   repositories exist — call a repository function instead.
2. **Prompts are isolated**: all LLM prompt text lives in `backend/app/prompts/`, never
   inlined inside a service function. This makes prompt iteration independent of app logic.
3. **Schemas vs Models**: `schemas/` = Pydantic (API contracts), `models/` = SQLAlchemy (DB
   tables). Never return a raw ORM object from an endpoint — always map through a schema.
4. **Frontend services mirror backend routers**: `authService.js` ↔ `/api/auth`,
   `resumeService.js` ↔ `/api/resume`, etc. One service file per backend resource.
5. **JSON-encoded list columns**: fields like `skills`, `strengths`, `missing_concepts` are
   stored as JSON text in the DB (see `backend/app/utils/json_helpers.py`) and decoded back
   into lists in the Pydantic schema / frontend.
6. **Everything is commented, not deleted**: scaffolded files contain real, working code that
   is commented out, organized by phase (`# PHASE 1`, `# PHASE 2`, ...). Implement one phase
   at a time by uncommenting and wiring things together — don't skip ahead or delete the
   phase markers, they document intent for future readers.

## 10. Phase-by-Phase Build Plan

| Phase | Scope | Key files to uncomment/build |
|---|---|---|
| **1** | Auth + DB + skeleton | `main.py`, `config/settings.py`, `database/session.py`, `models/user.py`, `schemas/user_schema.py`, `auth/*`, `api/auth.py`, frontend `Login.jsx`/`Register.jsx`, `AuthContext.jsx`, `services/api.js`/`authService.js` |
| **2** | Resume upload + parsing | `models/resume.py`, `schemas/resume_schema.py`, `services/resume_parser.py`, `api/resume.py`, frontend `ResumeUpload.jsx`, `resumeService.js` |
| **3** | Interview engine | `models/interview.py`/`question.py`/`answer.py`, `schemas/interview_schema.py`, `prompts/interview_prompts.py`, `services/ai_service.py`, `api/interview.py`, frontend `InterviewSetup.jsx`/`InterviewSession.jsx`, `interviewService.js` |
| **4** | AI evaluation + report | `models/evaluation.py`/`feedback.py`, `schemas/evaluation_schema.py`, `prompts/evaluation_prompts.py`, `services/evaluation_service.py`, `api/evaluation.py`, frontend `Report.jsx` |
| **5** | Dashboard + analytics | `api/dashboard.py`, frontend `Dashboard.jsx`, `dashboardService.js`, progress graph (recharts/chart.js) |
| **6** | Deployment + polish | Docker, `.github/workflows/ci.yml`, Vercel/Render/Neon setup, PDF report generation (reportlab), Cloudinary, all files in `docs/`, `screenshots/` |

**Current status as of this scaffold**: all directories and files listed above exist with
commented-out, phase-tagged code. Nothing is implemented/uncommented yet. Phase 1 is the
correct starting point.

## 11. What an AI assistant picking this up should do

1. Read this file fully, then skim `README.md` and `docs/architecture.md`.
2. Check which phase is "current" (ask the user, or look for uncommented code — whichever
   phase has the most uncommented, working code is the active one).
3. Work strictly within that phase's files unless the user asks to jump ahead.
4. When uncommenting code, also uncomment any of its dependencies elsewhere (e.g. uncommenting
   `api/auth.py` also requires uncommenting `main.py`'s auth router include, `database/session.py`,
   `models/user.py`, `schemas/user_schema.py`, `auth/hashing.py`, `auth/jwt_handler.py`).
5. Keep the layered architecture and phase-comment conventions intact for any new files.
6. Update this file's "Current status" section (§10) as phases are completed, so the context
   stays accurate for future sessions.

## 12. Resume/Portfolio Value

This project is meant to demonstrate: full-stack development, backend API design, database
design, authentication & security, AI integration, prompt engineering, software architecture,
cloud deployment, Docker, GitHub Actions, clean code practices, and REST API development.
