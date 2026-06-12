import json
from database import engine, SessionLocal
from models import CurriculumModule

# 8 fully populated modules
populated_modules = [
    {
        "title": "Brushing Techniques",
        "category": "Habit",
        "difficulty_tier": "Beginner",
        "prerequisites": ["Oral Hygiene Fundamentals"],
        "learning_objectives": ["Understand the Modified Bass Technique", "Learn proper brushing duration"],
        "expected_learning_outcomes": ["Can demonstrate 45-degree angle brushing", "Brushes for 2 full minutes"],
        "micro_lesson_content": "### The Modified Bass Technique\n1. Place your toothbrush at a 45-degree angle to your gums.\n2. Move the brush back and forth gently in short strokes.\n3. Brush the outer, inner, and chewing surfaces of all teeth.\n4. Clean the inside of the front teeth by tilting the brush vertically.",
        "key_takeaways": ["Brush twice a day", "2 full minutes", "Use a soft-bristled brush"],
        "video_references": ["https://www.youtube.com/embed/placeholder1"],
        "quiz_questions": [
            {
                "question": "What is the recommended angle to hold your toothbrush against your gums?",
                "options": ["90 degrees", "45 degrees", "180 degrees", "Parallel"],
                "correct_index": 1,
                "explanation": "A 45-degree angle helps the bristles reach under the gumline where plaque hides."
            }
        ],
        "estimated_minutes": 5
    },
    {
        "title": "Flossing Techniques",
        "category": "Habit",
        "difficulty_tier": "Beginner",
        "prerequisites": ["Oral Hygiene Fundamentals"],
        "learning_objectives": ["Understand why flossing is essential", "Learn the C-shape flossing method"],
        "expected_learning_outcomes": ["Can properly wrap floss and clean interdental spaces"],
        "micro_lesson_content": "### How to Floss\nBreak off about 18 inches of floss and wind most of it around one of your middle fingers. Wind the remaining floss around the same finger of the opposite hand. Hold the floss tightly between your thumbs and forefingers. Guide the floss between your teeth using a gentle rubbing motion. Never snap the floss into the gums. Curve it into a C-shape against one tooth.",
        "key_takeaways": ["Floss at least once a day", "Use the C-shape method", "Don't snap the floss"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "How long should the piece of floss be when you start?",
                "options": ["5 inches", "10 inches", "18 inches", "3 feet"],
                "correct_index": 2,
                "explanation": "18 inches gives you enough length to use a clean section of floss for every tooth."
            }
        ],
        "estimated_minutes": 5
    },
    {
        "title": "Plaque and Tartar",
        "category": "Knowledge",
        "difficulty_tier": "Beginner",
        "prerequisites": [],
        "learning_objectives": ["Differentiate between plaque and tartar", "Understand how plaque forms"],
        "expected_learning_outcomes": ["Can explain why professional cleanings are needed for tartar"],
        "micro_lesson_content": "### Plaque vs Tartar\n**Plaque** is a sticky, colorless film of bacteria that constantly forms on our teeth and along the gum line. If plaque is not removed by regular brushing and flossing, it hardens into **Tartar** (also called calculus). Once tartar forms, it can only be removed by a dental professional.",
        "key_takeaways": ["Plaque is soft and removable at home", "Tartar is hard and requires a dentist", "Plaque turns into tartar in just 48 hours"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "Can you remove tartar at home with regular brushing?",
                "options": ["Yes", "No"],
                "correct_index": 1,
                "explanation": "Tartar is calcified and requires special tools used by a dental hygienist to safely remove."
            }
        ],
        "estimated_minutes": 4
    },
    {
        "title": "Cavities and Tooth Decay",
        "category": "Risk",
        "difficulty_tier": "Beginner",
        "prerequisites": ["Plaque and Tartar"],
        "learning_objectives": ["Understand the tooth decay process", "Identify signs of a cavity"],
        "expected_learning_outcomes": ["Can name the stages of tooth decay"],
        "micro_lesson_content": "### How Cavities Form\nTooth decay happens when foods containing carbohydrates are left on the teeth. Bacteria that live in the mouth digest these foods, turning them into acids. The bacteria, acid, food debris, and saliva combine to form plaque. The acids in plaque dissolve the enamel surface of the teeth, creating holes in the teeth called cavities.",
        "key_takeaways": ["Sugar + Bacteria = Acid", "Acid destroys enamel", "Fluoride helps rebuild enamel"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "What is the primary substance that destroys tooth enamel?",
                "options": ["Sugar", "Bacteria", "Acid", "Saliva"],
                "correct_index": 2,
                "explanation": "While sugar feeds bacteria, it is the ACID produced by the bacteria that actually destroys the enamel."
            }
        ],
        "estimated_minutes": 6
    },
    {
        "title": "Gum Diseases",
        "category": "Risk",
        "difficulty_tier": "Intermediate",
        "prerequisites": ["Plaque and Tartar"],
        "learning_objectives": ["Identify Gingivitis vs Periodontitis", "Recognize signs of gum disease"],
        "expected_learning_outcomes": ["Knows bleeding gums are a sign of infection"],
        "micro_lesson_content": "### Gingivitis vs Periodontitis\n**Gingivitis** is the earliest stage of gum disease, characterized by red, swollen gums that bleed easily. It is reversible. **Periodontitis** is an advanced stage where the bone and fibers holding your teeth in place are irreversibly damaged. It can lead to tooth loss.",
        "key_takeaways": ["Bleeding gums are not normal", "Gingivitis is reversible", "Periodontitis causes permanent bone loss"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "Is Periodontitis completely reversible?",
                "options": ["Yes, with better brushing", "No, bone loss is permanent"],
                "correct_index": 1,
                "explanation": "Unlike gingivitis, periodontitis causes structural damage to the bone which does not grow back naturally."
            }
        ],
        "estimated_minutes": 7
    },
    {
        "title": "Healthy Diet and Nutrition",
        "category": "Risk",
        "difficulty_tier": "Intermediate",
        "prerequisites": [],
        "learning_objectives": ["Understand how diet impacts oral health", "Identify tooth-friendly foods"],
        "expected_learning_outcomes": ["Can make healthier dietary choices for teeth"],
        "micro_lesson_content": "### Eat Your Way to a Healthy Smile\nFoods rich in calcium and phosphorus (like cheese, milk, and nuts) help remineralize teeth. Crunchy fruits and vegetables (like apples and carrots) act as natural toothbrushes, stimulating saliva production which washes away bacteria and neutralizes acids.",
        "key_takeaways": ["Cheese neutralizes acid", "Crunchy veggies stimulate saliva", "Drink plenty of water"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "Why are crunchy vegetables like carrots good for your teeth?",
                "options": ["They contain fluoride", "They stimulate saliva production", "They kill bacteria instantly", "They bleach teeth"],
                "correct_index": 1,
                "explanation": "Chewing crunchy foods stimulates saliva, which is your mouth's natural defense against acid."
            }
        ],
        "estimated_minutes": 5
    },
    {
        "title": "Sugar Consumption Awareness",
        "category": "Risk",
        "difficulty_tier": "Intermediate",
        "prerequisites": ["Healthy Diet and Nutrition"],
        "learning_objectives": ["Understand the concept of acid attacks", "Learn to identify hidden sugars"],
        "expected_learning_outcomes": ["Reduces frequency of sugary snacking"],
        "micro_lesson_content": "### Frequency vs Quantity\nWhen it comes to sugar and cavities, HOW OFTEN you eat sugar is actually more dangerous than HOW MUCH you eat at once. Every time you consume sugar, your teeth endure a 20-minute 'acid attack'. Sipping a sugary soda over 3 hours is much worse than drinking it all in 5 minutes.",
        "key_takeaways": ["Limit snacking between meals", "Beware of hidden sugars in drinks", "Drink water after sugary treats"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "What is more harmful to your teeth?",
                "options": ["Eating 5 candies at once", "Eating 1 candy every hour for 5 hours"],
                "correct_index": 1,
                "explanation": "Eating candy every hour subjects your teeth to continuous acid attacks without giving saliva time to neutralize the acid."
            }
        ],
        "estimated_minutes": 5
    },
    {
        "title": "Dental Checkups",
        "category": "Habit",
        "difficulty_tier": "Intermediate",
        "prerequisites": [],
        "learning_objectives": ["Understand what happens during a cleaning", "Recognize the importance of X-rays"],
        "expected_learning_outcomes": ["Schedules bi-annual dental visits"],
        "micro_lesson_content": "### Why Bi-Annual Visits Matter\nProfessional cleanings remove tartar that you cannot remove at home. Furthermore, dentists use X-rays to spot cavities forming BETWEEN the teeth or under existing fillings long before they cause pain. Catching decay early saves time, money, and your tooth structure.",
        "key_takeaways": ["Visit every 6 months", "X-rays find hidden decay", "Professional cleanings prevent periodontitis"],
        "video_references": [],
        "quiz_questions": [
            {
                "question": "Why do dentists take X-rays?",
                "options": ["To whiten teeth", "To see decay between teeth that is invisible to the eye", "To clean tartar"],
                "correct_index": 1,
                "explanation": "X-rays allow dentists to see inside the tooth and between teeth where visual examination cannot reach."
            }
        ],
        "estimated_minutes": 4
    }
]

# The remaining 18 shells
shell_topics = [
    ("Oral Hygiene Fundamentals", "Habit", "Beginner"),
    ("Tooth Anatomy", "Knowledge", "Beginner"),
    ("Bad Breath", "Knowledge", "Intermediate"),
    ("Tobacco and Alcohol Effects", "Risk", "Advanced"),
    ("Preventive Dentistry", "Knowledge", "Intermediate"),
    ("Orthodontic Care", "Knowledge", "Advanced"),
    ("Pediatric Oral Health", "Knowledge", "Advanced"),
    ("Adolescent Oral Health", "Knowledge", "Advanced"),
    ("Adult Oral Health", "Knowledge", "Intermediate"),
    ("Elderly Oral Health", "Knowledge", "Advanced"),
    ("Pregnancy and Oral Health", "Knowledge", "Advanced"),
    ("Oral Cancer Awareness", "Risk", "Advanced"),
    ("Dental Emergencies", "Knowledge", "Advanced"),
    ("Systemic Diseases and Oral Health", "Knowledge", "Advanced"),
    ("Diabetes and Oral Health", "Risk", "Advanced"),
    ("Lifestyle and Oral Health", "Habit", "Intermediate"),
    ("Community Oral Health", "Knowledge", "Advanced"),
    ("Long-Term Oral Health Maintenance", "Habit", "Advanced")
]

def seed():
    db = SessionLocal()
    
    # Clear existing to prevent duplicates
    db.query(CurriculumModule).delete()
    db.commit()
    
    print("Seeding populated modules...")
    for pm in populated_modules:
        mod = CurriculumModule(**pm)
        db.add(mod)
        
    print("Seeding structural shells...")
    for title, category, tier in shell_topics:
        mod = CurriculumModule(
            title=title,
            category=category,
            difficulty_tier=tier,
            prerequisites=[],
            learning_objectives=["TBD"],
            expected_learning_outcomes=["TBD"],
            micro_lesson_content="This module is currently under development. Check back soon for exciting new content!",
            key_takeaways=[],
            video_references=[],
            quiz_questions=[],
            estimated_minutes=5
        )
        db.add(mod)
        
    db.commit()
    db.close()
    print("Seeding complete! 26 modules added.")

if __name__ == "__main__":
    seed()
