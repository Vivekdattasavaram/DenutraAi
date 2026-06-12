import os
from sqlalchemy import text
from database import engine, Base
from models import CurriculumModule

def migrate():
    print("Creating new tables (like curriculum_modules) if they do not exist...")
    Base.metadata.create_all(bind=engine)
    
    with engine.connect() as conn:
        # 1. Update assessments table
        assessment_cols = [
            ("literacy_classification_output", "VARCHAR"),
            ("previous_assessment_id", "INTEGER")
        ]
        for col_name, col_type in assessment_cols:
            try:
                conn.execute(text(f"ALTER TABLE assessments ADD COLUMN {col_name} {col_type};"))
                conn.commit()
                print(f"Added column {col_name} to assessments.")
            except Exception as e:
                print(f"Column {col_name} might already exist in assessments: {e}")
                conn.rollback()

        # 2. Update learning_progress table
        learning_cols = [
            ("initial_literacy_level", "VARCHAR"),
            ("current_literacy_level", "VARCHAR"),
            ("best_literacy_level", "VARCHAR"),
            ("initial_literacy_score", "FLOAT"),
            ("current_literacy_score", "FLOAT"),
            ("best_literacy_score", "FLOAT"),
            ("literacy_growth_percentage", "FLOAT DEFAULT 0.0"),
            ("total_reassessments_completed", "INTEGER DEFAULT 0"),
            ("xp_points", "INTEGER DEFAULT 0"),
            ("badges_earned", "JSON DEFAULT '[]'"),
            ("learning_time_seconds", "INTEGER DEFAULT 0"),
            ("completed_module_ids", "JSON DEFAULT '[]'"),
            ("quiz_scores", "JSON DEFAULT '{}'")
        ]
        
        for col_name, col_type in learning_cols:
            try:
                conn.execute(text(f"ALTER TABLE learning_progress ADD COLUMN {col_name} {col_type};"))
                conn.commit()
                print(f"Added column {col_name} to learning_progress.")
            except Exception as e:
                print(f"Column {col_name} might already exist in learning_progress: {e}")
                conn.rollback()
                
        # Remove old columns
        try:
            conn.execute(text("ALTER TABLE learning_progress DROP COLUMN completed_lessons;"))
            conn.execute(text("ALTER TABLE learning_progress DROP COLUMN total_lessons;"))
            conn.commit()
            print("Dropped old columns from learning_progress.")
        except Exception as e:
            print(f"Could not drop old columns: {e}")
            conn.rollback()

    print("Migration complete!")

if __name__ == "__main__":
    migrate()
