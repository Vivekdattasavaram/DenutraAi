import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from models import User
from database import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./oral_health.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def promote_admin(email: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return
        
        user.is_admin = True
        db.commit()
        print(f"Success: User '{email}' has been promoted to Admin.")
    except Exception as e:
        print(f"Failed to promote user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
        sys.exit(1)
    promote_admin(sys.argv[1])
