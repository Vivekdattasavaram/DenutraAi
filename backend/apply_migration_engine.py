from database import engine
from sqlalchemy import text

with engine.begin() as conn:
    print('Applying migration: add ml_confidence column if not exists')
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS ml_confidence FLOAT;"))
    print('Migration applied. Now listing columns:')
    res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='assessments' ORDER BY ordinal_position;"))
    cols = [r[0] for r in res.fetchall()]
    print('cols=', cols)
