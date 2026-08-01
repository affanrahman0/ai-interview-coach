# Deployment Guide

> PHASE 6

## Frontend -> Vercel
1. Push `frontend/` to GitHub.
2. Import project in Vercel, set root directory to `frontend`.
3. Set env var `VITE_API_BASE_URL` to your deployed backend URL.

## Backend -> Render
1. Push `backend/` to GitHub.
2. Create a new Web Service on Render, root directory `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set env vars: `SECRET_KEY`, `DATABASE_URL`, `GROQ_API_KEY` / `GEMINI_API_KEY`, etc.

## Database -> Neon Postgres
1. Create a Neon project, copy the connection string into `DATABASE_URL`.
2. Run Alembic migrations (once introduced) against the Neon DB.

## CI/CD -> GitHub Actions
See `.github/workflows/ci.yml` - runs backend tests and frontend build on every push.

## Docker (optional local dev parity)
See root `docker-compose.yml` for running backend + Postgres locally in containers.
