"""
Progressive Adaptive Assessment Engine v2.0

This engine implements:
1. Warmup phase (Brushing + Basic) for smooth onboarding
2. Progressive category flow (Brushing → Flossing → Diet → Gum Health → Preventive Care → Oral Diseases)
3. Adaptive difficulty based on performance (correct/wrong streaks)
4. Session state tracking to avoid repetition
5. Educational learning progression instead of randomness
"""
from sqlalchemy.orm import Session
import models
from typing import Optional, List

MAX_QUESTIONS = 20
CATEGORY_PROGRESSION = [
    "Brushing",
    "Flossing",
    "Diet & Sugar Intake",
    "Gum Health",
    "Preventive Care",
    "Oral Diseases",
    "Smoking & Alcohol",
    "Dental Hygiene"
]

DIFFICULTY_PROGRESSION = ["Basic", "Medium", "Hard"]


class AdaptiveEngine:
    def __init__(self):
        self.MAX_QUESTIONS = MAX_QUESTIONS
        self.category_progression = CATEGORY_PROGRESSION
        self.difficulty_progression = DIFFICULTY_PROGRESSION

    def get_first_question(self, db: Session) -> Optional[models.QuestionBank]:
        """
        Always return the first Brushing + Basic question.
        This ensures a smooth warmup phase for all users.
        """
        question = db.query(models.QuestionBank).filter(
            models.QuestionBank.category == "Brushing",
            models.QuestionBank.difficulty == "Basic"
        ).order_by(models.QuestionBank.id).first()
        
        return question

    def get_next_question(
        self,
        db: Session,
        assessment_id: int,
        last_question_id: int,
        is_correct: bool
    ) -> Optional[models.QuestionBank]:
        """
        Get the next question based on:
        1. Current assessment state (category, difficulty)
        2. Performance (correct/wrong streaks)
        3. Avoid questions already asked
        
        Progressive logic:
        - Correct answer: increase streak, potentially increase difficulty
        - Wrong answer: reset streak, potentially decrease difficulty or stay same
        - Category progression: move to next category after warmup
        """
        assessment = db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()

        if not assessment:
            return None

        # Parse session state
        asked_ids = set(assessment.asked_questions or [])
        current_category = assessment.current_category or "Brushing"
        current_difficulty = assessment.current_difficulty or "Basic"
        correct_streak = assessment.correct_streak or 0
        wrong_streak = assessment.wrong_streak or 0

        # Update streaks based on this answer
        if is_correct:
            correct_streak += 1
            wrong_streak = 0
        else:
            wrong_streak += 1
            correct_streak = 0

        # Decide new difficulty based on streaks
        new_difficulty = self._adapt_difficulty(
            current_difficulty, correct_streak, wrong_streak
        )

        # Decide category progression (warmup phase is first 3-4 questions)
        answered_count = len(asked_ids)
        new_category = self._adapt_category(
            current_category, answered_count, correct_streak, wrong_streak
        )

        # Try to find next question in current category/difficulty
        next_q = db.query(models.QuestionBank).filter(
            models.QuestionBank.category == new_category,
            models.QuestionBank.difficulty == new_difficulty,
            models.QuestionBank.id.notin_(asked_ids)
        ).order_by(models.QuestionBank.id).first()

        # Fallback: if no questions in current category/difficulty, try same category with any difficulty
        if not next_q:
            next_q = db.query(models.QuestionBank).filter(
                models.QuestionBank.category == new_category,
                models.QuestionBank.id.notin_(asked_ids)
            ).order_by(models.QuestionBank.id).first()

        # Fallback: if no questions in category, move to next category
        if not next_q and new_category != current_category:
            next_q = db.query(models.QuestionBank).filter(
                models.QuestionBank.category == current_category,
                models.QuestionBank.difficulty == new_difficulty,
                models.QuestionBank.id.notin_(asked_ids)
            ).order_by(models.QuestionBank.id).first()

        # Update assessment session state
        if next_q:
            assessment.current_category = new_category
            assessment.current_difficulty = new_difficulty
            assessment.correct_streak = correct_streak
            assessment.wrong_streak = wrong_streak

            # Track this question as asked
            if not isinstance(assessment.asked_questions, list):
                assessment.asked_questions = []
            if next_q.id not in assessment.asked_questions:
                assessment.asked_questions.append(next_q.id)

            db.commit()

        return next_q

    def _adapt_difficulty(
        self,
        current_difficulty: str,
        correct_streak: int,
        wrong_streak: int
    ) -> str:
        """
        Adapt difficulty based on performance streaks.
        
        Logic:
        - 2+ correct in a row: increase difficulty
        - 1 wrong answer: keep current or decrease slightly
        - 2+ wrong in a row: definitely decrease difficulty
        """
        current_idx = self.difficulty_progression.index(current_difficulty)

        if correct_streak >= 2 and current_idx < len(self.difficulty_progression) - 1:
            # Increase difficulty after 2 correct answers
            return self.difficulty_progression[current_idx + 1]

        if wrong_streak >= 2 and current_idx > 0:
            # Decrease difficulty after 2 wrong answers
            return self.difficulty_progression[current_idx - 1]

        # Stay in current difficulty by default
        return current_difficulty

    def _adapt_category(
        self,
        current_category: str,
        answered_count: int,
        correct_streak: int,
        wrong_streak: int
    ) -> str:
        """
        Adapt category progression based on warmup completion and overall performance.
        
        Logic:
        - First 3-4 questions: stay in Brushing (warmup)
        - After warmup: progress through categories based on overall performance
        - If user is struggling (wrong_streak > 1), stay longer in category
        - If user is excelling (correct_streak > 2), move to next category sooner
        """
        current_idx = self.category_progression.index(current_category)

        # Warmup phase: first 3 questions always in Brushing
        if answered_count < 3:
            return "Brushing"

        # Warmup extension: if still struggling after warmup, extend Brushing
        if current_category == "Brushing" and wrong_streak > 2:
            return "Brushing"

        # Progressive category movement
        # Approximately 2-3 questions per category (20 questions / 8 categories ~ 2.5 per category)
        questions_per_category = max(2, MAX_QUESTIONS // len(self.category_progression))
        current_category_start = current_idx * questions_per_category

        # If we've answered enough questions in this category, move to next
        if answered_count >= (current_category_start + questions_per_category) and current_idx < len(self.category_progression) - 1:
            return self.category_progression[current_idx + 1]

        # Stay in current category
        return current_category

    def get_question_feedback(
        self,
        db: Session,
        assessment_id: int,
        question_id: int,
        is_correct: bool
    ) -> dict:
        """
        Generate comprehensive feedback for the answer.
        Includes correct answer text, explanation, and educational tip.
        """
        question = db.query(models.QuestionBank).filter(
            models.QuestionBank.id == question_id
        ).first()

        if not question:
            return {"error": "Question not found"}

        assessment = db.query(models.Assessment).filter(
            models.Assessment.id == assessment_id
        ).first()

        correct_option_text = question.options[question.correct_option_index]

        return {
            "is_correct": is_correct,
            "correct_option_index": question.correct_option_index,
            "correct_answer_text": correct_option_text,
            "explanation": question.explanation,
            "educational_tip": question.educational_tip if not is_correct else None,
            "current_category": assessment.current_category if assessment else None,
            "current_difficulty": assessment.current_difficulty if assessment else None
        }
