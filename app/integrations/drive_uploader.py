"""
Google Drive uploader integration.
Uploads marketing content to Google Drive.
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


def upload_to_drive(content: str, filename: str, folder_id: str = None) -> dict:
    """
    Upload content to Google Drive.
    
    Args:
        content: Text content to upload
        filename: Name for the file
        folder_id: Optional Google Drive folder ID
        
    Returns:
        dict with success status, file ID, and URL
    """
    service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    
    if not service_account_json:
        return {
            "success": False,
            "message": "Google Drive credentials not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON path in .env"
        }
    
    try:
        # Import Google libraries only when needed
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaInMemoryUpload
        
        # Load service account credentials
        credentials = service_account.Credentials.from_service_account_file(
            service_account_json,
            scopes=["https://www.googleapis.com/auth/drive.file"]
        )
        
        # Build Drive service
        service = build("drive", "v3", credentials=credentials)
        
        # Prepare file metadata
        file_metadata = {
            "name": filename,
            "mimeType": "text/plain"
        }
        
        if folder_id:
            file_metadata["parents"] = [folder_id]
        
        # Create media upload
        media = MediaInMemoryUpload(
            content.encode("utf-8"),
            mimetype="text/plain",
            resumable=True
        )
        
        # Upload file
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id, webViewLink"
        ).execute()
        
        return {
            "success": True,
            "file_id": file.get("id"),
            "url": file.get("webViewLink"),
            "message": f"File uploaded successfully: {filename}"
        }
        
    except ImportError:
        return {
            "success": False,
            "message": "Google API packages not installed. Run: pip install google-api-python-client google-auth"
        }
    except FileNotFoundError:
        return {
            "success": False,
            "message": f"Service account file not found: {service_account_json}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to upload to Drive: {str(e)}"
        }


def upload_marketing_pack_to_drive(marketing_content: dict, business_name: str, folder_id: str = None) -> dict:
    """
    Upload all marketing content as a single pack to Google Drive.
    
    Args:
        marketing_content: Dictionary with seo, social_media, email, whatsapp content
        business_name: Name of the business (used in filename)
        folder_id: Optional Google Drive folder ID
        
    Returns:
        dict with success status and details
    """
    # Create a formatted marketing pack document
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
    filename = f"Marketing_Pack_{business_name.replace(' ', '_')}_{timestamp}.txt"
    
    content = f"""
================================================================================
                    MARKETING CONTENT PACK
                    {business_name}
                    Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
================================================================================

{"="*80}
📊 SEO KEYWORDS & TITLES
{"="*80}

{marketing_content.get('seo', 'N/A')}

{"="*80}
📱 SOCIAL MEDIA POSTS
{"="*80}

{marketing_content.get('social_media', 'N/A')}

{"="*80}
📧 EMAIL MARKETING
{"="*80}

{marketing_content.get('email', 'N/A')}

{"="*80}
💬 WHATSAPP MESSAGES
{"="*80}

{marketing_content.get('whatsapp', 'N/A')}

{"="*80}
🎯 STRATEGIC PLAN
{"="*80}

{marketing_content.get('plan', 'No plan generated - standard campaign')}

================================================================================
                    END OF MARKETING PACK
================================================================================
"""
    
    return upload_to_drive(content, filename, folder_id)
