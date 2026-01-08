"""
WhatsApp sender integration using Twilio.
Sends promotional WhatsApp messages autonomously.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def send_whatsapp(to: str, message: str) -> dict:
    """
    Send a WhatsApp message using Twilio.
    
    Args:
        to: Recipient phone number (with country code, e.g., +919876543210)
        message: Message content to send
        
    Returns:
        dict with success status and message
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_WHATSAPP_FROM")
    
    if not account_sid or not auth_token or not from_number:
        return {
            "success": False,
            "message": "Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env"
        }
    
    try:
        # Import twilio only when needed
        from twilio.rest import Client
        
        client = Client(account_sid, auth_token)
        
        # Ensure proper WhatsApp format
        to_whatsapp = f"whatsapp:{to}" if not to.startswith("whatsapp:") else to
        from_whatsapp = f"whatsapp:{from_number}" if not from_number.startswith("whatsapp:") else from_number
        
        # Send the message
        twilio_message = client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )
        
        return {
            "success": True,
            "message": f"WhatsApp message sent successfully. SID: {twilio_message.sid}"
        }
        
    except ImportError:
        return {
            "success": False,
            "message": "Twilio package not installed. Run: pip install twilio"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send WhatsApp message: {str(e)}"
        }
