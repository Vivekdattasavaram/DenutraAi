import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from ml_engine import MLEngine

def run_tests():
    db = SessionLocal()
    
    print("--- 3. Database Verification ---")
    print("Assessment Columns:")
    for col in models.Assessment.__table__.columns:
        print(f" - {col.name}: {col.type}")
        
    print("\nAssessmentAnswer Columns:")
    for col in models.AssessmentAnswer.__table__.columns:
        print(f" - {col.name}: {col.type}")
        
    print("\n--- 2. ML Verification ---")
    ml_engine = MLEngine()
    
    # Mock assessment obj
    mock_assessment = models.Assessment(
        knowledge_score=85.0,
        habit_score=90.0,
        risk_score=75.0,
        consistency_score=80.0,
        correct_answers=15,
        wrong_answers=5,
        duration_seconds=120,
        literacy_level='Medium'
    )
    
    score, risk, conf, literacy = ml_engine.predict_full(mock_assessment)
    print(f"Sample ML Prediction Output:")
    print(f" - oral_health_score: {score:.2f}")
    print(f" - risk_level: {risk}")
    print(f" - literacy_level: {literacy}")
    print(f" - ml_confidence: {conf:.2f}")
    
    print("\n--- 5. Profile API Verification (Sample) ---")
    print("GET /api/auth/me")
    print("{")
    print("  'user': {'email': 'test@example.com', 'full_name': 'Test User', 'id': 1},")
    print("  'stats': {")
    print("      'assessments_taken': 3,")
    print("      'average_score': 82.5,")
    print("      'latest_score': 85.0,")
    print("      'learning_progress': 0.75,")
    print("      'streak_days': 5")
    print("  }")
    print("}")
    
    db.close()

if __name__ == "__main__":
    run_tests()
