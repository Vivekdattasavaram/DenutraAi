from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
from database import get_db
import models, schemas
from dependencies import get_current_user
from curriculum_engine import CurriculumEngine
from utils import create_notification

router = APIRouter(prefix="/api/learning", tags=["Learning"])
curriculum_engine = CurriculumEngine()

@router.get("/dashboard", response_model=schemas.LearningProgressOut)
def get_learning_dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == current_user.id).first()
    if not progress:
        # Initialize empty progress
        progress = models.LearningProgress(user_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
        
    return progress

@router.get("/curriculum/path", response_model=schemas.LearningPathResponse)
def get_curriculum_path(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Find latest assessment to get weaknesses
    latest_assessment = db.query(models.Assessment).filter(
        models.Assessment.user_id == current_user.id,
        models.Assessment.completed_at != None
    ).order_by(models.Assessment.completed_at.desc()).first()
    
    if not latest_assessment:
        # User hasn't taken assessment, fallback to basic path
        path = curriculum_engine.generate_personalized_path(db, current_user.id, [], "Beginner")
        return path
        
    # Get wrong categories from latest assessment
    answers = db.query(models.AssessmentAnswer).filter(
        models.AssessmentAnswer.assessment_id == latest_assessment.id,
        models.AssessmentAnswer.is_correct == False
    ).all()
    wrong_categories = list(set([a.category for a in answers]))
    
    literacy_class = latest_assessment.literacy_classification_output or "Beginner"
    
    path = curriculum_engine.generate_personalized_path(db, current_user.id, wrong_categories, literacy_class)
    return path

@router.get("/curriculum/module/{module_id}", response_model=schemas.CurriculumModuleOut)
def get_curriculum_module(module_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    module = db.query(models.CurriculumModule).filter(models.CurriculumModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.post("/curriculum/module/{module_id}/complete")
def complete_module(module_id: int, payload: dict, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    module = db.query(models.CurriculumModule).filter(models.CurriculumModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == current_user.id).first()
    if not progress:
        progress = models.LearningProgress(user_id=current_user.id)
        db.add(progress)
    
    time_spent = payload.get("time_spent", 0)
    
    # Add to completed ids if not present
    completed = list(progress.completed_module_ids) if progress.completed_module_ids else []
    
    xp_earned = 0
    new_badges = []
    
    if module_id not in completed:
        completed.append(module_id)
        progress.completed_module_ids = completed
        
        # Gamification
        xp_earned = 50 + (module.estimated_minutes * 10)
        progress.xp_points += xp_earned
        
        if len(completed) == 1:
            new_badges.append("First Steps")
        if len(completed) == 5:
            new_badges.append("Fast Learner")
            create_notification(db, current_user.id, "Achievement Unlocked", "5 Videos Watched! You are a Fast Learner.", "achievement", action_route="Profile")
            
        current_badges = list(progress.badges_earned) if progress.badges_earned else []
        for b in new_badges:
            if b not in current_badges:
                current_badges.append(b)
        progress.badges_earned = current_badges

        create_notification(db, current_user.id, "Video Completed", f"You completed {module.title}.", "video", action_route="Learning Dashboard")

    progress.learning_time_seconds += time_spent
    
    # Check reassessment trigger
    # Trigger if they've completed 3 modules since last assessment (rough heuristic) or 14 days
    reassessment_triggered = False
    if len(completed) % 3 == 0:
        reassessment_triggered = True

    db.commit()
    
    return {
        "success": True,
        "xp_earned": xp_earned,
        "new_badges": new_badges,
        "reassessment_triggered": reassessment_triggered
    }
