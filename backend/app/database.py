import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load .env file automatically (works for local dev; no-op in production)
try:
    # pyrefly: ignore [missing-import]
    from dotenv import load_dotenv
    # Walk up to find the project root .env (CRIC/.env)
    _here = os.path.dirname(os.path.abspath(__file__))
    _root = os.path.dirname(os.path.dirname(_here))  # CRIC/
    _env_path = os.path.join(_root, ".env")
    load_dotenv(_env_path)
except ImportError:
    pass  # python-dotenv not installed; rely on system env vars

# -------------------------------------------------------
# DATABASE URL RESOLUTION
# Priority: DATABASE_URL env var (Supabase/Neon/any PG)
#           → Falls back to local SQLite for development
# -------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Neon & some providers use 'postgres://' — SQLAlchemy needs 'postgresql://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)
else:
    # Local SQLite fallback for development
    SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cricket_scorehub.db")
    DATABASE_URL = f"sqlite:///{SQLITE_PATH}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
