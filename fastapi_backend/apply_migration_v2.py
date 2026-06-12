from database import engine
from sqlalchemy import text
import models

# Create new tables (ExerciseVideo, FactOrMyth, LearningProgress)
models.Base.metadata.create_all(bind=engine)

# Add new columns to assessments
with engine.begin() as conn:
    print('Applying migrations to assessments table...')
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;"))
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 20;"))
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;"))
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS wrong_answers INTEGER DEFAULT 0;"))
    conn.execute(text("ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS literacy_level VARCHAR DEFAULT 'Medium';"))
    
    print('Migration complete.')
