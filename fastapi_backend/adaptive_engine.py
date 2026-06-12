import random
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import models
from typing import Optional

MAX_QUESTIONS = 20
CATEGORIES = [
    "Brushing Habits",
    "Flossing Habits",
    "Gum Health",
    "Diet & Sugar Consumption",
    "Dental Visits",
    "Oral Hygiene Knowledge"
]
DIFFICULTIES = ["Basic", "Medium", "Advanced"]

class AdaptiveEngine:
    def __init__(self):
        self.MAX_QUESTIONS = MAX_QUESTIONS
        self.categories = CATEGORIES
        self.difficulties = DIFFICULTIES

    def get_first_question(self, db: Session, literacy_level: str = "Medium", user_id: Optional[int] = None) -> Optional[models.QuestionBank]:
        # Start at Brushing Habits
        initial_cat = self.categories[0]
        # Literacy affects starting difficulty
        initial_diff = "Basic" if literacy_level == "Low" else "Medium"
        
        exclude_ids = set()
        if user_id:
            recent_assessments = db.query(models.Assessment).filter(
                models.Assessment.user_id == user_id
            ).order_by(models.Assessment.id.desc()).limit(2).all()
            for a in recent_assessments:
                if a.asked_questions:
                    exclude_ids.update(a.asked_questions)

        # Pick random question from this pool
        question = db.query(models.QuestionBank).filter(
            models.QuestionBank.category == initial_cat,
            models.QuestionBank.difficulty == initial_diff,
            models.QuestionBank.id.notin_(exclude_ids)
        ).order_by(func.random()).first()
        
        # Fallback without exclude filter
        if not question:
            question = db.query(models.QuestionBank).filter(
                models.QuestionBank.category == initial_cat,
                models.QuestionBank.difficulty == initial_diff
            ).order_by(func.random()).first()
        
        # Ultimate fallback
        if not question:
            question = db.query(models.QuestionBank).order_by(func.random()).first()
            
        return question

    def get_next_question(
        self,
        db: Session,
        assessment_id: int,
        last_question_id: int,
        is_correct: bool
    ) -> Optional[models.QuestionBank]:
        assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id).first()
        if not assessment:
            return None

        asked_ids = set(assessment.asked_questions or [])
        if len(asked_ids) >= self.MAX_QUESTIONS:
            return None # HARD LIMIT: Exactly 20 questions
            
        current_cat = assessment.current_category
        current_diff = assessment.current_difficulty
        literacy = assessment.literacy_level

        # Category Progress
        cat_idx = self.categories.index(current_cat) if current_cat in self.categories else 0
        diff_idx = self.difficulties.index(current_diff) if current_diff in self.difficulties else 1
        
        # Determine next difficulty and category
        if is_correct:
            # Increase difficulty
            next_diff_idx = min(diff_idx + 1, len(self.difficulties) - 1)
            
            # Progress to next category if we have asked enough in this one (approx 3-4 per category)
            # Since 20 questions / 6 categories = 3.33 questions per category
            # Let's count how many questions were asked in current category
            qs_in_cat = db.query(models.AssessmentAnswer).filter(
                models.AssessmentAnswer.assessment_id == assessment_id,
                models.AssessmentAnswer.category == current_cat
            ).count()
            
            if qs_in_cat >= 3:
                next_cat_idx = min(cat_idx + 1, len(self.categories) - 1)
            else:
                next_cat_idx = cat_idx
        else:
            # Incorrect: Ask easier question from SAME category
            next_diff_idx = max(diff_idx - 1, 0)
            next_cat_idx = cat_idx
            
            # If they keep failing and we run out of easier questions in this category, move on
            qs_in_cat = db.query(models.AssessmentAnswer).filter(
                models.AssessmentAnswer.assessment_id == assessment_id,
                models.AssessmentAnswer.category == current_cat
            ).count()
            if qs_in_cat >= 4: # Hard cap per category to ensure we get through all categories
                next_cat_idx = min(cat_idx + 1, len(self.categories) - 1)

        new_cat = self.categories[next_cat_idx]
        new_diff = self.difficulties[next_diff_idx]
        
        # Get recently asked questions from user history
        recent_assessments = db.query(models.Assessment).filter(
            models.Assessment.user_id == assessment.user_id,
            models.Assessment.id != assessment_id
        ).order_by(models.Assessment.id.desc()).limit(2).all()
        
        recent_asked_ids = set()
        for a in recent_assessments:
            if a.asked_questions:
                recent_asked_ids.update(a.asked_questions)
        
        strict_exclude_ids = asked_ids.union(recent_asked_ids)
        
        # Randomized Retrieval from the pool (Category -> Difficulty -> Random)
        next_q = db.query(models.QuestionBank).filter(
            models.QuestionBank.category == new_cat,
            models.QuestionBank.difficulty == new_diff,
            models.QuestionBank.id.notin_(strict_exclude_ids)
        ).order_by(func.random()).first()
        
        # Fallback 1: Any difficulty in the same category, strict exclude
        if not next_q:
            next_q = db.query(models.QuestionBank).filter(
                models.QuestionBank.category == new_cat,
                models.QuestionBank.id.notin_(strict_exclude_ids)
            ).order_by(func.random()).first()

        # Fallback 2: Drop the recent history restriction, but keep current assessment restrictions
        if not next_q:
            next_q = db.query(models.QuestionBank).filter(
                models.QuestionBank.category == new_cat,
                models.QuestionBank.difficulty == new_diff,
                models.QuestionBank.id.notin_(asked_ids)
            ).order_by(func.random()).first()

        # Fallback 3: Any category, any difficulty, current assessment restrict
        if not next_q:
            next_q = db.query(models.QuestionBank).filter(
                models.QuestionBank.id.notin_(asked_ids)
            ).order_by(func.random()).first()

        # Update Session State
        if next_q:
            assessment.current_category = next_q.category
            assessment.current_difficulty = next_q.difficulty
            
            asked_list = list(assessment.asked_questions) if assessment.asked_questions else []
            if next_q.id not in asked_list:
                asked_list.append(next_q.id)
            assessment.asked_questions = asked_list
            db.commit()

        return next_q
