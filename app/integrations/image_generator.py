"""
Image generator using Pollinations.ai - FREE, no API key required.
Generates marketing images based on business context.
"""

import urllib.parse


def generate_marketing_image(
    business_name: str,
    product_description: str,
    style: str = "modern, professional, vibrant"
) -> dict:
    """
    Generate a marketing image using Pollinations.ai (FREE).
    
    Pollinations.ai provides free AI image generation without needing an API key.
    The image URL is directly usable as a public URL.
    
    Args:
        business_name: Name of the business
        product_description: Description of the product/service
        style: Visual style for the image
        
    Returns:
        dict with success status, image URL, and message
    """
    try:
        # Create a marketing-focused prompt
        # prompt = f"""stunning marketing image for {business_name}, {product_description}, {style}, clean professional design, vibrant colors, modern aesthetic, social media ready, no text"""
        prompt = f"""image of a model wearing headphones"""
        
        # URL encode the prompt
        encoded_prompt = urllib.parse.quote(prompt)
        
        # Pollinations.ai URL - returns an image directly
        # Adding size parameters for Instagram-friendly dimensions
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
        
        return {
            "success": True,
            "message": "Image URL generated successfully (Pollinations.ai)",
            "image_url": image_url,
            "prompt_used": prompt
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to generate image URL: {str(e)}",
            "image_url": None
        }
