"""
Pydantic schemas for API request and response models.
"""

from pydantic import BaseModel, Field
from typing import Optional


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
