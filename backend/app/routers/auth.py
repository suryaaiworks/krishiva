from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.auth import (
    OTPSendRequest, OTPSendResponse, OTPVerifyRequest,
    EmailSignupRequest, EmailLoginRequest, TokenResponse,
    GoogleLoginRequest, ForgotPasswordRequest, StandardResponse
)
from app.controllers.auth_controller import AuthController

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/otp/send", response_model=OTPSendResponse)
def send_otp(payload: OTPSendRequest):
    res = AuthController.send_otp(payload.phone)
    return OTPSendResponse(
        success=res["success"],
        message=res["message"],
        session_id=res["session_id"]
    )

@router.post("/otp/verify", response_model=TokenResponse)
def verify_otp(payload: OTPVerifyRequest, db: Session = Depends(get_db)):
    res = AuthController.verify_otp(db, payload.phone, payload.otp, payload.role)
    return TokenResponse(
        access_token=res["access_token"],
        role=res["role"],
        user_id=res["user_id"]
    )

@router.post("/signup", response_model=TokenResponse)
def email_signup(payload: EmailSignupRequest, db: Session = Depends(get_db)):
    res = AuthController.signup_email(db, payload.email, payload.password, payload.phone, payload.role)
    return TokenResponse(
        access_token=res["access_token"],
        role=res["role"],
        user_id=res["user_id"]
    )

@router.post("/login", response_model=TokenResponse)
def email_login(payload: EmailLoginRequest, db: Session = Depends(get_db)):
    res = AuthController.login_email(db, payload.email, payload.password)
    return TokenResponse(
        access_token=res["access_token"],
        role=res["role"],
        user_id=res["user_id"]
    )

@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    res = AuthController.google_login(db, payload.id_token, payload.role)
    return TokenResponse(
        access_token=res["access_token"],
        role=res["role"],
        user_id=res["user_id"]
    )



@router.post("/forgot-password", response_model=StandardResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    res = AuthController.forgot_password(db, payload.email)
    return StandardResponse(
        success=res["success"],
        message=res["message"]
    )
