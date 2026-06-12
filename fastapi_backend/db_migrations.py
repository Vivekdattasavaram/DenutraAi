import logging
from sqlalchemy import text
from database import engine

logger = logging.getLogger("db_migrations")


def run_migrations():
    """
    Run safe, idempotent migrations required by the application.
    - Creates lightweight backups for `assessment_answers` when present.
    - Applies `ALTER TABLE ... IF NOT EXISTS` statements so re-running is safe.
    - Adds `ml_confidence` and session columns to `assessments`.
    - Uses a transaction scope for grouped execution and logs actions.
    """

    logger.info("Starting DB migrations")

    with engine.begin() as conn:
        # Check for assessment_answers table before backing up
        try:
            res = conn.execute(text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='assessment_answers');")).fetchone()
            has_answers = bool(res[0])
        except Exception as e:
            logger.exception("Error checking for assessment_answers existence: %s", e)
            has_answers = False

        if has_answers:
            try:
                logger.info("Creating backup table assessment_answers_backup if missing")
                conn.execute(text(
                    """
                    CREATE TABLE IF NOT EXISTS assessment_answers_backup (
                        id SERIAL PRIMARY KEY,
                        original_id INTEGER,
                        backup_data JSONB,
                        backed_up_at TIMESTAMPTZ DEFAULT now()
                    );
                    """
                ))
            except Exception:
                logger.exception("Failed to create assessment_answers_backup; continuing")

            try:
                logger.info("Backing up assessment_answers rows not yet backed up")
                conn.execute(text(
                    """
                    INSERT INTO assessment_answers_backup (original_id, backup_data)
                    SELECT id, row_to_json(assessment_answers.*)
                    FROM assessment_answers
                    WHERE id IS NOT NULL
                    AND NOT EXISTS (
                        SELECT 1 FROM assessment_answers_backup b WHERE b.original_id = assessment_answers.id
                    );
                    """
                ))
            except Exception:
                logger.exception("Backup of assessment_answers rows failed; continuing")

        # Define idempotent alter statements
        alter_statements = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS category VARCHAR;",
            "ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS difficulty VARCHAR;",
            "ALTER TABLE assessment_answers ADD COLUMN IF NOT EXISTS time_taken_seconds INTEGER DEFAULT 0;",

            # Session state tracking in assessments table
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS current_category VARCHAR DEFAULT 'Brushing';",
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS current_difficulty VARCHAR DEFAULT 'Basic';",
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS correct_streak INTEGER DEFAULT 0;",
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS wrong_streak INTEGER DEFAULT 0;",
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS category_progress JSONB DEFAULT '{}';",
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS asked_questions JSONB DEFAULT '[]';",

            # ML confidence column
            "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS ml_confidence FLOAT;",
        ]

        for stmt in alter_statements:
            try:
                logger.info("Executing migration: %s", stmt)
                conn.execute(text(stmt))
            except Exception:
                logger.exception("Failed executing: %s (continuing)", stmt)

        # Ensure no NULLs for time_taken_seconds
        try:
            logger.info("Normalizing NULL time_taken_seconds to 0 (if any)")
            conn.execute(text("UPDATE assessment_answers SET time_taken_seconds = 0 WHERE time_taken_seconds IS NULL;"))
        except Exception:
            logger.exception("Failed to normalize time_taken_seconds; continuing")

    logger.info("Completed DB migrations")
