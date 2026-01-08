"""
FastAPI entry point for the AI Marketing Automation Agent.
Provides REST API endpoint for generating marketing content.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    MarketingRequest, MarketingResponse, ActionResult,
    SimpleContentRequest, ContentResponse, SocialMediaResponse,
    EmailSendRequest, SocialPostRequest
)
from app.agent import get_marketing_agent
from app.tools import seo_keyword_tool, social_media_tool, email_marketing_tool, whatsapp_marketing_tool


# Initialize FastAPI app
app = FastAPI(
    title="AI Marketing Automation Agent",
    description="Generate comprehensive marketing content (SEO, Social Media, Email, WhatsApp) from a single prompt using AI. Optionally execute autonomous actions to send emails, WhatsApp messages, and upload to Google Drive.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "running",
        "message": "AI Marketing Automation Agent is ready!",
        "version": "2.0.0",
        "features": ["content_generation", "email_sending", "whatsapp_messaging", "drive_upload"],
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}


@app.post("/generate-marketing", response_model=MarketingResponse)
async def generate_marketing(request: MarketingRequest):
    """
    Generate comprehensive marketing content for a business.
    
    This endpoint uses an AI agent with multiple specialized tools to generate:
    - SEO keywords and title suggestions
    - Social media posts (Instagram/LinkedIn)
    - Email marketing content
    - WhatsApp promotional messages
    
    **Optional Goal:** If you provide a `goal`, the agent will first create a 
    strategic plan to achieve that goal, then generate all marketing content 
    aligned with the plan.
    
    **Autonomous Actions:** If you set `execute_actions=true`, the agent will:
    - Send the email to `recipient_email` (requires GMAIL credentials)
    - Send WhatsApp to `recipient_whatsapp` (requires Twilio credentials)
    - Upload all content to Google Drive (requires service account)
    """
    try:
        # Get the marketing agent
        agent = get_marketing_agent()
        
        # Generate content based on whether goal is provided
        if request.goal:
            # Use goal-based campaign generation
            business_context = f"{request.business_name}: {request.product_description} for {request.target_audience}"
            result = agent.generate_goal_based_campaign(
                goal=request.goal,
                business_context=business_context
            )
        else:
            # Use standard campaign generation
            result = agent.generate_marketing_campaign(
                business_name=request.business_name,
                product_description=request.product_description,
                target_audience=request.target_audience
            )
            result["plan"] = None
        
        # Execute autonomous actions if requested
        action_results = None
        if request.execute_actions:
            action_results = agent.execute_autonomous_actions(
                marketing_content=result,
                business_name=request.business_name,
                product_description=request.product_description,
                recipient_email=request.recipient_email,
                recipient_whatsapp=request.recipient_whatsapp,
                drive_folder_id=request.drive_folder_id,
                instagram_image_url=request.instagram_image_url,
                generate_instagram_image=request.generate_instagram_image
            )
        
        # Build response
        response = MarketingResponse(
            plan=result.get("plan"),
            seo=result["seo"],
            social_media=result["social_media"],
            email=result["email"],
            whatsapp=result["whatsapp"],
            actions_executed=request.execute_actions
        )
        
        # Add action results if actions were executed
        if action_results:
            if action_results.get("email_result"):
                response.email_result = ActionResult(**action_results["email_result"])
            if action_results.get("whatsapp_result"):
                response.whatsapp_result = ActionResult(**action_results["whatsapp_result"])
            if action_results.get("drive_result"):
                response.drive_result = ActionResult(**action_results["drive_result"])
            if action_results.get("instagram_result"):
                response.instagram_result = ActionResult(**action_results["instagram_result"])
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating marketing content: {str(e)}"
        )


# ============================================
# Individual Content Generation Endpoints
# ============================================


@app.post("/generate/seo", response_model=ContentResponse, tags=["Individual Generation"])
async def generate_seo(request: SimpleContentRequest):
    """
    Generate SEO keywords and title suggestions only.
    
    Returns:
    - Primary keywords
    - Long-tail keywords
    - SEO title suggestions
    """
    from app.database import save_generation
    
    try:
        business_info = f"{request.business_name}: {request.product_description} for {request.target_audience}"
        content = seo_keyword_tool.invoke(business_info)
        
        # Save to MongoDB
        try:
            await save_generation(
                generation_type="seo",
                business_name=request.business_name,
                product_description=request.product_description,
                target_audience=request.target_audience,
                content={"seo": content}
            )
        except Exception:
            pass  # Don't fail if DB is not configured
        
        return ContentResponse(content=content, content_type="seo")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from app.schemas import WebsiteAnalysisRequest, WebsiteAnalysisResponse
import requests
from bs4 import BeautifulSoup


@app.post("/analyze/website", response_model=WebsiteAnalysisResponse, tags=["SEO Analysis"])
async def analyze_website(request: WebsiteAnalysisRequest):
    """
    Analyze a website and generate SEO recommendations.
    
    Fetches the website content, extracts key information, and uses AI
    to provide SEO keyword suggestions and optimization tips.
    """
    from app.config import get_llm
    
    try:
        # Fetch the website
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(request.website_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract metadata
        title = soup.title.string if soup.title else None
        
        # Get meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc.get('content') if meta_desc else None
        
        # Get main content (paragraphs and headings)
        content_parts = []
        for tag in soup.find_all(['h1', 'h2', 'h3', 'p']):
            text = tag.get_text(strip=True)
            if text and len(text) > 20:
                content_parts.append(text)
        
        content_summary = ' '.join(content_parts[:15])[:2000]  # Limit to 2000 chars
        
        # Generate SEO analysis with AI
        llm = get_llm()
        
        prompt = f"""Analyze this website for SEO and provide comprehensive keyword recommendations.

Website URL: {request.website_url}
Title: {title or 'Not found'}
Meta Description: {description or 'Not found'}
Content Summary: {content_summary[:1000] or 'Could not extract content'}

Based on this website, generate:

1. **Primary Keywords** (5-7 high-volume keywords this site should target)
2. **Long-tail Keywords** (5-7 specific phrases with lower competition)
3. **SEO Title Suggestions** (3 optimized title options under 60 characters)
4. **Meta Description Suggestions** (2 compelling descriptions under 160 characters)
5. **Content Recommendations** (3-5 specific improvements for better SEO)

Be specific to the actual content and purpose of this website."""

        ai_response = llm.invoke(prompt)
        
        # Save to MongoDB
        try:
            from app.database import save_website_analysis
            await save_website_analysis(
                website_url=request.website_url,
                title=title,
                description=description,
                content_summary=content_summary[:500] if content_summary else None,
                seo_analysis=ai_response.content
            )
        except Exception:
            pass  # Don't fail if DB is not configured
        
        return WebsiteAnalysisResponse(
            website_url=request.website_url,
            title=title,
            description=description,
            content_summary=content_summary[:500] if content_summary else None,
            seo_analysis=ai_response.content
        )
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch website: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing website: {str(e)}")


@app.post("/generate/social", response_model=SocialMediaResponse, tags=["Individual Generation"])
async def generate_social(request: SocialPostRequest):
    """
    Generate social media content for Instagram and LinkedIn.
    
    Optionally generates an AI image using Pollinations.ai (FREE).
    """
    try:
        business_info = f"{request.business_name}: {request.product_description} for {request.target_audience}"
        content = social_media_tool.invoke(business_info)
        
        image_url = request.image_url
        
        # Auto-generate image if requested
        if request.generate_image and not image_url:
            from app.integrations.cloudinary_uploader import generate_and_upload_image
            gen_result = generate_and_upload_image(
                business_name=request.business_name,
                product_description=request.product_description
            )
            if gen_result["success"]:
                image_url = gen_result["public_url"]
        
        return SocialMediaResponse(content=content, image_url=image_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/email", response_model=ContentResponse, tags=["Individual Generation"])
async def generate_email(request: SimpleContentRequest):
    """
    Generate email marketing content only.
    
    Returns:
    - Subject line options
    - Email body with CTA
    """
    try:
        business_info = f"{request.business_name}: {request.product_description} for {request.target_audience}"
        content = email_marketing_tool.invoke(business_info)
        return ContentResponse(content=content, content_type="email")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/whatsapp", response_model=ContentResponse, tags=["Individual Generation"])
async def generate_whatsapp(request: SimpleContentRequest):
    """
    Generate WhatsApp promotional messages only.
    
    Returns:
    - Primary message
    - Follow-up message
    - Offer message
    """
    try:
        business_info = f"{request.business_name}: {request.product_description} for {request.target_audience}"
        content = whatsapp_marketing_tool.invoke(business_info)
        return ContentResponse(content=content, content_type="whatsapp")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/send/email", response_model=ActionResult, tags=["Actions"])
async def send_email_action(request: EmailSendRequest):
    """
    Generate and send an email directly.
    
    Generates email content and sends it to the recipient.
    """
    try:
        from app.integrations.email_sender import send_email
        
        # Generate email content
        business_info = f"{request.business_name}: {request.product_description} for {request.target_audience}"
        email_content = email_marketing_tool.invoke(business_info)
        
        # Send the email
        result = send_email(
            to_email=request.recipient_email,
            subject=f"Marketing Update from {request.business_name}",
            body=email_content
        )
        
        return ActionResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# History Endpoints (MongoDB)
# ============================================

from app.database import (
    save_generation, save_website_analysis,
    get_generations, get_website_analyses,
    get_generation_by_id, get_stats
)
from typing import Optional


@app.get("/history/generations", tags=["History"])
async def list_generations(
    limit: int = 50,
    type: Optional[str] = None
):
    """
    Get generation history from MongoDB.
    
    Args:
        limit: Maximum number of records (default 50)
        type: Filter by type (seo, social, email, whatsapp, full)
    """
    try:
        generations = await get_generations(limit=limit, generation_type=type)
        return {"generations": generations, "count": len(generations)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/history/analyses", tags=["History"])
async def list_website_analyses(limit: int = 50):
    """
    Get website analysis history from MongoDB.
    """
    try:
        analyses = await get_website_analyses(limit=limit)
        return {"analyses": analyses, "count": len(analyses)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/history/generations/{generation_id}", tags=["History"])
async def get_single_generation(generation_id: str):
    """
    Get a specific generation by ID.
    """
    try:
        generation = await get_generation_by_id(generation_id)
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        return generation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/history/stats", tags=["History"])
async def get_history_stats():
    """
    Get statistics about stored generations.
    """
    try:
        stats = await get_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
