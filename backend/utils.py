import os
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv
import random
import string

load_dotenv()

import bcrypt

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def create_notification(db, user_id: int, title: str, message: str, type: str, action_route: str = None, metadata_json: dict = None):
    import models # Local import to prevent circular dependency
    new_notif = models.Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        action_route=action_route,
        metadata_json=metadata_json or {}
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif
