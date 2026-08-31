"""
PHASE 1: Application settings loaded from environment variables (.env).
Uncomment fields as you introduce them in later phases.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ---- Phase 1: Core ----
    APP_NAME: str = "AI Interview Coach"
    ENV: str = "development"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ---- Phase 1: Database ----
    DATABASE_URL: str

    # ---- Phase 3: AI providers ----
    GROQ_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None

    # ---- Phase 6: File storage ----
    CLOUDINARY_URL: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
