from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# --- Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp_code: str
    is_password_reset: Optional[bool] = False

class PasswordReset(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class UserOut(UserBase):
    id: int
    is_verified: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# --- Assessment Schemas ---

class QuestionOut(BaseModel):
    id: int
    category: str
    difficulty: str
    question_text: str
    options: List[str]
    
    class Config:
        from_attributes = True

class AssessmentStartPayload(BaseModel):
    literacy_level: Optional[str] = "Medium"

class AssessmentStart(BaseModel):
    assessment_id: int
    first_question: QuestionOut
    total_questions: int
    current_category: Optional[str] = None  # Starting category (Brushing)
    current_difficulty: Optional[str] = None  # Starting difficulty (Basic)

class QuestionProgress(BaseModel):
    next_question: Optional[QuestionOut]
    answered_count: int
    remaining_questions: int
    total_questions: int

class AnswerSubmit(BaseModel):
    assessment_id: int
    question_id: int
    selected_option_index: int
    time_taken_seconds: int

class AnswerResult(BaseModel):
    is_correct: bool
    correct_option_index: int
    correct_answer_text: Optional[str] = None  # New: show the correct option text
    explanation: Optional[str] = None
    educational_tip: Optional[str] = None
    next_question: Optional[QuestionOut] = None
    answered_count: int
    remaining_questions: int
    next_question_number: Optional[int] = None
    current_category: Optional[str] = None  # Current category in progression
    current_difficulty: Optional[str] = None  # Current difficulty level

class AssessmentOut(BaseModel):
    id: int
    oral_health_score: Optional[float]
    risk_level: Optional[str]
    ml_confidence: Optional[float]
    knowledge_score: float
    habit_score: float
    risk_score: float
    consistency_score: float
    correct_answers: Optional[int]
    wrong_answers: Optional[int]
    duration_seconds: Optional[int]
    literacy_classification_output: Optional[str] = None
    previous_assessment_id: Optional[int] = None
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class RecommendationOut(BaseModel):
    title: str
    description: str
    action_type: str # "diet", "habit", "knowledge", "risk"

class CurriculumModuleOut(BaseModel):
    id: int
    title: str
    category: str
    difficulty_tier: str
    estimated_minutes: int
    prerequisites: List[str] = []
    learning_objectives: List[str] = []
    expected_learning_outcomes: List[str] = []
    micro_lesson_content: Optional[str] = None
    key_takeaways: List[str] = []
    video_references: List[str] = []
    quiz_questions: List[Any] = []

    class Config:
        from_attributes = True

class LearningPathResponse(BaseModel):
    recommended_path: List[CurriculumModuleOut]
    next_recommended_module_id: Optional[int]

class LearningProgressOut(BaseModel):
    initial_literacy_level: Optional[str]
    current_literacy_level: Optional[str]
    best_literacy_level: Optional[str]
    initial_literacy_score: Optional[float]
    current_literacy_score: Optional[float]
    best_literacy_score: Optional[float]
    literacy_growth_percentage: float
    total_reassessments_completed: int
    xp_points: int
    streak_days: int
    badges_earned: List[str]
    learning_time_seconds: int
    completed_module_ids: List[int]

    class Config:
        from_attributes = True

class AssessmentSubmitPayload(BaseModel):
    category_scores: Optional[dict] = None

class AssessmentFinalResult(BaseModel):
    assessment: AssessmentOut
    recommendations: List[RecommendationOut]
    learning_path: Optional[LearningPathResponse] = None

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    action_route: Optional[str] = None
    metadata_json: Optional[Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True
