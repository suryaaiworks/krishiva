import pytest
from app.controllers.auth_controller import AuthController
from app.middleware.auth_middleware import get_current_user
import jwt
import datetime
from app.config.settings import settings

def test_otp_send_and_verify(client, db_session):
    # 1. Send OTP
    phone = "9876543210"
    res = client.post("/api/v1/auth/otp/send", json={"phone": phone})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "session_id" in data

    # 2. Verify OTP (using sandbox code bypass)
    verify_res = client.post("/api/v1/auth/otp/verify", json={
        "phone": phone,
        "otp": "123456",
        "role": "Farmer"
    })
    assert verify_res.status_code == 200
    token_data = verify_res.json()
    assert "access_token" in token_data
    assert token_data["role"] == "Farmer"
    assert "user_id" in token_data

def test_signup_and_login_email(client, db_session):
    email = "test_farmer_2026@gmail.com"
    pwd = "password123"
    
    # Sign up
    res = client.post("/api/v1/auth/signup", json={
        "email": email,
        "password": pwd,
        "role": "Farmer"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "Farmer"
    
    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": pwd
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

def test_google_and_guest_logins(client, db_session):
    # Google Sign In
    res = client.post("/api/v1/auth/google", json={
        "id_token": "google_token_sample_abc_123",
        "role": "Farmer"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
    
    # Guest Login
    guest_res = client.post("/api/v1/auth/guest")
    assert guest_res.status_code == 403

def test_invalid_and_expired_jwt(client):
    # Unauthorized Request (No token)
    res = client.get("/api/v1/profile")
    assert res.status_code in [401, 403] # HTTPBearer raises 401 or 403 on missing authorization header

    # Invalid token format
    res = client.get("/api/v1/profile", headers={"Authorization": "Bearer invalidtokenformat"})
    assert res.status_code == 401

    # Expired token simulation
    expired_payload = {
        "sub": "user_id_test",
        "email": "expired@test.com",
        "role": "Farmer",
        "aud": "authenticated",
        "exp": datetime.datetime.utcnow() - datetime.timedelta(hours=1)
    }
    expired_token = jwt.encode(expired_payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    res = client.get("/api/v1/profile", headers={"Authorization": f"Bearer {expired_token}"})
    assert res.status_code == 401
    assert "expired" in res.json()["detail"].lower()
