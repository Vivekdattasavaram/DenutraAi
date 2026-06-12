from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    row = conn.execute(text("SELECT id, risk_level, ml_confidence, oral_health_score, completed_at FROM assessments ORDER BY id DESC LIMIT 1;"))
    r = row.fetchone()
    print('latest assessment row:', r)
