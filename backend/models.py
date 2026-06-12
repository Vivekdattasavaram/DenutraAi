from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    otps = relationship("OTP", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    otp_code = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="otps")

class QuestionBank(Base):
    __tablename__ = "question_bank"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) # Brushing, Flossing, Diet, etc.
    difficulty = Column(String, index=True) # Basic, Medium, Hard
    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False) # List of strings
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(String)
    educational_tip = Column(String)
    followup_question_id = Column(Integer, ForeignKey("question_bank.id"), nullable=True)

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session state tracking for adaptive flow
    current_category = Column(String, default="Brushing")  # Progressive category flow
    current_difficulty = Column(String, default="Basic")  # Adaptive difficulty level
    correct_streak = Column(Integer, default=0)  # Track consecutive correct answers
    wrong_streak = Column(Integer, default=0)  # Track consecutive wrong answers
    category_progress = Column(JSON, default={})  # Track visited categories and performance
    asked_questions = Column(JSON, default=[])  # Track asked question IDs to avoid repetition
    
    # ML Prediction inputs & stats
    literacy_level = Column(String, default="Medium")  # Input demographic
    literacy_classification_output = Column(String, nullable=True)  # Output: Beginner, Intermediate, Advanced
    previous_assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)  # Link to previous
    
    duration_seconds = Column(Integer, default=0)
    total_questions = Column(Integer, default=20)
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)

    # ML Prediction outputs
    oral_health_score = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True) # Low Risk, Medium Risk, High Risk
    ml_confidence = Column(Float, nullable=True)
    
    # Sub-scores
    knowledge_score = Column(Float, default=0.0)
    habit_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="assessments")
    answers = relationship("AssessmentAnswer", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("question_bank.id"), nullable=False)
    selected_option_index = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    time_taken_seconds = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment = relationship("Assessment", back_populates="answers")
    question = relationship("QuestionBank")

class ExerciseVideo(Base):
    __tablename__ = "exercise_videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    youtube_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FactOrMyth(Base):
    __tablename__ = "fact_or_myth"

    id = Column(Integer, primary_key=True, index=True)
    statement = Column(String, nullable=False)
    is_fact = Column(Boolean, nullable=False)
    explanation = Column(String, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Literacy Tracking
    initial_literacy_level = Column(String, nullable=True)
    current_literacy_level = Column(String, nullable=True)
    best_literacy_level = Column(String, nullable=True)
    initial_literacy_score = Column(Float, nullable=True)
    current_literacy_score = Column(Float, nullable=True)
    best_literacy_score = Column(Float, nullable=True)
    literacy_growth_percentage = Column(Float, default=0.0)
    total_reassessments_completed = Column(Integer, default=0)
    
    # Gamification & Progress
    xp_points = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    badges_earned = Column(JSON, default=[])
    learning_time_seconds = Column(Integer, default=0)
    completed_module_ids = Column(JSON, default=[])
    quiz_scores = Column(JSON, default={})
    
    last_learning_date = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="learning_progress")

class CurriculumModule(Base):
    __tablename__ = "curriculum_modules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    difficulty_tier = Column(String, nullable=False) # Beginner, Intermediate, Advanced
    
    # Academic Structure
    prerequisites = Column(JSON, default=[])
    learning_objectives = Column(JSON, default=[])
    expected_learning_outcomes = Column(JSON, default=[])
    
    # Content
    micro_lesson_content = Column(String, nullable=True)
    key_takeaways = Column(JSON, default=[])
    video_references = Column(JSON, default=[])
    quiz_questions = Column(JSON, default=[])
    
    estimated_minutes = Column(Integer, default=5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    action_route = Column(String, nullable=True)
    metadata_json = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")
