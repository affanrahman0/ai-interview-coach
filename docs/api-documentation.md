# API Documentation

> FastAPI auto-generates interactive docs at `/docs` (Swagger) and `/redoc`.
> Use this file for a human-readable summary once endpoints are implemented.

## Auth (`/api/auth`)
- `POST /register` - create a new user
- `POST /login` - returns JWT access token

## Resume (`/api/resume`)
- `POST /upload` - upload PDF resume
- `GET /` - get current user's resume
- `DELETE /` - delete resume

## Interview (`/api/interview`)
- `POST /start` - generate questions and create interview session
- `POST /answer` - submit an answer for a question
- `GET /{interview_id}` - get interview + its questions

## Evaluation (`/api/evaluation`)
- `POST /{interview_id}/complete` - trigger final scoring + feedback
- `GET /{interview_id}/report` - get final report

## Dashboard (`/api/dashboard`)
- `GET /summary` - aggregate stats
- `GET /history` - past interviews list
