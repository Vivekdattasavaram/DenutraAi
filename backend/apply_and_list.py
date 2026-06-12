from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS ml_confidence FLOAT;"))
        print('ALTER executed')
    except Exception as e:
        print('ALTER failed:', e)

    res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='assessments' ORDER BY ordinal_position;"))
    cols = [r[0] for r in res.fetchall()]
    print('assessments columns after ALTER:', cols)
