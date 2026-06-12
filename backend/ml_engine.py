import joblib
import pandas as pd
import numpy as np
import os
from sqlalchemy.orm import Session
import models

class MLEngine:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), 'oral_health_model.pkl')
        if os.path.exists(model_path):
            print(f'Loading RandomForestRegressor from {model_path}')
            self.model = joblib.load(model_path)
        else:
            print(f'No score model found at {model_path}; using fallback.')
            self.model = None

    def calculate_subscores(self, db: Session, assessment_id: int):
        answers = db.query(models.AssessmentAnswer).filter(models.AssessmentAnswer.assessment_id == assessment_id).all()
        
        total_q = len(answers)
        if total_q == 0:
            return 0.0, 0.0, 0.0, 0.0, 0, 0

        correct_answers = sum(1 for ans in answers if ans.is_correct)
        wrong_answers = total_q - correct_answers
        
        knowledge_score = (correct_answers / total_q) * 100.0
        
        habit_q = [a for a in answers if a.question.category in ["Brushing Habits", "Flossing Habits", "Dental Visits"]]
        habit_score = (sum(1 for a in habit_q if a.is_correct) / len(habit_q)) * 100 if habit_q else 50.0

        risk_q = [a for a in answers if a.question.category in ["Gum Health", "Diet & Sugar Consumption"]]
        risk_score = (sum(1 for a in risk_q if a.is_correct) / len(risk_q)) * 100 if risk_q else 50.0

        category_scores = [knowledge_score, habit_score, risk_score]
        consistency_score = 100.0 - (np.std(category_scores) * 2) if category_scores else 50.0
        consistency_score = float(np.clip(consistency_score, 0, 100))
        
        return knowledge_score, habit_score, risk_score, consistency_score, correct_answers, wrong_answers

    def predict_full(self, assessment: models.Assessment):
        if not self.model:
            # Fallback
            score = (assessment.habit_score * 0.4) + (assessment.knowledge_score * 0.3) + (assessment.risk_score * 0.2) + (assessment.consistency_score * 0.1)
            score = float(np.clip(score, 0, 100))
            return score, self._get_risk_level(score), 0.50, self._classify_literacy(score)

        # Build feature vector matching training data
        features = pd.DataFrame([{
            'brushing_frequency': 2 if assessment.habit_score > 60 else 1,
            'flossing_frequency': 7 if assessment.habit_score > 80 else 2,
            'sugary_food_frequency': 1 if assessment.risk_score > 70 else 3,
            'gum_bleeding': 0 if assessment.risk_score > 40 else 1,
            'dental_visits': 2 if assessment.habit_score > 70 else 0,
            'knowledge_score': assessment.knowledge_score,
            'habit_score': assessment.habit_score,
            'risk_score': assessment.risk_score,
            'consistency_score': assessment.consistency_score,
            'correct_answers': assessment.correct_answers,
            'wrong_answers': assessment.wrong_answers,
            'duration_seconds': assessment.duration_seconds,
            'age_group': 2, # Default demographic if unknown
            'smoking_status': 0
        }])

        # Predict score
        prediction = self.model.predict(features)[0]
        score = float(np.clip(prediction, 0, 100))
        
        # Calculate confidence using standard deviation across the forest's estimators
        preds = []
        # Pass .values to individual estimators to avoid feature name warnings
        X_array = features.values
        for estimator in self.model.estimators_:
            preds.append(estimator.predict(X_array)[0])
        std_dev = np.std(preds)
        
        # Mathematically derived confidence based on variance (std_dev typically 0-15)
        # Max confidence 0.95, min 0.60
        confidence = float(np.clip(0.95 - (std_dev / 40.0), 0.60, 0.95))
        
        risk_level = self._get_risk_level(score)
        literacy_class = self._classify_literacy(score)
        
        return score, risk_level, confidence, literacy_class

    def _get_risk_level(self, score: float) -> str:
        if score >= 80:
            return "Healthy"
        elif score >= 60:
            return "Moderate Risk"
        else:
            return "High Risk"

    def _classify_literacy(self, score: float) -> str:
        if score <= 40:
            return "Beginner"
        elif score <= 70:
            return "Intermediate"
        else:
            return "Advanced"
