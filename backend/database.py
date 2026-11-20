import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# MySQL only. Set DATABASE_URL in backend/.env
DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/vibestay"
)


def ensure_database():
    """Create the MySQL database (e.g. `vibestay`) if it does not exist yet."""
    url = make_url(DATABASE_URL)
    if not url.drivername.startswith("mysql") or not url.database:
        return
    server_engine = create_engine(url.set(database=None))
    with server_engine.connect() as conn:
        conn.exec_driver_sql(
            f"CREATE DATABASE IF NOT EXISTS `{url.database}` "
            "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
    server_engine.dispose()


ensure_database()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
