import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "oralhealth749@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", ""),
    MAIL_FROM=os.getenv("MAIL_FROM", "oralhealth749@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_otp_email(email_to: str, otp_code: str, purpose: str):
    subject = "Oral Health App - Your Verification Code"
    body = f"""
    <h2>Hello,</h2>
    <p>Your OTP code for <b>{purpose}</b> is:</p>
    <h1 style="color: #3B82F6; letter-spacing: 5px;">{otp_code}</h1>
    <p>This code will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    """
    
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype=MessageType.html
    )
    
    # In a production environment, you'd want to handle errors/exceptions here
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print(f"Successfully sent OTP to {email_to}")
    except Exception as e:
        print(f"Failed to send email to {email_to}. Error: {e}")
