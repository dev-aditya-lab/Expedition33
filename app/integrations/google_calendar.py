"""
Google Calendar Integration for AI Marketing Agent.
Creates calendar events when social posts are scheduled.
Uses Google Calendar API with service account authentication.
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Service account credentials file path
CREDENTIALS_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "service_account.json")
CALENDAR_ID = os.getenv("GOOGLE_CALENDAR_ID", "primary")  # Use 'primary' for the main calendar

# Required scopes for Google Calendar
SCOPES = ['https://www.googleapis.com/auth/calendar']


def get_calendar_service():
    """
    Create a Google Calendar API service instance.
    
    Returns:
        Google Calendar service object or None if credentials are not set up.
    """
    try:
        if not os.path.exists(CREDENTIALS_FILE):
            print(f"[Google Calendar] Service account file not found: {CREDENTIALS_FILE}")
            return None
        
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, 
            scopes=SCOPES
        )
        
        service = build('calendar', 'v3', credentials=credentials)
        return service
        
    except Exception as e:
        print(f"[Google Calendar] Error creating service: {e}")
        return None


def create_calendar_event(
    title: str,
    description: str,
    start_time: datetime,
    duration_minutes: int = 30,
    platform: str = "Social Media",
    image_url: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a calendar event for a scheduled social media post.
    
    Args:
        title: Event title (e.g., "Instagram Post: Product Launch")
        description: Full post content
        start_time: When the post is scheduled
        duration_minutes: Event duration (default 30 mins for posting time)
        platform: Social media platform
        image_url: Optional image URL to include in description
    
    Returns:
        Dict with success status and event details
    """
    service = get_calendar_service()
    
    if not service:
        return {
            "success": False,
            "message": "Google Calendar not configured. Add service_account.json file."
        }
    
    try:
        # Format the description
        full_description = f"📱 Platform: {platform}\n\n"
        full_description += f"📝 Content:\n{description}\n\n"
        
        if image_url:
            full_description += f"🖼️ Image: {image_url}\n\n"
        
        full_description += "---\nCreated by AI Marketing Agent"
        
        # Create event body
        event = {
            'summary': f"📢 {title}",
            'description': full_description,
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'Asia/Kolkata',  # Use IST
            },
            'end': {
                'dateTime': (start_time + timedelta(minutes=duration_minutes)).isoformat(),
                'timeZone': 'Asia/Kolkata',
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'popup', 'minutes': 30},  # 30 min before
                    {'method': 'popup', 'minutes': 10},  # 10 min before
                ],
            },
            'colorId': '9',  # Blue color for social media posts
        }
        
        # Insert the event
        created_event = service.events().insert(
            calendarId=CALENDAR_ID,
            body=event
        ).execute()
        
        print(f"[Google Calendar] Event created: {created_event.get('htmlLink')}")
        
        return {
            "success": True,
            "message": "Calendar event created successfully",
            "event_id": created_event.get('id'),
            "event_link": created_event.get('htmlLink')
        }
        
    except HttpError as error:
        print(f"[Google Calendar] API Error: {error}")
        return {
            "success": False,
            "message": f"Google Calendar API error: {str(error)}"
        }
    except Exception as e:
        print(f"[Google Calendar] Error: {e}")
        return {
            "success": False,
            "message": f"Failed to create calendar event: {str(e)}"
        }


def update_calendar_event(
    event_id: str,
    new_start_time: Optional[datetime] = None,
    new_title: Optional[str] = None,
    new_description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update an existing calendar event.
    
    Args:
        event_id: Google Calendar event ID
        new_start_time: New scheduled time (optional)
        new_title: New title (optional)
        new_description: New description (optional)
    
    Returns:
        Dict with success status
    """
    service = get_calendar_service()
    
    if not service:
        return {"success": False, "message": "Google Calendar not configured"}
    
    try:
        # Get existing event
        event = service.events().get(calendarId=CALENDAR_ID, eventId=event_id).execute()
        
        # Update fields
        if new_title:
            event['summary'] = f"📢 {new_title}"
        
        if new_description:
            event['description'] = new_description
        
        if new_start_time:
            duration = 30  # minutes
            event['start'] = {
                'dateTime': new_start_time.isoformat(),
                'timeZone': 'Asia/Kolkata',
            }
            event['end'] = {
                'dateTime': (new_start_time + timedelta(minutes=duration)).isoformat(),
                'timeZone': 'Asia/Kolkata',
            }
        
        # Update the event
        updated_event = service.events().update(
            calendarId=CALENDAR_ID,
            eventId=event_id,
            body=event
        ).execute()
        
        return {
            "success": True,
            "message": "Calendar event updated",
            "event_link": updated_event.get('htmlLink')
        }
        
    except Exception as e:
        print(f"[Google Calendar] Update error: {e}")
        return {"success": False, "message": str(e)}


def delete_calendar_event(event_id: str) -> Dict[str, Any]:
    """
    Delete a calendar event.
    
    Args:
        event_id: Google Calendar event ID
    
    Returns:
        Dict with success status
    """
    service = get_calendar_service()
    
    if not service:
        return {"success": False, "message": "Google Calendar not configured"}
    
    try:
        service.events().delete(calendarId=CALENDAR_ID, eventId=event_id).execute()
        return {"success": True, "message": "Calendar event deleted"}
        
    except Exception as e:
        print(f"[Google Calendar] Delete error: {e}")
        return {"success": False, "message": str(e)}


# Simple test function
if __name__ == "__main__":
    from datetime import datetime, timedelta
    
    # Test creating an event
    result = create_calendar_event(
        title="Test Social Post",
        description="This is a test post created by the AI Marketing Agent.",
        start_time=datetime.now() + timedelta(hours=1),
        platform="Instagram"
    )
    
    print(result)
