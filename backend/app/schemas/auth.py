from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class OTPSendRequest(BaseModel):
    phone: str = Field(..., pattern=r"^[6-9]\d{9}$")

class OTPSendResponse(BaseModel):
    success: bool
    message: str
    session_id: str

class OTPVerifyRequest(BaseModel):
    phone: str = Field(..., pattern=r"^[6-9]\d{9}$")
    otp: str = Field(..., min_length=6, max_length=6)
    role: Optional[str] = "Farmer"

class EmailSignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: Optional[str] = None
    role: Optional[str] = "Farmer"

class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: Optional[str] = "Farmer"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class StandardResponse(BaseModel):
    success: bool
    message: str
