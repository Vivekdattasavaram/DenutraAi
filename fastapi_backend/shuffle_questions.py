import logging
import random
from sqlalchemy.orm import Session
from database import engine
from models import QuestionBank

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shuffle_questions")

def run_shuffle():
    """
    Iterates through all questions in the QuestionBank, shuffles their options array,
    calculates the new index for the correct answer, and saves it to the database.
    """
    with Session(engine) as db:
        questions = db.query(QuestionBank).all()
        logger.info(f"Found {len(questions)} questions to shuffle.")
        
        shuffled_count = 0
        for q in questions:
            original_options = q.options
            if not original_options or len(original_options) == 0:
                continue
                
            original_correct_index = q.correct_option_index
            if original_correct_index is None or original_correct_index >= len(original_options):
                continue
                
            correct_answer_text = original_options[original_correct_index]
            
            # Shuffle the options
            shuffled_options = list(original_options)
            random.shuffle(shuffled_options)
            
            # Find the new index of the correct answer
            new_correct_index = shuffled_options.index(correct_answer_text)
            
            # Update the question
            q.options = shuffled_options
            q.correct_option_index = new_correct_index
            shuffled_count += 1
            
        db.commit()
        logger.info(f"Successfully shuffled {shuffled_count} questions.")

if __name__ == "__main__":
    run_shuffle()
