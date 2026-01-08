"""
Pydantic schemas for API request and response models.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class MarketingRequest(BaseModel):
    """Request model for marketing content generation."""
    
    business_name: str = Field(
        ...,
        description="Name of the business or product",
        examples=["AI Exam Prep App"]
    )
    product_description: str = Field(
        ...,
        description="Description of the product or service",
        examples=["AI-powered exam preparation for engineering students"]
    )
    target_audience: str = Field(
        ...,
        description="Target audience for the marketing campaign",
        examples=["College students in India"]
    )
    goal: Optional[str] = Field(
        None,
        description="Optional: Marketing goal to achieve. When provided, the AI will first create a strategic plan.",
        examples=["Increase app downloads by 50% in 3 months"]
    )
    
    # Autonomous execution options
    execute_actions: bool = Field(
        False,
        description="If true, the agent will automatically send emails, WhatsApp messages, and upload to Drive"
    )
    recipient_email: Optional[str] = Field(
        None,
        description="Email address to send the marketing email to",
        examples=["marketing@example.com"]
    )
    recipient_whatsapp: Optional[str] = Field(
        None,
        description="WhatsApp number with country code to send message to",
        examples=["+919876543210"]
    )
    drive_folder_id: Optional[str] = Field(
        None,
        description="Google Drive folder ID to upload marketing pack to"
    )
    instagram_image_url: Optional[str] = Field(
        None,
        description="Public URL of image to post to Instagram (required for Instagram posting)",
        examples=["https://example.com/marketing-image.jpg"]
    )
    generate_instagram_image: bool = Field(
        False,
        description="If true, auto-generate a marketing image using DALL-E and upload to Cloudinary"
    )


class ActionResult(BaseModel):
    """Result of an autonomous action."""
    success: bool
    message: str
    details: Optional[Dict[str, Any]] = None


class MarketingResponse(BaseModel):
    """Response model containing all generated marketing content."""
    
    plan: Optional[str] = Field(
        None,
        description="Strategic plan (only included when goal is provided)"
    )
    seo: str = Field(
        ...,
        description="SEO keywords, long-tail keywords, and title suggestions"
    )
    social_media: str = Field(
        ...,
        description="Social media post with emojis, hashtags, and CTA"
    )
    email: str = Field(
        ...,
        description="Email marketing content with subject line and body"
    )
    whatsapp: str = Field(
        ...,
        description="WhatsApp promotional message with CTA"
    )
    
    # Action results (only populated when execute_actions=True)
    actions_executed: bool = Field(
        False,
        description="Whether autonomous actions were executed"
    )
    email_result: Optional[ActionResult] = Field(
        None,
        description="Result of sending the marketing email"
    )
    whatsapp_result: Optional[ActionResult] = Field(
        None,
        description="Result of sending the WhatsApp message"
    )
    drive_result: Optional[ActionResult] = Field(
        None,
        description="Result of uploading to Google Drive"
    )
    instagram_result: Optional[ActionResult] = Field(
        None,
        description="Result of posting to Instagram"
    )


# Simple request for individual content generation
class SimpleContentRequest(BaseModel):
    """Simple request for generating a single type of content."""
    
    business_name: str = Field(
        ...,
        description="Name of the business or product",
        examples=["AI Exam Prep App"]
    )
    product_description: str = Field(
        ...,
        description="Description of the product or service",
        examples=["AI-powered exam preparation for engineering students"]
    )
    target_audience: str = Field(
        ...,
        description="Target audience for the marketing campaign",
        examples=["College students in India"]
    )


class ContentResponse(BaseModel):
    """Response for individual content generation."""
    content: str = Field(..., description="Generated marketing content")
    content_type: str = Field(..., description="Type of content generated")


class SocialMediaResponse(BaseModel):
    """Response for social media content with optional image."""
    content: str = Field(..., description="Generated social media posts")
    image_url: Optional[str] = Field(None, description="Generated image URL for Instagram")
    content_type: str = Field(default="social_media")


class EmailSendRequest(BaseModel):
    """Request to send an email."""
    business_name: str
    product_description: str
    target_audience: str
    recipient_email: str = Field(..., description="Email address to send to")


class SocialPostRequest(BaseModel):
    """Request to create a social media post."""
    business_name: str
    product_description: str
    target_audience: str
    platform: str = Field(default="instagram", description="Platform: instagram or linkedin")
    generate_image: bool = Field(default=False, description="Auto-generate image for post")
    image_url: Optional[str] = Field(None, description="Custom image URL to use")
    manual_schedule: bool = Field(default=True, description="If True, user schedules manually. If False, auto-schedule at optimal time.")


class WebsiteAnalysisRequest(BaseModel):
    """Request to analyze a website for SEO."""
    website_url: str = Field(..., description="Website URL to analyze", examples=["https://example.com"])


class WebsiteAnalysisResponse(BaseModel):
    """Response from website SEO analysis."""
    website_url: str
    title: Optional[str] = None
    description: Optional[str] = None
    content_summary: Optional[str] = None
    seo_analysis: str = Field(..., description="AI-generated SEO analysis and recommendations")


class BlogPostRequest(BaseModel):
    """Request to generate and optionally publish a blog post."""
    topic: str = Field(..., description="Main topic or title for the blog post")
    target_audience: str = Field(..., description="Who the blog post is for")
    key_points: Optional[str] = Field(None, description="Key points to cover")
    publish_to_medium: bool = Field(default=False, description="If true, publish directly to Medium")
    publish_to_hashnode: bool = Field(default=False, description="If true, publish directly to Hashnode")
    as_draft: bool = Field(default=True, description="If publishing, save as draft (True) or publish immediately (False)")
    tags: Optional[list] = Field(None, description="Tags for the blog post (max 5)")


class BlogPostResponse(BaseModel):
    """Response from blog post generation."""
    title: str = Field(..., description="Generated blog post title")
    content: str = Field(..., description="Full blog post in Markdown format")
    tags: list = Field(default=[], description="Suggested tags")
    medium_result: Optional[Dict[str, Any]] = Field(None, description="Medium publishing result if requested")
    hashnode_result: Optional[Dict[str, Any]] = Field(None, description="Hashnode publishing result if requested")


