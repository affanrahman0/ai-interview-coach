# Architecture Overview

> PHASE 6 (but start sketching early): Fill this in as the system takes shape.

## High-level diagram
```
[React (Vercel)] --HTTPS--> [FastAPI (Render)] --SQL--> [PostgreSQL (Neon)]
                                    |
                                    +--> [Groq / Gemini API]
                                    +--> [Cloudinary / Local storage]
```

## Components
- **Frontend**: React + Vite + Tailwind SPA. Talks to backend only via REST API.
- **Backend**: FastAPI, layered as api -> services -> repositories -> models.
- **Database**: PostgreSQL, accessed via SQLAlchemy ORM.
- **AI layer**: Prompt templates in `app/prompts`, called from `app/services/ai_service.py` and `evaluation_service.py`.
- **File storage**: Resume PDFs stored locally in dev, Cloudinary in production.

## Design principles
- Routers stay thin: validation + calling services only.
- Business logic lives in `services/`.
- DB queries live in `repositories/`.
- Prompts are versioned and isolated in `prompts/` so they can be iterated on independently of application code.
