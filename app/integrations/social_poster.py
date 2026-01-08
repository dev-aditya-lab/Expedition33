"""
Social media poster integration.
Note: Instagram and LinkedIn APIs require business accounts and app review.
This module provides a fallback that saves content for manual posting.
"""

import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


def post_to_social_media(platform: str, content: str) -> dict:
    """
    Post to social media platform.
    
    Note: Direct posting to Instagram/LinkedIn requires:
    - Instagram: Facebook Business account + Meta App Review
    - LinkedIn: LinkedIn Developer App approval
    
    This fallback saves content for manual posting.
    
    Args:
        platform: Social media platform (instagram, linkedin)
        content: Post content
        
    Returns:
        dict with status and message
    """
    # Check for Meta/LinkedIn API credentials
    meta_access_token = os.getenv("META_ACCESS_TOKEN")
    instagram_account_id = os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")
    linkedin_access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    
    if platform.lower() == "instagram" and meta_access_token and instagram_account_id:
        # Note: This function needs image_url, use post_to_instagram() directly for full control
        return {
            "success": False,
            "message": "Use post_to_instagram() function directly with image_url parameter"
        }
    
    if platform.lower() == "linkedin" and linkedin_access_token:
        return _post_to_linkedin(content, linkedin_access_token)
    
    # Fallback: Return content for manual posting
    return {
        "success": True,
        "posted": False,
        "message": f"Content ready for manual posting to {platform}. API credentials not configured for direct posting.",
        "content": content
    }


def post_to_instagram(caption: str, image_url: str) -> dict:
    """
    Post an image to Instagram with caption.
    
    This is the main function to call for Instagram posting.
    Requires META_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in .env
    
    Args:
        caption: Post caption with hashtags (from generated social_media content)
        image_url: Public URL of the image to post
        
    Returns:
        dict with success status and message
    """
    access_token = os.getenv("META_ACCESS_TOKEN")
    instagram_account_id = os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")
    
    if not access_token:
        return {
            "success": False,
            "message": "META_ACCESS_TOKEN not configured. Set it in your .env file."
        }
    
    if not instagram_account_id:
        return {
            "success": False,
            "message": "INSTAGRAM_BUSINESS_ACCOUNT_ID not configured. Set it in your .env file."
        }
    
    if not image_url:
        return {
            "success": False,
            "message": "Image URL is required for Instagram posts. Provide a publicly accessible image URL."
        }
    
    return _post_to_instagram(
        caption=caption,
        image_url=image_url,
        access_token=access_token,
        instagram_account_id=instagram_account_id
    )


def _post_to_instagram(caption: str, image_url: str, access_token: str, instagram_account_id: str) -> dict:
    """
    Post to Instagram via Meta Graph API.
    
    Requires:
    - Instagram Business or Creator account
    - Facebook Page connected to Instagram
    - Meta Developer App with instagram_basic and instagram_content_publish permissions
    - Access token with required permissions
    
    The publishing process is two steps:
    1. Create a media container with the image URL
    2. Publish the container
    
    Args:
        caption: Post caption with hashtags
        image_url: Public URL of the image to post
        access_token: Meta access token
        instagram_account_id: Instagram Business Account ID
        
    Returns:
        dict with success status and message
    """
    import requests
    
    graph_url = "https://graph.facebook.com/v21.0"
    
    try:
        # Step 1: Create media container
        container_url = f"{graph_url}/{instagram_account_id}/media"
        container_params = {
            "image_url": image_url,
            "caption": caption,
            "access_token": access_token
        }
        
        container_response = requests.post(container_url, data=container_params, timeout=30)
        container_data = container_response.json()
        
        if "error" in container_data:
            error_msg = container_data["error"].get("message", "Unknown error")
            return {
                "success": False,
                "message": f"Failed to create media container: {error_msg}",
                "details": container_data["error"]
            }
        
        creation_id = container_data.get("id")
        if not creation_id:
            return {
                "success": False,
                "message": "Failed to get creation ID from container response",
                "details": container_data
            }
        
        # Step 2: Publish the container
        publish_url = f"{graph_url}/{instagram_account_id}/media_publish"
        publish_params = {
            "creation_id": creation_id,
            "access_token": access_token
        }
        
        publish_response = requests.post(publish_url, data=publish_params, timeout=30)
        publish_data = publish_response.json()
        
        if "error" in publish_data:
            error_msg = publish_data["error"].get("message", "Unknown error")
            return {
                "success": False,
                "message": f"Failed to publish media: {error_msg}",
                "details": publish_data["error"]
            }
        
        media_id = publish_data.get("id")
        return {
            "success": True,
            "message": f"Successfully posted to Instagram! Media ID: {media_id}",
            "details": {
                "media_id": media_id,
                "instagram_account_id": instagram_account_id
            }
        }
        
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "message": "Request timed out while posting to Instagram"
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "message": f"Network error while posting to Instagram: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Unexpected error posting to Instagram: {str(e)}"
        }


def _post_to_linkedin(content: str, access_token: str) -> dict:
    """
    Post to LinkedIn via LinkedIn API.
    Requires: LinkedIn Developer App with appropriate permissions.
    
    Not implemented - placeholder for future enhancement.
    """
    return {
        "success": False,
        "message": "LinkedIn API posting not yet implemented. Please use upload_to_drive and post manually."
    }


def prepare_social_content_for_upload(social_media_content: str, business_name: str) -> dict:
    """
    Prepare social media content in a copy-paste friendly format.
    
    Args:
        social_media_content: Generated social media content
        business_name: Name of the business
        
    Returns:
        dict with formatted content ready for upload
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    formatted_content = f"""
================================================================================
SOCIAL MEDIA CONTENT - READY TO POST
Generated for: {business_name}
Date: {timestamp}
================================================================================

INSTRUCTIONS:
1. Copy the content below for each platform
2. Go to the respective platform
3. Paste and post!

{"-"*80}

{social_media_content}

{"-"*80}

TIP: Use scheduling tools like Buffer, Hootsuite, or Later for automated posting.
================================================================================
"""
    
    return {
        "filename": f"Social_Media_{business_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.txt",
        "content": formatted_content
    }
