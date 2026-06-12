from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from database import get_db
import models, schemas, utils
from mail import send_otp_email
from dependencies import get_current_user
import os

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        if db_user.is_verified:
            raise HTTPException(status_code=400, detail="Email already registered and verified")
        # If not verified, we can resend OTP
    else:
        # Create new user
        hashed_password = utils.get_password_hash(user.password)
        db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Generate and save OTP
    otp_code = utils.generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    otp_record = models.OTP(
        user_id=db_user.id, 
        otp_code=otp_code, 
        purpose="register", 
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()

    # Send email
    if os.getenv("MAIL_PASSWORD") == "your_gmail_app_password":
        print(f"\n[DEV MODE] Skipping actual email. Your OTP for {user.email} is: {otp_code}\n")
    else:
        await send_otp_email(email_to=user.email, otp_code=otp_code, purpose="Registration")

    return {"message": "OTP sent successfully to email"}

@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp(payload: schemas.OTPVerify, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    purpose = "password_reset" if payload.is_password_reset else "register"
    
    # Find valid OTP
    otp_record = db.query(models.OTP).filter(
        models.OTP.user_id == db_user.id,
        models.OTP.otp_code == payload.otp_code,
        models.OTP.purpose == purpose,
        models.OTP.expires_at > datetime.now(timezone.utc)
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Mark user as verified
    if purpose == "register":
        db_user.is_verified = True
        # Delete used OTP for registration
        db.delete(otp_record)
        db.commit()
    
    # Generate JWT
    access_token = utils.create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not db_user or not utils.verify_password(payload.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")

    access_token = utils.create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/forgot-password", response_model=dict)
async def forgot_password(email: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        # Return success anyway to prevent email enumeration
        return {"message": "If an account exists, an OTP has been sent."}

    otp_code = utils.generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    otp_record = models.OTP(
        user_id=db_user.id, 
        otp_code=otp_code, 
        purpose="password_reset", 
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()

    import os
    if os.getenv("MAIL_PASSWORD") == "your_gmail_app_password":
        print(f"\n[DEV MODE] Skipping actual email. Your Password Reset OTP for {email} is: {otp_code}\n")
    else:
        await send_otp_email(email_to=email, otp_code=otp_code, purpose="Password Reset")

    return {"message": "If an account exists, an OTP has been sent."}

@router.post("/reset-password", response_model=dict)
def reset_password(payload: schemas.PasswordReset, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_record = db.query(models.OTP).filter(
        models.OTP.user_id == db_user.id,
        models.OTP.otp_code == payload.otp_code,
        models.OTP.purpose == "password_reset",
        models.OTP.expires_at > datetime.now(timezone.utc)
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Update password
    db_user.hashed_password = utils.get_password_hash(payload.new_password)
    db.delete(otp_record)
    db.commit()

    return {"message": "Password has been reset successfully"}

@router.post("/change-password", response_model=dict)
def change_password(payload: schemas.ChangePassword, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not utils.verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    current_user.hashed_password = utils.get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/me", response_model=dict)
def get_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Aggregated profile stats
    assessments_count = db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id, models.Assessment.completed_at != None).count()
    
    # Get latest assessment
    latest = db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id, models.Assessment.completed_at != None).order_by(models.Assessment.completed_at.desc()).first()
    
    avg_score = 0
    if assessments_count > 0:
        all_assessments = db.query(models.Assessment).filter(models.Assessment.user_id == current_user.id, models.Assessment.completed_at != None).all()
        avg_score = sum([a.oral_health_score or 0 for a in all_assessments]) / assessments_count
        
    progress = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == current_user.id).first()
    if not progress:
        progress = models.LearningProgress(user_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)

    return {
        "user": schemas.UserOut.from_orm(current_user),
        "stats": {
            "assessments_taken": assessments_count,
            "average_score": round(avg_score, 1),
            "latest_score": round(latest.oral_health_score, 1) if latest else 0,
            "learning_progress": len(progress.completed_module_ids or []) / max(1, db.query(models.CurriculumModule).count()),
            "literacy_growth_percentage": progress.literacy_growth_percentage,
            "learning_time_seconds": progress.learning_time_seconds,
            "streak_days": progress.streak_days
        }
    }
