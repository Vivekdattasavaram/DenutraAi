import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from models import User
from database import Base
from utils import get_password_hash

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./oral_health.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_admin(email: str, password: str = "password123"):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists. Promoting...")
            user.is_admin = True
            user.is_verified = True
            db.commit()
            print("Promoted successfully.")
            return

        print(f"Creating new admin user: {email}")
        hashed = get_password_hash(password)
        new_admin = User(
            email=email,
            full_name="System Admin",
            hashed_password=hashed,
            is_verified=True,
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        print(f"Success: Admin account '{email}' created with password '{password}'.")
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@example.com"
    create_admin(email)
