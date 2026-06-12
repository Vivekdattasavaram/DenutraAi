from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    tbls = conn.execute(text("SELECT schemaname, tablename FROM pg_tables WHERE tablename='assessments';")).fetchall()
    print('pg_tables matches:', tbls)
    for schema, table in tbls:
        res = conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_schema='{schema}' AND table_name='{table}' ORDER BY ordinal_position;"))
        cols = [r[0] for r in res.fetchall()]
        print(f'schema={schema} table={table} cols=', cols)
