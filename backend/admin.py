from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Assessment, LearningProgress, Notification
from dependencies import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_users = db.query(User).count()
    total_assessments = db.query(Assessment).count()
    
    avg_literacy = db.query(func.avg(LearningProgress.current_literacy_score)).scalar() or 0
    high_risk_users = db.query(Assessment).filter(Assessment.risk_level == "High Risk").count()
    
    # Calculate total videos watched (length of completed_module_ids array across all progress)
    # Since SQLite JSON length is complex, we do it in Python for now.
    all_progress = db.query(LearningProgress).all()
    videos_watched = sum([len(p.completed_module_ids) if p.completed_module_ids else 0 for p in all_progress])
    
    # Quiz attempts could be counted as assessments taken
    quiz_attempts = total_assessments
    
    return {
        "total_users": total_users,
        "total_assessments": total_assessments,
        "avg_literacy_score": round(avg_literacy, 2),
        "high_risk_users": high_risk_users,
        "videos_watched": videos_watched,
        "quiz_attempts": quiz_attempts
    }

@router.get("/users")
def get_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        lp = db.query(LearningProgress).filter(LearningProgress.user_id == u.id).first()
        latest_assessment = db.query(Assessment).filter(Assessment.user_id == u.id).order_by(Assessment.started_at.desc()).first()
        
        result.append({
            "id": u.id,
            "name": u.full_name,
            "email": u.email,
            "literacy_score": lp.current_literacy_score if lp and lp.current_literacy_score else 0,
            "risk_level": latest_assessment.risk_level if latest_assessment and latest_assessment.risk_level else "Unknown",
            "created_at": u.created_at
        })
    return result

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_assessments = db.query(Assessment).count()
    high_risk = db.query(Assessment).filter(Assessment.risk_level == "High Risk").count()
    high_risk_percentage = (high_risk / total_assessments * 100) if total_assessments > 0 else 0
    
    avg_literacy = db.query(func.avg(LearningProgress.current_literacy_score)).scalar() or 0
    
    all_progress = db.query(LearningProgress).all()
    videos_watched = sum([len(p.completed_module_ids) if p.completed_module_ids else 0 for p in all_progress])
    
    return {
        "assessment_analytics": {
            "average_literacy_score": round(avg_literacy, 2),
            "high_risk_percentage": round(high_risk_percentage, 1)
        },
        "learning_analytics": {
            "videos_watched": videos_watched,
            "quiz_completions": total_assessments,
            "fact_myth_interactions": total_assessments * 2 # Mocking a stat
        }
    }

@router.get("/notification-analytics")
def get_notification_analytics(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total = db.query(Notification).count()
    read_count = db.query(Notification).filter(Notification.is_read == True).count()
    
    read_rate = (read_count / total * 100) if total > 0 else 0
    
    # Most common type
    from sqlalchemy import func
    most_common_type = db.query(Notification.type, func.count(Notification.id).label('count')).group_by(Notification.type).order_by(func.count(Notification.id).desc()).first()
    
    most_clicked_rec = db.query(Notification.action_route, func.count(Notification.id).label('count')).filter(Notification.type == "recommendation", Notification.is_read == True).group_by(Notification.action_route).order_by(func.count(Notification.id).desc()).first()
    
    return {
        "total_notifications": total,
        "read_rate": round(read_rate, 2),
        "most_common_type": most_common_type[0] if most_common_type else "None",
        "most_clicked_recommendation": most_clicked_rec[0] if most_clicked_rec else "None"
    }
