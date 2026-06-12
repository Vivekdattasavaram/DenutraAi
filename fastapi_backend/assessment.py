from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
import models, schemas
from utils import verify_password, get_password_hash, create_access_token, create_notification # Using dependency for auth
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os

from adaptive_engine import AdaptiveEngine
from ml_engine import MLEngine
from risk_predictor import RiskPredictor
from recommendation_engine import RecommendationEngine
from analytics_engine import AnalyticsEngine
from curriculum_engine import CurriculumEngine

router = APIRouter(prefix="/api/assessment", tags=["Assessment"])

from dependencies import get_current_user

adaptive_engine = AdaptiveEngine()
ml_engine = MLEngine()
risk_predictor = RiskPredictor()
rec_engine = RecommendationEngine()
analytics_engine = AnalyticsEngine()
curriculum_engine = CurriculumEngine()

@router.post("/start", response_model=schemas.AssessmentStart)
def start_assessment(payload: schemas.AssessmentStartPayload = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    literacy_level = payload.literacy_level if payload else "Medium"
    
    assessment = models.Assessment(
        user_id=current_user.id,
        current_category="Brushing Habits", 
        current_difficulty="Basic" if literacy_level == "Low" else "Medium",
        literacy_level=literacy_level,
        correct_streak=0,
        wrong_streak=0,
        category_progress={},
        asked_questions=[],
        total_questions=adaptive_engine.MAX_QUESTIONS
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    first_q = adaptive_engine.get_first_question(db, literacy_level, current_user.id)
    if not first_q:
        raise HTTPException(status_code=404, detail="No questions found in QuestionBank")

    assessment.asked_questions = [first_q.id]
    db.commit()

    return {
        "assessment_id": assessment.id,
        "first_question": schemas.QuestionOut.from_orm(first_q),
        "total_questions": assessment.total_questions,
        "current_category": assessment.current_category,
        "current_difficulty": assessment.current_difficulty
    }

@router.post("/answer", response_model=schemas.AnswerResult)
def submit_answer(payload: schemas.AnswerSubmit, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == payload.assessment_id,
        models.Assessment.user_id == current_user.id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    if assessment.completed_at:
        raise HTTPException(status_code=400, detail="Assessment already completed")

    question = db.query(models.QuestionBank).filter(models.QuestionBank.id == payload.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    is_correct = (question.correct_option_index == payload.selected_option_index)
    
    answer = models.AssessmentAnswer(
        assessment_id=payload.assessment_id,
        question_id=payload.question_id,
        selected_option_index=payload.selected_option_index,
        is_correct=is_correct,
        category=question.category,
        difficulty=question.difficulty,
        time_taken_seconds=payload.time_taken_seconds
    )
    db.add(answer)
    db.commit()

    asked_count = db.query(models.AssessmentAnswer).filter(models.AssessmentAnswer.assessment_id == payload.assessment_id).count()
    next_q = adaptive_engine.get_next_question(db, payload.assessment_id, payload.question_id, is_correct)
    next_question_number = asked_count + 1 if next_q else None

    # Get correct answer text from question
    correct_answer_text = question.options[question.correct_option_index]

    # Refresh assessment to get updated state
    db.refresh(assessment)

    return {
        "is_correct": is_correct,
        "correct_option_index": question.correct_option_index,
        "correct_answer_text": correct_answer_text,  # New: show correct option text
        "explanation": question.explanation,
        "educational_tip": question.educational_tip if not is_correct else None,  # Only show tip if wrong
        "next_question": schemas.QuestionOut.from_orm(next_q) if next_q else None,
        "answered_count": asked_count,
        "remaining_questions": max(0, adaptive_engine.MAX_QUESTIONS - asked_count),
        "next_question_number": next_question_number,
        "current_category": assessment.current_category,
        "current_difficulty": assessment.current_difficulty
    }

@router.get("/question/next", response_model=schemas.QuestionProgress)
def get_next_question(assessment_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id,
        models.Assessment.user_id == current_user.id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    answers = db.query(models.AssessmentAnswer).filter(models.AssessmentAnswer.assessment_id == assessment_id).order_by(models.AssessmentAnswer.id).all()
    if not answers:
        next_question = adaptive_engine.get_first_question(db, "Medium", current_user.id)
        answered_count = 0
    else:
        last_answer = answers[-1]
        next_question = adaptive_engine.get_next_question(db, assessment_id, last_answer.question_id, last_answer.is_correct)
        answered_count = len(answers)

    return {
        "next_question": schemas.QuestionOut.from_orm(next_question) if next_question else None,
        "answered_count": answered_count,
        "remaining_questions": max(0, adaptive_engine.MAX_QUESTIONS - answered_count),
        "total_questions": adaptive_engine.MAX_QUESTIONS
    }

@router.post("/submit/{assessment_id}", response_model=schemas.AssessmentFinalResult)
def complete_assessment(assessment_id: int, payload: schemas.AssessmentSubmitPayload = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id, 
        models.Assessment.user_id == current_user.id
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
        
    if assessment.completed_at:
        raise HTTPException(status_code=400, detail="Assessment already completed")

    # Sum total duration from answers
    answers = db.query(models.AssessmentAnswer).filter(models.AssessmentAnswer.assessment_id == assessment_id).all()
    total_duration = sum([a.time_taken_seconds or 0 for a in answers])
    assessment.duration_seconds = total_duration

    # Calculate sub-scores and ml inputs
    k_score, h_score, r_score, c_score, c_ans, w_ans = ml_engine.calculate_subscores(db, assessment_id)
    
    assessment.knowledge_score = k_score
    assessment.habit_score = h_score
    assessment.risk_score = r_score
    assessment.consistency_score = c_score
    assessment.correct_answers = c_ans
    assessment.wrong_answers = w_ans
    
    # Predict Final ML Risk Level, confidence, and literacy classification
    score, risk_level, confidence, literacy_class = ml_engine.predict_full(assessment)
    assessment.oral_health_score = score
    assessment.risk_level = risk_level
    assessment.ml_confidence = confidence
    assessment.literacy_classification_output = literacy_class

    # Get previous assessment to calculate growth
    prev_assessment = db.query(models.Assessment).filter(
        models.Assessment.user_id == current_user.id,
        models.Assessment.completed_at != None,
        models.Assessment.id != assessment_id
    ).order_by(models.Assessment.completed_at.desc()).first()
    
    if prev_assessment:
        assessment.previous_assessment_id = prev_assessment.id

    if payload and payload.category_scores:
        assessment.category_progress = payload.category_scores

    assessment.completed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(assessment)
    
    # 4. Generate Recommendations & Update Learning Progress
    wrong_categories = list(set([a.question.category for a in answers if not a.is_correct]))
    recommendations = rec_engine.generate_recommendations(k_score, h_score, r_score, wrong_categories, assessment.literacy_level)
    
    # Update LearningProgress
    progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == current_user.id).first()
    if not progress:
        progress = models.LearningProgress(user_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)

    if not progress.initial_literacy_score:
        progress.initial_literacy_score = score
        progress.initial_literacy_level = literacy_class
        
    progress.current_literacy_score = score
    progress.current_literacy_level = literacy_class
    
    if not progress.best_literacy_score or score > progress.best_literacy_score:
        progress.best_literacy_score = score
        progress.best_literacy_level = literacy_class
        
    if progress.initial_literacy_score:
        progress.literacy_growth_percentage = ((score - progress.initial_literacy_score) / progress.initial_literacy_score) * 100.0
        
    progress.total_reassessments_completed += 1
    db.commit()

    # Generate Personalized Learning Path
    learning_path = curriculum_engine.generate_personalized_path(db, current_user.id, wrong_categories, literacy_class)

    # Trigger Notifications
    create_notification(db, current_user.id, "Assessment Completed", "Your oral health assessment has been completed successfully.", "assessment", action_route="Assessment History")
    
    if risk_level == "High Risk":
        create_notification(db, current_user.id, "Risk Alert", "Your dental risk score is high. Please review recommendations.", "risk_alert", action_route="Latest Assessment Result")
    
    for category in wrong_categories:
        create_notification(db, current_user.id, "Learning Recommendation", f"Your {category} score is low. Recommended learning content is available.", "recommendation", action_route="Learning Dashboard")
        
    if progress.total_reassessments_completed == 1:
        create_notification(db, current_user.id, "Achievement Unlocked", "First Assessment Completed!", "achievement", action_route="Profile")

    return {
        "assessment": schemas.AssessmentOut.from_orm(assessment),
        "recommendations": recommendations,
        "learning_path": learning_path
    }

@router.get("/history", response_model=list[schemas.AssessmentOut])
def get_assessment_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return analytics_engine.get_user_history(db, current_user.id)
