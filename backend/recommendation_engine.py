import models
from sqlalchemy.orm import Session

class RecommendationEngine:
    def generate_recommendations(self, knowledge_score, habit_score, risk_score, wrong_categories, literacy_level="Medium"):
        recommendations = []

        is_low_literacy = (literacy_level == "Low")

        if habit_score < 60:
            if is_low_literacy:
                desc = "Try to brush 2 times every day."
            else:
                desc = "Your brushing and flossing routines need consistency. Set a daily alarm to brush twice and floss once."
            recommendations.append({
                "title": "Improve Daily Habits",
                "description": desc,
                "action_type": "habit"
            })
        
        if risk_score < 50:
            if is_low_literacy:
                desc = "Eating too much sugar causes cavities. Try to drink water instead of soda."
            else:
                desc = "High sugar intake or smoking drastically increases gum disease risk. Try cutting out sugary drinks."
            recommendations.append({
                "title": "Reduce Risk Factors",
                "description": desc,
                "action_type": "risk"
            })
            
        if knowledge_score < 70:
            if is_low_literacy:
                desc = "Watch a video on how to brush better."
            else:
                desc = "Watch our interactive tutorials on the Modified Bass brushing technique to improve your plaque removal."
            recommendations.append({
                "title": "Learn Dental Basics",
                "description": desc,
                "action_type": "knowledge"
            })

        # Dynamic Category Feedback
        category_tips = {
            "Brushing Habits": {
                "title": "Brushing Routine",
                "desc": "Brush 2 times every day for 2 minutes." if is_low_literacy else "Your brushing consistency can be improved. Make sure to use the Modified Bass technique twice daily.",
                "type": "habit"
            },
            "Flossing Habits": {
                "title": "Flossing Technique",
                "desc": "Flossing is important to clean between teeth." if is_low_literacy else "You missed questions about flossing. Remember to form a C-shape around the tooth and slide gently under the gumline.",
                "type": "habit"
            },
            "Diet & Sugar Consumption": {
                "title": "Sugar Reduction",
                "desc": "Sugar hurts your teeth. Eat less candy." if is_low_literacy else "Sugar fuels the bacteria that cause cavities. Check out our nutrition guide to learn about tooth-friendly foods.",
                "type": "diet"
            },
            "Gum Health": {
                "title": "Gum Health",
                "desc": "Healthy gums don't bleed. Be gentle." if is_low_literacy else "Bleeding or swollen gums are early signs of gingivitis. Focus on gentle, thorough plaque removal at the gumline.",
                "type": "risk"
            },
            "Dental Visits": {
                "title": "Dental Checkups",
                "desc": "Visit your dentist twice a year." if is_low_literacy else "Regular professional cleanings are essential to remove calculus that brushing cannot.",
                "type": "habit"
            },
            "Oral Hygiene Knowledge": {
                "title": "Oral Health Basics",
                "desc": "Keep learning about your teeth!" if is_low_literacy else "Consider reviewing our interactive learning modules to strengthen your foundational oral health knowledge.",
                "type": "knowledge"
            }
        }

        for category in wrong_categories:
            if category in category_tips:
                tip = category_tips[category]
                # Avoid duplicates
                if not any(r["title"] == tip["title"] for r in recommendations):
                    recommendations.append({
                        "title": tip["title"],
                        "description": tip["desc"],
                        "action_type": tip["type"]
                    })

        # Default positive reinforcement if doing great
        if not recommendations:
            recommendations.append({
                "title": "Keep it up!",
                "description": "Great job! Keep brushing every day." if is_low_literacy else "Your oral health routines are excellent. Just remember to visit your dentist every 6 months.",
                "action_type": "habit"
            })

        return recommendations
