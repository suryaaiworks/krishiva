import pytest
from app.services.brevo_service import BrevoEmailService
from app.services.storage_service import StorageService, MOCK_STORAGE_DIR
from app.services.weather_service import WeatherService
import os

def test_brevo_email_service_fallback():
    # Verify that email service returns True (success) even when keys are missing (logs fallback)
    # This verifies standard graceful degradation.
    res_welcome = BrevoEmailService.send_welcome_email("test_recipient@gmail.com", "Ramesh Patil")
    assert res_welcome is True
    
    res_otp = BrevoEmailService.send_otp_email("test_recipient@gmail.com", "883311")
    assert res_otp is True
    
    res_reset = BrevoEmailService.send_forgot_password_email("test_recipient@gmail.com", "https://krishiva.com/reset")
    assert res_reset is True
    
    res_verify = BrevoEmailService.send_verification_email("test_recipient@gmail.com", "https://krishiva.com/verify")
    assert res_verify is True

def test_storage_service_upload_fallback():
    bucket = "test-profile-bucket"
    file_name = "test_avatar.jpg"
    test_content = b"fakejpegbytesdatastringavatar"
    
    # Trigger upload
    public_url = StorageService.upload_file(bucket, file_name, test_content, "image/jpeg")
    
    # Verification fallback returns a valid HTTP string
    assert public_url.startswith("http")
    assert bucket in public_url
    
    # Assert that file was successfully saved locally as fallback
    local_saved_file = None
    local_bucket_path = os.path.join(MOCK_STORAGE_DIR, bucket)
    if os.path.exists(local_bucket_path):
        for f in os.listdir(local_bucket_path):
            if file_name in f:
                local_saved_file = os.path.join(local_bucket_path, f)
                break
                
    assert local_saved_file is not None
    assert os.path.exists(local_saved_file)
    
    # Cleanup
    try:
        os.remove(local_saved_file)
        os.rmdir(local_bucket_path)
    except Exception:
        pass

def test_weather_service_logic():
    res = WeatherService.get_weather_forecast(18.5204, 73.8567)
    assert "current" in res
    assert "hourly" in res
    assert "daily" in res
    assert isinstance(res["current"]["temp"], (int, float))
    assert len(res["daily"]) > 0
    assert "advice" in res["daily"][0]
