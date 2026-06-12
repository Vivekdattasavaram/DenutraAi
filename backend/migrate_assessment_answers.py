"""Run DB migrations for assessment_answers table from the repository root.
Usage: python migrate_assessment_answers.py
"""
from app.db_migrations import run_migrations

if __name__ == "__main__":
    print("Running assessment_answers migrations...")
    run_migrations()
    print("Migrations complete.")
