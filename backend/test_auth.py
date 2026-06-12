from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from models import User, LearningProgress

client = TestClient(app)
db = SessionLocal()

# Create a test user if not exists
user = db.query(User).filter(User.email == "test@example.com").first()
if not user:
    user = User(email="test@example.com", full_name="Test User", hashed_password="pw", is_verified=True)
    db.add(user)
    db.commit()
    db.refresh(user)

# ensure progress exists
progress = db.query(LearningProgress).filter(LearningProgress.user_id == user.id).first()
if not progress:
    progress = LearningProgress(user_id=user.id)
    db.add(progress)
    db.commit()

from utils import create_access_token
token = create_access_token({"sub": user.email})
response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
print(response.status_code)
import json
print(json.dumps(response.json(), indent=2))
