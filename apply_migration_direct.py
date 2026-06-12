from sqlalchemy import create_engine, text

DB_URL = 'postgresql://postgres:postgres@localhost:5432/oral_health_db'
engine = create_engine(DB_URL)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE assessments ADD COLUMN IF NOT EXISTS ml_confidence FLOAT;"))
        print('Direct ALTER executed')
    except Exception as e:
        print('Direct ALTER failed:', e)

    res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='assessments' ORDER BY ordinal_position;"))
    cols = [r[0] for r in res.fetchall()]
    print('assessments columns (direct):', cols)
