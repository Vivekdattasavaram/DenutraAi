from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS ml_confidence FLOAT;"))
        print('Migration applied: ml_confidence column ensured')
    except Exception as e:
        print('Migration failed:', e)
