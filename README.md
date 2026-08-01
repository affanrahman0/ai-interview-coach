# AI Interview Coach

A full-stack AI-powered interview preparation platform. Users upload their resume,
get personalized mock interviews (HR, DSA, Backend, Frontend, System Design, etc.),
receive AI-generated feedback per answer, and track progress over time on a dashboard.

> 📄 **See `PROJECT_CONTEXT.md` for the full spec, architecture, conventions, and phase-by-phase build plan.**
> That file is written for both humans and AI coding assistants (e.g. Antigravity, Claude Code) to pick up full context instantly.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Axios + React Router
- **Backend**: FastAPI + SQLAlchemy + Pydantic + JWT
- **Database**: PostgreSQL (Neon in production)
- **AI**: Groq API or Gemini API
- **File storage**: Cloudinary or local disk
- **Deployment**: Vercel (frontend), Render (backend), Neon (DB), GitHub Actions (CI)

## Project Structure
```
AI-Interview-Coach/
├── backend/         FastAPI app (see backend/app/)
├── frontend/         React app (see frontend/src/)
├── docs/             Architecture, ER diagram, API docs, sequence diagrams, deployment guide, roadmap
├── screenshots/       App screenshots for the README/portfolio
├── docker-compose.yml
├── PROJECT_CONTEXT.md  Full SRS + build plan (read this first)
└── README.md
```

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # fill in SECRET_KEY, DATABASE_URL, etc.
uvicorn main:app --reload
```
API will be available at `http://localhost:8000` (docs at `/docs`).

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # set VITE_API_BASE_URL
npm run dev
```
App will be available at `http://localhost:5173`.

## Build Plan (Phases)
1. **Phase 1** - Auth + DB + project skeleton
2. **Phase 2** - Resume upload + parsing
3. **Phase 3** - Interview engine (AI question generation + session flow)
4. **Phase 4** - AI evaluation + scoring + final report
5. **Phase 5** - Dashboard + analytics
6. **Phase 6** - Deployment, Docker, CI/CD, docs, screenshots

Most files in this repo are scaffolded with commented-out code, organized by phase.
Uncomment and implement one phase at a time, in order.

## License
MIT - see `LICENSE`.
