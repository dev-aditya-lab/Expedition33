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
    Saves the post to database for history tracking.
    If manual_schedule is False, auto-schedules at optimal time.
    """
    from app.database import save_social_post, auto_schedule_post
    
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
        
        # Determine initial status
        initial_status = "draft" if request.manual_schedule else "scheduled"
        
        # Save to MongoDB
        post_id = None
        scheduled_time = None
        try:
            post_id = await save_social_post(
                business_name=request.business_name,
                product_description=request.product_description,
                target_audience=request.target_audience,
                platform=request.platform,
                content=content,
                image_url=image_url,
                status="draft"  # Save as draft first
            )
            
            # Auto-schedule if user didn't select manual scheduling
            if not request.manual_schedule and post_id:
                scheduled_time = await auto_schedule_post(post_id)
                
        except Exception as e:
            print(f"DB Error: {e}")
            pass  # Don't fail if DB is not configured
        
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


from app.schemas import BlogPostRequest, BlogPostResponse
from app.tools import blog_post_tool


@app.post("/generate/blog", response_model=BlogPostResponse, tags=["Blog Generation"])
async def generate_blog_post(request: BlogPostRequest):
    """
    Generate an SEO-optimized blog post and optionally publish to Medium.
    
    Creates a complete blog post with:
    - Engaging title
    - Structured sections (H2/H3)
    - SEO keyword optimization
    - Call-to-action
    - Suggested tags
    
    If `publish_to_medium` is True, the post will be published directly to your Medium account.
    """
    try:
        # Build topic info for the AI
        topic_info = f"""
Topic: {request.topic}
Target Audience: {request.target_audience}
Key Points: {request.key_points or 'Cover the main aspects of the topic'}
"""
        
        # Generate the blog post
        content = blog_post_tool.invoke(topic_info)
        
        # Extract title from content (first line with #)
        lines = content.split('\n')
        title = request.topic  # Default
        for line in lines:
            if line.startswith('# '):
                title = line.replace('# ', '').strip()
                break
        
        # Extract suggested tags from content or use provided
        tags = request.tags or []
        if not tags:
            # Try to extract from content
            for line in lines:
                if 'tag' in line.lower() and ':' in line:
                    tag_part = line.split(':')[-1]
                    tags = [t.strip().replace('#', '') for t in tag_part.split(',')][:5]
                    break
        
        medium_result = None
        hashnode_result = None
        
        # Publish to Medium if requested
        if request.publish_to_medium:
            from app.integrations.medium_publisher import publish_to_medium
            
            medium_result = publish_to_medium(
                title=title,
                content=content,
                tags=tags,
                publish_status="draft" if request.as_draft else "public",
                content_format="markdown"
            )
        
        # Publish to Hashnode if requested
        if request.publish_to_hashnode:
            from app.integrations.hashnode_publisher import publish_to_hashnode
            
            hashnode_result = publish_to_hashnode(
                title=title,
                content=content,
                tags=tags
            )
        
        return BlogPostResponse(
            title=title,
            content=content,
            tags=tags,
            medium_result=medium_result,
            hashnode_result=hashnode_result
        )
        
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


# ============================================
# Social Posts & Scheduling Endpoints
# ============================================

from app.database import get_social_posts, get_scheduled_posts, update_post_status, update_post_schedule
from datetime import datetime as dt


@app.get("/social/posts", tags=["Social Posts"])
async def list_social_posts(
    limit: int = 50,
    status: Optional[str] = None,
    platform: Optional[str] = None
):
    """
    Get all social posts with optional filtering by status and platform.
    """
    try:
        posts = await get_social_posts(limit=limit, status=status, platform=platform)
        return {"posts": posts, "count": len(posts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/social/scheduled", tags=["Social Posts"])
async def list_scheduled_posts():
    """
    Get all posts that are scheduled for future posting.
    """
    try:
        posts = await get_scheduled_posts()
        return {"scheduled_posts": posts, "count": len(posts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.post("/social/posts/{post_id}/schedule", tags=["Social Posts"])
async def schedule_post(post_id: str, scheduled_for: str):
    """
    Schedule a post for a specific date/time.
    
    Args:
        scheduled_for: ISO format datetime string (e.g., "2024-01-15T10:00:00")
    """
    try:
        scheduled_datetime = dt.fromisoformat(scheduled_for.replace('Z', '+00:00'))
        success = await update_post_schedule(post_id, scheduled_datetime)
        
        if not success:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {"success": True, "post_id": post_id, "scheduled_for": scheduled_for}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use ISO format.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/social/posts/{post_id}/status", tags=["Social Posts"])
async def change_post_status(post_id: str, new_status: str):
    """
    Update a post's status (draft, scheduled, published).
    """
    if new_status not in ["draft", "scheduled", "published"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use: draft, scheduled, or published")
    
    try:
        success = await update_post_status(post_id, new_status)
        
        if not success:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {"success": True, "post_id": post_id, "status": new_status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ============================================
# Lead Management Endpoints
# ============================================

from app.database import save_lead, save_leads_bulk, get_leads
from app.schemas import LeadCreate, LeadResponse, LeadsImportRequest, LeadsImportResponse


@app.post("/leads/import", response_model=LeadsImportResponse, tags=["Leads"])
async def import_leads(request: LeadsImportRequest):
    """
    Import multiple leads from Excel/CSV data.
    
    Accepts a list of leads and saves them to MongoDB.
    Returns the count of imported leads and their details.
    """
    try:
        if not request.leads:
            raise HTTPException(status_code=400, detail="No leads provided")
        
        # Convert Pydantic models to dicts
        leads_data = [lead.model_dump() for lead in request.leads]
        
        # Bulk insert
        inserted_ids = await save_leads_bulk(leads_data)
        
        # Fetch the inserted leads to return
        all_leads = await get_leads(limit=len(inserted_ids))
        
        return LeadsImportResponse(
            success=True,
            message=f"Successfully imported {len(inserted_ids)} leads",
            imported_count=len(inserted_ids),
            leads=all_leads[:len(inserted_ids)]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error importing leads: {str(e)}")


@app.get("/leads", tags=["Leads"])
async def list_leads(
    limit: int = 100,
    status: Optional[str] = None,
    source: Optional[str] = None
):
    """
    Get all leads from the database.
    
    Args:
        limit: Maximum number of leads to return (default 100)
        status: Filter by status (Hot, Warm, Cold, Qualified, Contacted)
        source: Filter by source (Website, LinkedIn, Referral, etc.)
    """
    try:
        leads = await get_leads(limit=limit, status=status, source=source)
        return {"leads": leads, "count": len(leads)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching leads: {str(e)}")


@app.post("/leads", response_model=LeadResponse, tags=["Leads"])
async def create_lead(lead: LeadCreate):
    """
    Create a single new lead.
    """
    try:
        lead_data = lead.model_dump()
        lead_id = await save_lead(lead_data)
        
        return LeadResponse(
            id=lead_id,
            **lead_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating lead: {str(e)}")


# ============================================
# Score-Based Email Campaign Endpoints
# ============================================

from app.database import get_leads_for_email_campaign, save_email_history, get_email_history, get_email_frequency_hours
from app.schemas import EmailCampaignRequest, EmailCampaignResult, EmailCampaignResponse
from app.integrations.email_sender import send_email


@app.post("/leads/email-campaign", response_model=EmailCampaignResponse, tags=["Email Campaign"])
async def run_email_campaign(request: EmailCampaignRequest):
    """
    Run a score-based email campaign.
    
    Sends emails to leads based on their score:
    - Score 90-100 (Hot): Every 2 hours
    - Score 70-89 (Warm): Every 6 hours
    - Score 50-69 (Medium): Every 12 hours
    - Score 30-49 (Cool): Every 24 hours
    - Score 0-29 (Cold): Every 48 hours
    
    Higher score leads get emailed more frequently and are processed first.
    
    Args:
        subject_template: Email subject with placeholders {name}, {company}, {score}
        body_template: Email body with placeholders
        max_emails: Maximum emails to send in this batch
        dry_run: If True, preview only without sending
    """
    try:
        # Get eligible leads sorted by score
        eligible_leads = await get_leads_for_email_campaign()
        
        if not eligible_leads:
            return EmailCampaignResponse(
                success=True,
                message="No leads are eligible for email at this time",
                total_eligible=0,
                emails_sent=0,
                emails_failed=0,
                dry_run=request.dry_run,
                results=[]
            )
        
        # Limit to max_emails
        leads_to_email = eligible_leads[:request.max_emails]
        
        results = []
        emails_sent = 0
        emails_failed = 0
        
        for lead in leads_to_email:
            lead_id = lead.get("id")
            lead_email = lead.get("email")
            lead_name = lead.get("name", "Valued Customer")
            lead_company = lead.get("company", "")
            lead_score = lead.get("score", 50)
            priority = lead.get("priority", "medium")
            
            # Prepare email content using templates
            subject = request.subject_template.format(
                name=lead_name,
                company=lead_company,
                score=lead_score
            )
            body = request.body_template.format(
                name=lead_name,
                email=lead_email,
                company=lead_company,
                score=lead_score
            )
            
            if request.dry_run:
                # Preview mode - don't actually send
                results.append(EmailCampaignResult(
                    lead_id=lead_id,
                    lead_email=lead_email,
                    lead_name=lead_name,
                    score=lead_score,
                    priority=priority,
                    success=True,
                    message=f"[DRY RUN] Would send email with subject: {subject}"
                ))
                emails_sent += 1
            else:
                # Actually send the email
                result = send_email(
                    to=lead_email,
                    subject=subject,
                    body=body
                )
                
                # Save to email history
                await save_email_history(
                    lead_id=lead_id,
                    lead_email=lead_email,
                    subject=subject,
                    success=result["success"],
                    message=result["message"]
                )
                
                if result["success"]:
                    emails_sent += 1
                else:
                    emails_failed += 1
                
                results.append(EmailCampaignResult(
                    lead_id=lead_id,
                    lead_email=lead_email,
                    lead_name=lead_name,
                    score=lead_score,
                    priority=priority,
                    success=result["success"],
                    message=result["message"]
                ))
        
        return EmailCampaignResponse(
            success=True,
            message=f"{'Dry run completed' if request.dry_run else 'Email campaign completed'}. {emails_sent} emails {'would be sent' if request.dry_run else 'sent'}, {emails_failed} failed.",
            total_eligible=len(eligible_leads),
            emails_sent=emails_sent,
            emails_failed=emails_failed,
            dry_run=request.dry_run,
            results=results
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running email campaign: {str(e)}")


@app.get("/leads/email-eligible", tags=["Email Campaign"])
async def get_eligible_leads():
    """
    Get all leads eligible for email based on score and last email time.
    
    Shows which leads would receive emails if a campaign is run now.
    """
    try:
        leads = await get_leads_for_email_campaign()
        return {
            "eligible_leads": leads,
            "count": len(leads),
            "frequency_tiers": {
                "hot (90-100)": "Every 2 hours",
                "warm (70-89)": "Every 6 hours",
                "medium (50-69)": "Every 12 hours",
                "cool (30-49)": "Every 24 hours",
                "cold (0-29)": "Every 48 hours"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/leads/email-history", tags=["Email Campaign"])
async def get_email_send_history(lead_id: Optional[str] = None, limit: int = 50):
    """
    Get email send history, optionally filtered by lead ID.
    """
    try:
        history = await get_email_history(lead_id=lead_id, limit=limit)
        return {"history": history, "count": len(history)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/leads/ai-email-campaign", tags=["Email Campaign"])
async def run_ai_personalized_email_campaign(
    max_emails: int = 10,
    dry_run: bool = True,
    business_context: str = "AI Marketing Automation Platform - helping businesses grow with intelligent marketing"
):
    """
    Run an AI-powered personalized email campaign.
    
    Fetches leads from the database and uses AI to generate a unique,
    personalized email for each lead based on their name, company, and score.
    
    Args:
        max_emails: Maximum number of emails to send
        dry_run: If True, preview emails without sending
        business_context: Context about your business for AI personalization
    """
    from app.config import get_llm
    
    try:
        # Get eligible leads
        eligible_leads = await get_leads_for_email_campaign()
        
        if not eligible_leads:
            return {
                "success": True,
                "message": "No leads eligible for email at this time",
                "total_eligible": 0,
                "emails_processed": 0,
                "results": []
            }
        
        leads_to_email = eligible_leads[:max_emails]
        llm = get_llm()
        
        results = []
        emails_sent = 0
        emails_failed = 0
        
        for lead in leads_to_email:
            lead_id = lead.get("id")
            lead_email = lead.get("email")
            lead_name = lead.get("name", "Valued Customer")
            lead_company = lead.get("company", "")
            lead_score = lead.get("score", 50)
            priority = lead.get("priority", "medium")
            
            # Generate personalized email using AI
            prompt = f"""Generate a personalized marketing email for this lead:

Lead Name: {lead_name}
Company: {lead_company}
Lead Score: {lead_score}/100 ({"hot lead - very interested" if lead_score >= 80 else "warm lead" if lead_score >= 50 else "needs nurturing"})

Business Context: {business_context}

Requirements:
1. Create a compelling subject line (under 50 characters)
2. Write a personalized email body (150-200 words)
3. Include a clear call-to-action
4. Reference their company name naturally
5. Be professional but friendly

Format your response exactly as:
SUBJECT: [your subject line]
---
[email body]"""

            try:
                response = llm.invoke(prompt)
                email_content = response.content
                
                # Parse subject and body
                if "SUBJECT:" in email_content and "---" in email_content:
                    parts = email_content.split("---", 1)
                    subject = parts[0].replace("SUBJECT:", "").strip()
                    body = parts[1].strip()
                else:
                    subject = f"Exclusive Opportunity for {lead_company}"
                    body = email_content
                
                if dry_run:
                    results.append({
                        "lead_id": lead_id,
                        "lead_email": lead_email,
                        "lead_name": lead_name,
                        "company": lead_company,
                        "score": lead_score,
                        "priority": priority,
                        "subject": subject,
                        "body_preview": body[:300] + "..." if len(body) > 300 else body,
                        "success": True,
                        "message": "[DRY RUN] Email generated but not sent"
                    })
                    emails_sent += 1
                else:
                    # Actually send the email
                    result = send_email(
                        to=lead_email,
                        subject=subject,
                        body=body
                    )
                    
                    # Save to history
                    await save_email_history(
                        lead_id=lead_id,
                        lead_email=lead_email,
                        subject=subject,
                        success=result["success"],
                        message=result["message"]
                    )
                    
                    if result["success"]:
                        emails_sent += 1
                    else:
                        emails_failed += 1
                    
                    results.append({
                        "lead_id": lead_id,
                        "lead_email": lead_email,
                        "lead_name": lead_name,
                        "company": lead_company,
                        "score": lead_score,
                        "priority": priority,
                        "subject": subject,
                        "success": result["success"],
                        "message": result["message"]
                    })
                    
            except Exception as e:
                emails_failed += 1
                results.append({
                    "lead_id": lead_id,
                    "lead_email": lead_email,
                    "lead_name": lead_name,
                    "company": lead_company,
                    "score": lead_score,
                    "priority": priority,
                    "success": False,
                    "message": f"Failed to generate email: {str(e)}"
                })
        
        return {
            "success": True,
            "message": f"{'Dry run completed' if dry_run else 'Campaign completed'}. {emails_sent} emails {'generated' if dry_run else 'sent'}, {emails_failed} failed.",
            "total_eligible": len(eligible_leads),
            "emails_processed": len(results),
            "emails_sent": emails_sent,
            "emails_failed": emails_failed,
            "dry_run": dry_run,
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ============================================
# Dashboard Stats Endpoint
# ============================================

@app.get("/dashboard/stats", tags=["Dashboard"])
async def get_dashboard_stats():
    """
    Get real-time dashboard statistics from the database.
    
    Returns lead counts, email stats, and pipeline value.
    """
    from app.database import get_database
    
    try:
        db = get_database()
        
        # Get lead stats
        total_leads = await db.leads.count_documents({})
        hot_leads = await db.leads.count_documents({"status": "Hot"})
        warm_leads = await db.leads.count_documents({"status": "Warm"})
        qualified_leads = await db.leads.count_documents({"status": "Qualified"})
        
        # Get pipeline value
        pipeline = [
            {"$group": {"_id": None, "total_value": {"$sum": "$value"}}}
        ]
        value_result = await db.leads.aggregate(pipeline).to_list(1)
        pipeline_value = value_result[0]["total_value"] if value_result else 0
        
        # Get email stats
        total_emails = await db.email_history.count_documents({})
        successful_emails = await db.email_history.count_documents({"success": True})
        
        # Get leads by status for chart
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        status_counts = {}
        async for doc in db.leads.aggregate(status_pipeline):
            status_counts[doc["_id"]] = doc["count"]
        
        # Get leads by source
        source_pipeline = [
            {"$group": {"_id": "$source", "count": {"$sum": 1}}}
        ]
        source_counts = {}
        async for doc in db.leads.aggregate(source_pipeline):
            source_counts[doc["_id"]] = doc["count"]
        
        # Get recent leads (last 7 days simulation - actually recent by created_at)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        leads_this_week = await db.leads.count_documents({"created_at": {"$gte": week_ago}})
        
        return {
            "totalLeads": total_leads,
            "hotLeads": hot_leads,
            "warmLeads": warm_leads,
            "qualifiedLeads": qualified_leads,
            "leadsThisWeek": leads_this_week,
            "pipelineValue": pipeline_value,
            "emailsSent": total_emails,
            "emailsSuccessful": successful_emails,
            "emailOpenRate": 68.4,  # Placeholder - would need tracking
            "socialReach": 45200,  # Placeholder - would need integration
            "socialEngagement": 8.7,
            "byStatus": status_counts,
            "bySource": source_counts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/dashboard/activities", tags=["Dashboard"])
async def get_recent_activities():
    """
    Get recent CRM activities based on email history and lead updates.
    """
    try:
        activities = []
        
        # Get recent email sends
        email_history = await get_email_history(limit=10)
        for email in email_history:
            activities.append({
                "id": email.get("id"),
                "contact": email.get("lead_email", "Unknown"),
                "company": "",
                "action": "Email Sent" if email.get("success") else "Email Failed",
                "description": email.get("subject", "Marketing email"),
                "timestamp": email.get("sent_at", ""),
                "type": "email"
            })
        
        # Get recent leads
        leads = await get_leads(limit=5)
        for lead in leads:
            activities.append({
                "id": lead.get("id"),
                "contact": lead.get("name", "Unknown"),
                "company": lead.get("company", ""),
                "action": "Lead Added",
                "description": f"Score: {lead.get('score', 0)} - {lead.get('source', 'Unknown')}",
                "timestamp": lead.get("created_at", ""),
                "type": "status"
            })
        
        # Sort by timestamp (most recent first)
        activities.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return {"activities": activities[:10]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


