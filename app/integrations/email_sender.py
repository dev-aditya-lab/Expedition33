"""
Email sender integration using Gmail SMTP.
Sends marketing emails autonomously.
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()


def send_email(to: str, subject: str, body: str) -> dict:
    """
    Send an email using Gmail SMTP.
    
    Args:
        to: Recipient email address
        subject: Email subject line
        body: Email body content (can be HTML)
        
    Returns:
        dict with success status and message
    """
    gmail_address = os.getenv("GMAIL_ADDRESS")
    gmail_app_password = os.getenv("GMAIL_APP_PASSWORD")
    
    if not gmail_address or not gmail_app_password:
        return {
            "success": False,
            "message": "Gmail credentials not configured. Set GMAIL_ADDRESS and GMAIL_APP_PASSWORD in .env"
        }
    
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = gmail_address
        msg["To"] = to
        
        # Attach both plain text and HTML versions
        text_part = MIMEText(body, "plain")
        html_part = MIMEText(f"<html><body><pre>{body}</pre></body></html>", "html")
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send via Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(gmail_address, gmail_app_password)
            server.sendmail(gmail_address, to, msg.as_string())
        
        return {
            "success": True,
            "message": f"Email sent successfully to {to}"
        }
        
    except smtplib.SMTPAuthenticationError:
        return {
            "success": False,
            "message": "Gmail authentication failed. Check your app password."
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send email: {str(e)}"
        }
