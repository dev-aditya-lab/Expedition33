"""
FastAPI entry point for the AI Marketing Automation Agent.
Provides REST API endpoint for generating marketing content.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import MarketingRequest, MarketingResponse
from app.agent import get_marketing_agent

# Initialize FastAPI app
app = FastAPI(
    title="AI Marketing Automation Agent",
    description="Generate comprehensive marketing content (SEO, Social Media, Email, WhatsApp) from a single prompt using AI.",
    version="1.0.0",
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
    """
    try:
        # Get the marketing agent
        agent = get_marketing_agent()
        
        # Check if goal is provided
        if request.goal:
            # Use goal-based campaign generation
            business_context = f"{request.business_name}: {request.product_description} for {request.target_audience}"
            result = agent.generate_goal_based_campaign(
                goal=request.goal,
                business_context=business_context
            )
            
            return MarketingResponse(
                plan=result["plan"],
                seo=result["seo"],
                social_media=result["social_media"],
                email=result["email"],
                whatsapp=result["whatsapp"]
            )
        else:
            # Use standard campaign generation
            result = agent.generate_marketing_campaign(
                business_name=request.business_name,
                product_description=request.product_description,
                target_audience=request.target_audience
            )
            
            return MarketingResponse(
                plan=None,
                seo=result["seo"],
                social_media=result["social_media"],
                email=result["email"],
                whatsapp=result["whatsapp"]
            )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating marketing content: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
