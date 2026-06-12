import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

CATEGORIES = ["Brushing", "Flossing", "Diet", "Smoking", "Gum Health", "Preventive Care", "Oral Diseases", "Dental Hygiene"]

QUESTIONS = [
    # --- Brushing ---
    {
        "category": "Brushing", "difficulty": "Basic",
        "question_text": "How many times a day should you ideally brush your teeth?",
        "options": ["Once", "Twice", "Three times", "Only when they feel dirty"],
        "correct_option_index": 1,
        "explanation": "Dentists recommend brushing twice a day, morning and night.",
        "educational_tip": "Brushing twice daily helps remove plaque that causes cavities and gum disease."
    },
    {
        "category": "Brushing", "difficulty": "Medium",
        "question_text": "How long should a proper tooth brushing session last?",
        "options": ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
        "correct_option_index": 2,
        "explanation": "Brushing for 2 minutes ensures you spend enough time cleaning all surfaces.",
        "educational_tip": "Try splitting your mouth into 4 quadrants and spend 30 seconds on each."
    },
    {
        "category": "Brushing", "difficulty": "Hard",
        "question_text": "What is the recommended angle to hold your toothbrush bristles against the gumline?",
        "options": ["90 degrees", "45 degrees", "10 degrees", "Parallel to the teeth"],
        "correct_option_index": 1,
        "explanation": "A 45-degree angle allows the bristles to reach slightly under the gumline where plaque hides.",
        "educational_tip": "The Modified Bass technique is highly recommended by periodontists."
    },

    # --- Flossing ---
    {
        "category": "Flossing", "difficulty": "Basic",
        "question_text": "How often should you floss your teeth?",
        "options": ["Once a week", "Once a day", "Only when food is stuck", "Never"],
        "correct_option_index": 1,
        "explanation": "Flossing once a day is crucial to remove plaque from between the teeth.",
        "educational_tip": "If you skip flossing, you miss cleaning 40% of your tooth surfaces."
    },
    {
        "category": "Flossing", "difficulty": "Medium",
        "question_text": "When is the best time to floss?",
        "options": ["Before brushing", "After brushing", "In the middle of the day", "It doesn't matter"],
        "correct_option_index": 0,
        "explanation": "Flossing before brushing dislodges plaque, allowing the fluoride from your toothpaste to reach between teeth.",
        "educational_tip": "Floss first, then brush!"
    },

    # --- Diet ---
    {
        "category": "Diet", "difficulty": "Basic",
        "question_text": "Which of these is worst for your teeth?",
        "options": ["Cheese", "Sticky candies (like gummy bears)", "Water", "Apples"],
        "correct_option_index": 1,
        "explanation": "Sticky candies adhere to teeth for long periods, giving bacteria more time to produce acid.",
        "educational_tip": "If you eat sugary treats, consume them with meals rather than as standalone snacks."
    },
    {
        "category": "Diet", "difficulty": "Medium",
        "question_text": "Why are acidic drinks like soda and sports drinks harmful?",
        "options": ["They stain teeth permanently", "They erode tooth enamel", "They cause gum bleeding immediately", "They contain too much water"],
        "correct_option_index": 1,
        "explanation": "Acid weakens and wears away the hard outer layer of your teeth (enamel).",
        "educational_tip": "Drink acidic beverages through a straw to minimize contact with your teeth."
    },
    
    # --- Smoking ---
    {
        "category": "Smoking", "difficulty": "Medium",
        "question_text": "How does smoking primarily affect oral health?",
        "options": ["It makes teeth stronger", "It reduces blood flow to the gums", "It prevents cavities", "It only causes bad breath"],
        "correct_option_index": 1,
        "explanation": "Smoking restricts blood flow, making it harder for gums to heal and fight infection.",
        "educational_tip": "Smokers are twice as likely to develop gum disease compared to non-smokers."
    },

    # --- Gum Health ---
    {
        "category": "Gum Health", "difficulty": "Basic",
        "question_text": "Is it normal for gums to bleed when brushing or flossing?",
        "options": ["Yes, it means you are cleaning well", "No, it's a sign of inflammation (gingivitis)", "Yes, if you use a hard brush", "Only in the morning"],
        "correct_option_index": 1,
        "explanation": "Healthy gums do not bleed. Bleeding is the first sign of gum disease.",
        "educational_tip": "If your gums bleed, don't stop brushing; switch to a soft brush and maintain gentle, consistent cleaning."
    },
    {
        "category": "Gum Health", "difficulty": "Hard",
        "question_text": "What is the irreversible, advanced stage of gum disease called?",
        "options": ["Gingivitis", "Periodontitis", "Halitosis", "Caries"],
        "correct_option_index": 1,
        "explanation": "Periodontitis destroys the bone supporting the teeth, leading to tooth loss.",
        "educational_tip": "Gingivitis is reversible with good care, but periodontitis requires professional intervention."
    },

    # --- Preventive Care ---
    {
        "category": "Preventive Care", "difficulty": "Basic",
        "question_text": "How often should you typically visit the dentist for a check-up?",
        "options": ["Every 1-2 years", "Every 6 months", "Only when in pain", "Every month"],
        "correct_option_index": 1,
        "explanation": "Regular check-ups every 6 months help catch problems early before they require major treatment.",
        "educational_tip": "Professional cleanings remove hardened plaque (tartar) that you cannot brush away at home."
    }
]

def seed_database():
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(models.QuestionBank).first()
        if existing:
            print("Database already seeded with questions. Deleting old questions...")
            db.query(models.QuestionBank).delete()
            db.commit()
            
        print("Seeding QuestionBank...")
        for q_data in QUESTIONS:
            question = models.QuestionBank(**q_data)
            db.add(question)
        db.commit()
        print(f"Successfully seeded {len(QUESTIONS)} questions.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
