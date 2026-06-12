import json
from database import SessionLocal
from models import CurriculumModule, Assessment, User, LearningProgress
from ml_engine import MLEngine
from curriculum_engine import CurriculumEngine

def run_validation():
    db = SessionLocal()
    report = []
    
    report.append("=== 1. DATABASE VALIDATION ===")
    modules = db.query(CurriculumModule).all()
    report.append(f"Total Curriculum Modules Found: {len(modules)}")
    
    populated = [m for m in modules if len(m.learning_objectives) > 1 and "TBD" not in m.learning_objectives]
    report.append(f"Fully Populated Modules Found: {len(populated)}")
    
    if populated:
        sample = populated[0]
        report.append(f"Sample Module: {sample.title}")
        report.append(f"- Learning Objectives: {sample.learning_objectives}")
        report.append(f"- Key Takeaways: {sample.key_takeaways}")
        report.append(f"- Has Micro-Lesson: {bool(sample.micro_lesson_content)}")
        report.append(f"- Has Quizzes: {bool(sample.quiz_questions)}")
        
    report.append("\n=== 2. ASSESSMENT VALIDATION (ML Classification) ===")
    ml_engine = MLEngine()
    
    # Mock Beginner
    a1 = Assessment(habit_score=20, knowledge_score=30, risk_score=20, consistency_score=40, correct_answers=5, wrong_answers=15, duration_seconds=120)
    score1, risk1, conf1, lit1 = ml_engine.predict_full(a1)
    report.append(f"Beginner Simulation -> Score: {score1:.1f}, Class: {lit1}, Risk: {risk1}")
    
    # Mock Intermediate
    a2 = Assessment(habit_score=60, knowledge_score=50, risk_score=60, consistency_score=70, correct_answers=12, wrong_answers=8, duration_seconds=180)
    score2, risk2, conf2, lit2 = ml_engine.predict_full(a2)
    report.append(f"Intermediate Simulation -> Score: {score2:.1f}, Class: {lit2}, Risk: {risk2}")
    
    # Mock Advanced
    a3 = Assessment(habit_score=90, knowledge_score=85, risk_score=95, consistency_score=90, correct_answers=18, wrong_answers=2, duration_seconds=150)
    score3, risk3, conf3, lit3 = ml_engine.predict_full(a3)
    report.append(f"Advanced Simulation -> Score: {score3:.1f}, Class: {lit3}, Risk: {risk3}")
    
    report.append("\n=== 3. PERSONALIZED LEARNING PATH VALIDATION ===")
    curr_engine = CurriculumEngine()
    
    # Simulate a user
    test_user = db.query(User).first()
    if not test_user:
        report.append("No user found in DB to simulate path.")
    else:
        # Simulate failures in Flossing and Diet
        wrong_cats = ["Flossing Habits", "Diet & Sugar Consumption"]
        path_res = curr_engine.generate_personalized_path(db, test_user.id, wrong_cats, "Beginner")
        
        report.append(f"Simulating weaknesses in: {wrong_cats} for a Beginner")
        report.append(f"Path Length: {len(path_res.recommended_path)}")
        report.append("Top 3 Recommended Modules:")
        for idx, mod in enumerate(path_res.recommended_path[:3]):
            report.append(f"  {idx+1}. {mod.title} (Category: {mod.category}, Tier: {mod.difficulty_tier})")
            
        report.append("\n=== 4. LEARNING DASHBOARD & REASSESSMENT VALIDATION ===")
        # Check current progress
        prog = db.query(LearningProgress).filter(LearningProgress.user_id == test_user.id).first()
        if not prog:
            prog = LearningProgress(user_id=test_user.id, initial_literacy_score=score1, current_literacy_score=score1, initial_literacy_level=lit1, current_literacy_level=lit1)
            db.add(prog)
            db.commit()
            
        report.append(f"Initial XP: {prog.xp_points}, Badges: {prog.badges_earned}, Completed: {len(prog.completed_module_ids or [])}")
        
        # Simulate completing 3 modules
        completed_list = list(prog.completed_module_ids) if prog.completed_module_ids else []
        mod1_id = path_res.recommended_path[0].id
        mod2_id = path_res.recommended_path[1].id
        mod3_id = path_res.recommended_path[2].id
        
        completed_list.extend([mod1_id, mod2_id, mod3_id])
        prog.completed_module_ids = completed_list
        prog.xp_points += 150
        prog.badges_earned = ["First Steps"]
        prog.learning_time_seconds += 600 # 10 mins
        db.commit()
        
        report.append(f"After completing 3 modules -> XP: {prog.xp_points}, Badges: {prog.badges_earned}")
        report.append(f"Reassessment Triggered? {'Yes' if len(prog.completed_module_ids) % 3 == 0 else 'No'}")
        
        # Simulate taking assessment and improving
        prog.current_literacy_score = score2
        prog.current_literacy_level = lit2
        prog.literacy_growth_percentage = ((score2 - prog.initial_literacy_score) / prog.initial_literacy_score) * 100.0
        db.commit()
        
        report.append(f"After Reassessment -> Literacy Growth: {prog.literacy_growth_percentage:.1f}%")

    db.close()
    
    with open("validation_results.txt", "w") as f:
        f.write("\n".join(report))
        
    print("Validation script complete. Check validation_results.txt")

if __name__ == "__main__":
    run_validation()
