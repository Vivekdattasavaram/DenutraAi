from typing import List
from sqlalchemy.orm import Session
import models, schemas

class CurriculumEngine:
    
    def __init__(self):
        # Maps assessment categories to a list of curriculum module categories
        self.category_mapping = {
            "Gum Health": ["Gum Diseases", "Preventive Dentistry", "Dental Checkups"],
            "Diet & Sugar Consumption": ["Healthy Diet and Nutrition", "Sugar Consumption Awareness", "Cavities and Tooth Decay"],
            "Flossing Habits": ["Flossing Techniques", "Plaque and Tartar"],
            "Brushing Habits": ["Brushing Techniques", "Plaque and Tartar", "Oral Hygiene Fundamentals"],
            "Dental Visits": ["Preventive Dentistry", "Dental Checkups"]
        }

    def generate_personalized_path(self, db: Session, user_id: int, wrong_categories: List[str], literacy_class: str) -> schemas.LearningPathResponse:
        # Get learning progress
        progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == user_id).first()
        completed_ids = progress.completed_module_ids if progress and progress.completed_module_ids else []
        
        # Determine priority categories based on weaknesses
        priority_categories = []
        for wc in wrong_categories:
            if wc in self.category_mapping:
                priority_categories.extend(self.category_mapping[wc])
                
        # Deduplicate while preserving order
        priority_categories = list(dict.fromkeys(priority_categories))
        
        # Fetch all available modules
        all_modules = db.query(models.CurriculumModule).all()
        
        priority_1 = []
        priority_2 = []
        priority_3 = []
        
        for mod in all_modules:
            if mod.id in completed_ids:
                continue # Skip completed
                
            is_priority_cat = mod.title in priority_categories or mod.category in priority_categories
            is_matching_tier = mod.difficulty_tier == literacy_class
            
            # Rule: Don't show Advanced to Beginner unless it's a critical mapped weakness
            if literacy_class == "Beginner" and mod.difficulty_tier == "Advanced" and not is_priority_cat:
                continue
                
            if is_priority_cat:
                priority_1.append(mod)
            elif is_matching_tier:
                priority_2.append(mod)
            else:
                priority_3.append(mod)
                
        # Combine priorities
        final_path = priority_1 + priority_2 + priority_3
        
        # Format response
        path_out = [schemas.CurriculumModuleOut.from_orm(m) for m in final_path]
        next_id = path_out[0].id if len(path_out) > 0 else None
        
        return schemas.LearningPathResponse(
            recommended_path=path_out,
            next_recommended_module_id=next_id
        )
