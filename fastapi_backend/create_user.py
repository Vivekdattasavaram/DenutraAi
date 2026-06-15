import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from models import User
from database import Base
from utils import get_password_hash

load_dotenv()

from database import Base, SessionLocal, engine

def create_user(email: str, password: str = "password123"):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists.")
            return

        print(f"Creating new user: {email}")
        hashed = get_password_hash(password)
        new_user = User(
            email=email,
            full_name="Standard User",
            hashed_password=hashed,
            is_verified=True,
            is_admin=False
        )
        db.add(new_user)
        db.commit()
        print(f"Success: Standard account '{email}' created with password '{password}'.")
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "testuser@example.com"
    create_user(email)
