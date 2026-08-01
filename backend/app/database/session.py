"""
PHASE 1: SQLAlchemy engine, session factory, and declarative base.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
# pyrefly: ignore [missing-import]
from app.config.settings import settings

# 1. Create the SQLAlchemy engine using the database URL we just configured
engine = create_engine(settings.DATABASE_URL)

# 2. Create a session factory for generating database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3. Create the Base class that our database models (tables) will inherit from
Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
