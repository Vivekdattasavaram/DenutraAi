import json
from database import SessionLocal
import models

def seed_learning_data():
    db = SessionLocal()

    # Clear existing
    db.query(models.ExerciseVideo).delete()
    db.query(models.FactOrMyth).delete()
    
    videos = [
        {
            "title": "Proper Brushing Technique (Modified Bass)",
            "description": "Learn the ADA-recommended brushing technique to remove plaque effectively.",
            "youtube_url": "v=4iIGhqi57es", # Sample ID for brushing
            "thumbnail_url": "healthy_tooth.png",
            "duration": "2:15",
            "category": "Brushing"
        },
        {
            "title": "How to Floss Correctly",
            "description": "Step-by-step guide to flossing your teeth without hurting your gums.",
            "youtube_url": "v=HhdoPXNKNm4",
            "thumbnail_url": "flossing.png",
            "duration": "1:45",
            "category": "Flossing"
        },
        {
            "title": "Understanding Gum Disease",
            "description": "What causes gingivitis and how you can prevent it at home.",
            "youtube_url": "v=G_L34fTf_rQ",
            "thumbnail_url": "bleeding_gums.png",
            "duration": "3:10",
            "category": "Gum Health"
        },
        {
            "title": "Diet and Cavities",
            "description": "How sugar leads to tooth decay and what foods are safe.",
            "youtube_url": "v=a1_W_z-hB0o",
            "thumbnail_url": "cavity.png",
            "duration": "2:30",
            "category": "Diet & Sugar"
        }
    ]
    
    for v in videos:
        db.add(models.ExerciseVideo(**v))
        
    facts_myths = [
        {
            "statement": "Brushing harder cleans your teeth better.",
            "is_fact": False,
            "explanation": "Brushing too hard can wear down enamel and cause receding gums. Use a soft-bristled brush and gentle pressure.",
            "category": "Brushing"
        },
        {
            "statement": "You only need to see a dentist when your teeth hurt.",
            "is_fact": False,
            "explanation": "Many dental problems don't cause pain until they are advanced. Regular checkups can catch issues early.",
            "category": "Dental Visits"
        },
        {
            "statement": "Fluoride strengthens teeth and prevents decay.",
            "is_fact": True,
            "explanation": "Fluoride remineralizes weakened enamel, reversing early signs of tooth decay.",
            "category": "Oral Hygiene Knowledge"
        },
        {
            "statement": "Sugar is the main cause of cavities.",
            "is_fact": True,
            "explanation": "Bacteria in your mouth feed on sugar and produce acid that destroys tooth enamel.",
            "category": "Diet & Sugar"
        },
        {
            "statement": "Bleeding gums are normal when you floss.",
            "is_fact": False,
            "explanation": "Bleeding gums are a sign of inflammation or gingivitis. With regular, gentle flossing, the bleeding should stop.",
            "category": "Gum Health"
        }
    ]
    
    for fm in facts_myths:
        db.add(models.FactOrMyth(**fm))
        
    db.commit()
    print(f"Seeded {len(videos)} videos and {len(facts_myths)} facts/myths.")
    db.close()

if __name__ == "__main__":
    seed_learning_data()
