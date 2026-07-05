import httpx
import logging
import smtplib
import time
import asyncio
from email.mime.text import MIMEText
from app.config.settings import settings

logger = logging.getLogger(__name__)

class BrevoEmailService:
    BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str) -> bool:
        """
        Sends email via Brevo HTTP API (with retries) and falls back to SMTP relay.
        Runs synchronously.
        """
        # Try HTTP API first
        headers = {
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json"
        }
        
        payload = {
            "sender": {
                "name": settings.BREVO_SENDER_NAME,
                "email": settings.BREVO_SENDER_EMAIL
            },
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content
        }

        # Check if API key is placeholder
        is_api_configured = settings.BREVO_API_KEY and "your-brevo" not in settings.BREVO_API_KEY

        if is_api_configured:
            for attempt in range(3):
                try:
                    with httpx.Client(timeout=10) as client:
                        response = client.post(BrevoEmailService.BREVO_API_URL, headers=headers, json=payload)
                        if response.status_code in [200, 201, 202]:
                            logger.info(f"Email successfully sent to {to_email} via Brevo HTTP API.")
                            return True
                        else:
                            logger.warning(f"Brevo API attempt {attempt+1} failed: {response.status_code}. Retrying...")
                except Exception as e:
                    logger.warning(f"Brevo API attempt {attempt+1} exception: {e}. Retrying...")
                time.sleep(2 ** attempt)

        # Fallback to SMTP relay
        is_smtp_configured = settings.SMTP_USERNAME and settings.SMTP_PASSWORD
        if is_smtp_configured:
            logger.info("Attempting SMTP fallback email dispatch...")
            try:
                msg = MIMEText(html_content, 'html')
                msg['Subject'] = subject
                msg['From'] = f"{settings.BREVO_SENDER_NAME} <{settings.BREVO_SENDER_EMAIL}>"
                msg['To'] = to_email
                
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    server.starttls()
                    server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                    server.send_message(msg)
                logger.info(f"Email successfully sent to {to_email} via Brevo SMTP Fallback.")
                return True
            except Exception as smtp_err:
                logger.error(f"Brevo SMTP fallback failed: {smtp_err}")

        # If both fail or are unconfigured, log to console
        logger.warning(f"All email dispatch options failed or unconfigured. To: {to_email} | Subject: {subject}")
        return False

    @staticmethod
    async def send_email_async(to_email: str, subject: str, html_content: str) -> bool:
        """
        Asynchronous wrapper around send_email to run in event loop without blocking.
        """
        return await asyncio.to_thread(BrevoEmailService.send_email, to_email, subject, html_content)

    @staticmethod
    def send_welcome_email(to_email: str, name: str) -> bool:
        subject = "Welcome to Krishiva - Empowering Farmers with AI"
        html = f"""
        <html>
            <body>
                <h2>Welcome to Krishiva, {name}!</h2>
                <p>We are thrilled to welcome you to Krishiva, the AI-powered B2B platform built to empower farmers.</p>
                <p>Use our Vira AI advisor, check daily weather warnings, evaluate plant diseases, and negotiate directly with APMC buyers!</p>
                <br/>
                <p>Happy Farming,</p>
                <p>The Krishiva Team</p>
            </body>
        </html>
        """
        return BrevoEmailService.send_email(to_email, subject, html)

    @staticmethod
    def send_otp_email(to_email: str, otp: str) -> bool:
        subject = f"Krishiva Login OTP: {otp}"
        html = f"""
        <html>
            <body>
                <h2>Krishiva Verification OTP Code</h2>
                <p>Please enter the following 6-digit OTP code to complete your login session:</p>
                <h1 style="color:#10b981; font-family:sans-serif; letter-spacing:2px;">{otp}</h1>
                <p>This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
            </body>
        </html>
        """
        return BrevoEmailService.send_email(to_email, subject, html)

    @staticmethod
    def send_forgot_password_email(to_email: str, reset_link: str) -> bool:
        subject = "Krishiva Password Reset Request"
        html = f"""
        <html>
            <body>
                <h2>Reset Your Krishiva Account Password</h2>
                <p>We received a request to reset your password. Click the link below to configure a new password:</p>
                <p><a href="{reset_link}" style="background-color:#10b981; color:white; padding:10px 18px; text-decoration:none; border-radius:5px; font-weight:bold;">Reset Password</a></p>
                <p>If you did not make this request, please ignore this email.</p>
            </body>
        </html>
        """
        return BrevoEmailService.send_email(to_email, subject, html)

    @staticmethod
    def send_verification_email(to_email: str, verify_link: str) -> bool:
        subject = "Verify Your Krishiva Email Address"
        html = f"""
        <html>
            <body>
                <h2>Complete Your Krishiva Registration</h2>
                <p>Click the link below to verify your email address and activate your profile account:</p>
                <p><a href="{verify_link}" style="background-color:#10b981; color:white; padding:10px 18px; text-decoration:none; border-radius:5px; font-weight:bold;">Verify Email</a></p>
            </body>
        </html>
        """
        return BrevoEmailService.send_email(to_email, subject, html)

    @staticmethod
    def send_general_notification_email(to_email: str, title: str, message: str) -> bool:
        subject = f"Krishiva Alert: {title}"
        html = f"""
        <html>
            <body>
                <h2>{title}</h2>
                <p>{message}</p>
                <br/>
                <p>Best Regards,</p>
                <p>Krishiva Operational Alert System</p>
            </body>
        </html>
        """
        return BrevoEmailService.send_email(to_email, subject, html)
