from sqlalchemy.orm import Session
import models

class AnalyticsEngine:
    def get_user_history(self, db: Session, user_id: int):
        assessments = db.query(models.Assessment).filter(
            models.Assessment.user_id == user_id,
            models.Assessment.completed_at != None
        ).order_by(models.Assessment.completed_at.asc()).all()
        
        return assessments
