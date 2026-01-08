"""
Cloudinary uploader for hosting images publicly.
Also provides direct URL option for Pollinations.ai generated images.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()


def upload_to_cloudinary(image_url: str) -> dict:
    """
    Upload an image to Cloudinary for public hosting.
    
    Uses unsigned upload which is simpler to configure.
    
    Args:
        image_url: URL of image to upload (Cloudinary will fetch it)
        
    Returns:
        dict with success status, public URL, and message
    """
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    upload_preset = os.getenv("CLOUDINARY_UPLOAD_PRESET")
    
    if not cloud_name or not upload_preset:
        # If Cloudinary not configured, return the original URL
        # This works for Pollinations.ai since their URLs are already public
        return {
            "success": True,
            "message": "Using direct image URL (Cloudinary not configured)",
            "public_url": image_url
        }
    
    try:
        upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
        
        data = {
            "file": image_url,
            "upload_preset": upload_preset
        }
        
        response = requests.post(upload_url, data=data, timeout=60)
        result = response.json()
        
        if "secure_url" in result:
            return {
                "success": True,
                "message": "Image uploaded to Cloudinary successfully",
                "public_url": result["secure_url"],
                "public_id": result.get("public_id")
            }
        else:
            error_msg = result.get("error", {}).get("message", "Unknown error")
            # Fallback to direct URL if Cloudinary fails
            return {
                "success": True,
                "message": f"Cloudinary failed ({error_msg}), using direct URL",
                "public_url": image_url
            }
            
    except Exception as e:
        # Fallback to direct URL
        return {
            "success": True,
            "message": f"Cloudinary error, using direct URL: {str(e)}",
            "public_url": image_url
        }


def generate_and_upload_image(
    business_name: str,
    product_description: str
) -> dict:
    """
    Generate an image with Pollinations.ai and optionally upload to Cloudinary.
    
    If Cloudinary is not configured, uses the Pollinations.ai URL directly.
    
    Args:
        business_name: Name of the business
        product_description: Description of the product/service
        
    Returns:
        dict with success status, public URL, and message
    """
    from app.integrations.image_generator import generate_marketing_image
    
    # Step 1: Generate image URL with Pollinations.ai (FREE)
    print("   🎨 Generating image with Pollinations.ai (FREE)...")
    gen_result = generate_marketing_image(business_name, product_description)
    
    if not gen_result["success"]:
        return {
            "success": False,
            "message": f"Image generation failed: {gen_result['message']}",
            "public_url": None
        }
    
    pollinations_url = gen_result["image_url"]
    
    # Step 2: Optionally upload to Cloudinary (or use direct URL)
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    if cloud_name:
        print("   ☁️ Uploading to Cloudinary...")
        upload_result = upload_to_cloudinary(image_url=pollinations_url)
        return {
            "success": True,
            "message": upload_result["message"],
            "public_url": upload_result["public_url"],
            "pollinations_url": pollinations_url
        }
    else:
        # Use Pollinations.ai URL directly (it's already public)
        print("   ✅ Using Pollinations.ai URL directly (no Cloudinary configured)")
        return {
            "success": True,
            "message": "Image generated with Pollinations.ai (FREE)",
            "public_url": pollinations_url
        }
