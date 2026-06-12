import time
import sys
from pathlib import Path
import requests

# Ensure project root is on sys.path so we can import the app package when run as a script
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from database import SessionLocal
import models, utils

DB = SessionLocal()

import os
EMAIL = 'test_ml_user@example.com'
PASSWORD = os.getenv("E2E_TEST_PASSWORD")
if not PASSWORD:
    raise ValueError("E2E_TEST_PASSWORD environment variable is not set")

from database import engine as _engine
print('Engine URL (e2e script):', getattr(_engine, 'url', str(_engine)) )
from sqlalchemy import text
with _engine.connect() as _conn:
    cols = [r[0] for r in _conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='assessments' ORDER BY ordinal_position;"))]
    print('assessments columns (e2e):', cols)

# 1. Create or get user
user = DB.query(models.User).filter(models.User.email == EMAIL).first()
if not user:
    hashed = utils.get_password_hash(PASSWORD)
    user = models.User(email=EMAIL, full_name='Test ML User', hashed_password=hashed, is_verified=True)
    DB.add(user)
    DB.commit()
    DB.refresh(user)
else:
    user.is_verified = True
    DB.commit()

print('Using user id', user.id)

# 2. Create assessment
# 2. Create token for API calls
token = utils.create_access_token({'sub': user.email})
print('Generated token (truncated):', token[:40])

headers = {'Authorization': f'Bearer {token}'}

# 3. Start assessment via API
start_resp = requests.post('http://127.0.0.1:8000/api/assessment/start', headers=headers)
print('Start status:', start_resp.status_code)
start_json = start_resp.json()
print('Start response:', start_json)
assessment_id = start_json.get('assessment_id')
question = start_json.get('first_question')

if not assessment_id or not question:
    print('Failed to start assessment; aborting')
    DB.close()
    raise SystemExit(1)

# 4. Answer questions until none left or 20 iterations
answered = 0
while question and answered < 40:
    qid = question['id']
    # choose a random option (attempt incorrect sometimes)
    import random
    selected = random.randrange(len(question.get('options', [0])))
    payload = {
        'assessment_id': assessment_id,
        'question_id': qid,
        'selected_option_index': selected,
        'time_taken_seconds': 8
    }
    ans_resp = requests.post('http://127.0.0.1:8000/api/assessment/answer', json=payload, headers=headers)
    print('Answer status:', ans_resp.status_code)
    ans_json = ans_resp.json()
    print('Answer response snippet:', {k: ans_json.get(k) for k in ['is_correct','answered_count','remaining_questions']})
    question = ans_json.get('next_question')
    answered += 1

# 5. Submit assessment
submit_resp = requests.post(f'http://127.0.0.1:8000/api/assessment/submit/{assessment_id}', headers=headers)
print('Submit status:', submit_resp.status_code)
try:
    print('Submit response:', submit_resp.json())
except Exception:
    print('Submit response text:', submit_resp.text)

DB.close()
