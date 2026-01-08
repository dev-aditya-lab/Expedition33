"""
MongoDB Database Module for AI Marketing Agent.
Stores all generated content and analyses for history tracking.
Uses Motor (async MongoDB driver) for non-blocking operations.
"""

import os
from datetime import datetime
from typing import Optional, List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()


# MongoDB Client (initialized on first use)
_client: Optional[AsyncIOMotorClient] = None
_db = None


def get_database():
    """Get the MongoDB database instance."""
    global _client, _db
    
    if _db is None:
        mongodb_uri =  "mongodb://localhost:27017"
        database_name = "marketing_agent"
        # mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        # database_name = os.getenv("MONGODB_DATABASE", "marketing_agent")
        
        # Log which database we're connecting to (masked URI for security)
        uri_display = mongodb_uri[:30] + "..." if len(mongodb_uri) > 30 else mongodb_uri
        print(f"[MongoDB] Connecting to: {uri_display} / database: {database_name}")
        
        _client = AsyncIOMotorClient(mongodb_uri)
        _db = _client[database_name]
        
    return _db


async def save_generation(
    generation_type: str,
    business_name: str,
    product_description: str,
    target_audience: str,
    content: Dict[str, Any],
    image_url: Optional[str] = None,
    goal: Optional[str] = None
) -> str:
    """
    Save a content generation to the database.
    
    Returns the inserted document ID as a string.
    """
    db = get_database()
    
    document = {
        "type": generation_type,  # "seo", "social", "email", "whatsapp", "full"
        "business_name": business_name,
        "product_description": product_description,
        "target_audience": target_audience,
        "goal": goal,
        "content": content,
        "image_url": image_url,
        "created_at": datetime.utcnow()
    }
    
    result = await db.generations.insert_one(document)
    return str(result.inserted_id)


async def save_website_analysis(
    website_url: str,
    title: Optional[str],
    description: Optional[str],
    content_summary: Optional[str],
    seo_analysis: str
) -> str:
    """
    Save a website SEO analysis to the database.
    
    Returns the inserted document ID as a string.
    """
    db = get_database()
    
    document = {
        "website_url": website_url,
        "title": title,
        "description": description,
        "content_summary": content_summary,
        "seo_analysis": seo_analysis,
        "created_at": datetime.utcnow()
    }
    
    result = await db.website_analyses.insert_one(document)
    return str(result.inserted_id)


async def get_generations(
    limit: int = 50,
    generation_type: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieve generation history.
    
    Args:
        limit: Maximum number of records to return
        generation_type: Filter by type (optional)
    
    Returns:
        List of generation documents
    """
    db = get_database()
    
    query = {}
    if generation_type:
        query["type"] = generation_type
    
    cursor = db.generations.find(query).sort("created_at", -1).limit(limit)
    
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        results.append(doc)
    
    return results


async def get_website_analyses(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Retrieve website analysis history.
    
    Returns:
        List of website analysis documents
    """
    db = get_database()
    
    cursor = db.website_analyses.find().sort("created_at", -1).limit(limit)
    
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        results.append(doc)
    
    return results


async def get_generation_by_id(generation_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a specific generation by ID.
    
    Returns:
        The generation document or None if not found
    """
    db = get_database()
    
    try:
        doc = await db.generations.find_one({"_id": ObjectId(generation_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
            doc["created_at"] = doc["created_at"].isoformat()
        return doc
    except Exception:
        return None


async def get_stats() -> Dict[str, Any]:
    """
    Get statistics about stored generations.
    
    Returns:
        Stats including counts by type
    """
    db = get_database()
    
    pipeline = [
        {"$group": {"_id": "$type", "count": {"$sum": 1}}},
    ]
    
    type_counts = {}
    async for doc in db.generations.aggregate(pipeline):
        type_counts[doc["_id"]] = doc["count"]
    
    total_generations = await db.generations.count_documents({})
    total_analyses = await db.website_analyses.count_documents({})
    
    return {
        "total_generations": total_generations,
        "total_website_analyses": total_analyses,
        "by_type": type_counts
    }


# ============================================
# Social Posts & Scheduling
# ============================================

async def save_social_post(
    business_name: str,
    product_description: str,
    target_audience: str,
    platform: str,
    content: str,
    image_url: Optional[str] = None,
    scheduled_for: Optional[datetime] = None,
    status: str = "draft"  # draft, scheduled, published
) -> str:
    """
    Save a social media post with optional scheduling.
    
    Args:
        status: "draft" (not scheduled), "scheduled" (has reminder), "published" (posted)
    
    Returns the inserted document ID.
    """
    db = get_database()
    
    document = {
        "business_name": business_name,
        "product_description": product_description,
        "target_audience": target_audience,
        "platform": platform,
        "content": content,
        "image_url": image_url,
        "scheduled_for": scheduled_for,
        "status": status,
        "created_at": datetime.utcnow()
    }
    
    result = await db.social_posts.insert_one(document)
    return str(result.inserted_id)


async def get_social_posts(
    limit: int = 50,
    status: Optional[str] = None,
    platform: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Get social posts with optional filtering.
    """
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    if platform:
        query["platform"] = platform
    
    cursor = db.social_posts.find(query).sort("created_at", -1).limit(limit)
    
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        if doc.get("scheduled_for"):
            doc["scheduled_for"] = doc["scheduled_for"].isoformat()
        results.append(doc)
    
    return results


async def get_scheduled_posts() -> List[Dict[str, Any]]:
    """
    Get all posts that are scheduled (have a scheduled_for date and status is 'scheduled').
    """
    db = get_database()
    
    query = {"status": "scheduled", "scheduled_for": {"$ne": None}}
    cursor = db.social_posts.find(query).sort("scheduled_for", 1)
    
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        if doc.get("scheduled_for"):
            doc["scheduled_for"] = doc["scheduled_for"].isoformat()
        results.append(doc)
    
    return results


async def update_post_status(post_id: str, new_status: str) -> bool:
    """
    Update a post's status (draft, scheduled, published).
    """
    db = get_database()
    
    try:
        result = await db.social_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"status": new_status}}
        )
        return result.modified_count > 0
    except Exception:
        return False


async def update_post_schedule(post_id: str, scheduled_for: datetime) -> bool:
    """
    Update a post's scheduled time.
    """
    db = get_database()
    
    try:
        result = await db.social_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"scheduled_for": scheduled_for, "status": "scheduled"}}
        )
        return result.modified_count > 0
    except Exception:
        return False


# ============================================
# Smart Auto-Scheduling
# ============================================

from datetime import timedelta
import random


async def get_next_available_slot() -> datetime:
    """
    Calculate the next available posting slot.
    
    Logic:
    - First, check if we have enough engagement data (5+ published posts)
    - If yes, use the best performing hour based on historical data
    - If no, use default slots: 7am-10pm with 30-minute intervals
    
    Returns the next optimal datetime for posting.
    """
    db = get_database()
    
    # Get count of published posts with engagement data
    published_count = await db.social_posts.count_documents({
        "status": "published",
        "engagement_score": {"$exists": True}
    })
    
    now = datetime.utcnow()
    
    if published_count >= 5:
        # Use smart scheduling based on engagement data
        return await _get_optimal_time_smart(now)
    else:
        # Use default time slots
        return await _get_next_default_slot(now)


async def _get_next_default_slot(now: datetime) -> datetime:
    """
    Get next available default slot (7am-10pm, 30-min intervals).
    Avoids already scheduled times.
    """
    db = get_database()
    
    # Get all scheduled posts for the next 7 days
    week_ahead = now + timedelta(days=7)
    scheduled = await db.social_posts.find({
        "status": "scheduled",
        "scheduled_for": {"$gte": now, "$lte": week_ahead}
    }).to_list(100)
    
    scheduled_times = set()
    for post in scheduled:
        if post.get("scheduled_for"):
            # Round to 30-min slot
            st = post["scheduled_for"]
            slot = st.replace(minute=(st.minute // 30) * 30, second=0, microsecond=0)
            scheduled_times.add(slot)
    
    # Generate available slots starting from now
    # Hours: 7am to 10pm (7-22), 30-min intervals
    current = now.replace(minute=(now.minute // 30) * 30 + 30, second=0, microsecond=0)
    
    for day_offset in range(7):  # Check next 7 days
        check_date = now + timedelta(days=day_offset)
        
        for hour in range(7, 22):  # 7am to 10pm
            for minute in [0, 30]:
                slot = check_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
                
                # Skip past times
                if slot <= now:
                    continue
                
                # Check if slot is available
                if slot not in scheduled_times:
                    return slot
    
    # Fallback: random time tomorrow
    tomorrow = now + timedelta(days=1)
    return tomorrow.replace(hour=random.randint(9, 18), minute=random.choice([0, 30]), second=0, microsecond=0)


async def _get_optimal_time_smart(now: datetime) -> datetime:
    """
    Get optimal posting time based on historical engagement data.
    Analyzes which hour of day has highest average engagement.
    """
    db = get_database()
    
    # Aggregate engagement by hour of day
    pipeline = [
        {"$match": {"status": "published", "engagement_score": {"$exists": True}}},
        {"$project": {
            "hour": {"$hour": "$scheduled_for"},
            "engagement_score": 1
        }},
        {"$group": {
            "_id": "$hour",
            "avg_engagement": {"$avg": "$engagement_score"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"avg_engagement": -1}}
    ]
    
    results = await db.social_posts.aggregate(pipeline).to_list(24)
    
    if not results:
        return await _get_next_default_slot(now)
    
    # Get the best performing hour
    best_hour = results[0]["_id"] if results else 12
    
    # Find next available slot at that hour
    target = now.replace(hour=best_hour, minute=0, second=0, microsecond=0)
    
    # If time has passed today, schedule for tomorrow
    if target <= now:
        target = target + timedelta(days=1)
    
    # Check if this slot is taken
    db = get_database()
    existing = await db.social_posts.find_one({
        "status": "scheduled",
        "scheduled_for": target
    })
    
    if existing:
        # Try 30 minutes later
        target = target + timedelta(minutes=30)
    
    return target


async def record_engagement(post_id: str, engagement_score: int) -> bool:
    """
    Record engagement score for a published post.
    Used for smart scheduling optimization.
    
    engagement_score: likes + comments + shares (or any metric)
    """
    db = get_database()
    
    try:
        result = await db.social_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"engagement_score": engagement_score}}
        )
        return result.modified_count > 0
    except Exception:
        return False


async def auto_schedule_post(post_id: str) -> Optional[datetime]:
    """
    Automatically schedule a post at the optimal time.
    Also creates a Google Calendar event for the scheduled time.
    Returns the scheduled datetime.
    """
    from app.integrations.google_calendar import create_calendar_event
    
    optimal_time = await get_next_available_slot()
    
    success = await update_post_schedule(post_id, optimal_time)
    
    if success:
        # Get post details for calendar event
        db = get_database()
        try:
            post = await db.social_posts.find_one({"_id": ObjectId(post_id)})
            if post:
                # Create Google Calendar event
                calendar_result = create_calendar_event(
                    title=f"{post.get('platform', 'Social')} Post - {post.get('business_name', 'Marketing')}",
                    description=post.get('content', 'Scheduled social media post'),
                    start_time=optimal_time,
                    platform=post.get('platform', 'Social Media'),
                    image_url=post.get('image_url')
                )
                
                # Store calendar event ID in the post document
                if calendar_result.get("success") and calendar_result.get("event_id"):
                    await db.social_posts.update_one(
                        {"_id": ObjectId(post_id)},
                        {"$set": {
                            "calendar_event_id": calendar_result.get("event_id"),
                            "calendar_event_link": calendar_result.get("event_link")
                        }}
                    )
                    print(f"[Calendar] Event created: {calendar_result.get('event_link')}")
                else:
                    print(f"[Calendar] Skipped: {calendar_result.get('message')}")
        except Exception as e:
            print(f"[Calendar] Error creating event: {e}")
        
        return optimal_time
    return None


# ============================================
# Lead Management
# ============================================

async def save_lead(lead_data: Dict[str, Any]) -> str:
    """
    Save a single lead to the database.
    
    Returns the inserted document ID as a string.
    """
    db = get_database()
    
    document = {
        **lead_data,
        "created_at": datetime.utcnow()
    }
    
    result = await db.leads.insert_one(document)
    return str(result.inserted_id)


async def save_leads_bulk(leads: List[Dict[str, Any]]) -> List[str]:
    """
    Save multiple leads to the database using bulk insert.
    
    Returns list of inserted document IDs.
    """
    db = get_database()
    
    documents = []
    for lead in leads:
        doc = {
            **lead,
            "created_at": datetime.utcnow()
        }
        documents.append(doc)
    
    result = await db.leads.insert_many(documents)
    return [str(id) for id in result.inserted_ids]


async def get_leads(
    limit: int = 100,
    status: Optional[str] = None,
    source: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Retrieve leads from database with optional filtering.
    
    Args:
        limit: Maximum number of leads to return
        status: Filter by lead status
        source: Filter by lead source
    
    Returns:
        List of lead documents
    """
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    if source:
        query["source"] = source
    
    cursor = db.leads.find(query).sort("created_at", -1).limit(limit)
    
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        if doc.get("created_at"):
            doc["created_at"] = doc["created_at"].isoformat()
        results.append(doc)
    
    return results


async def delete_all_leads() -> int:
    """Delete all leads from the database. Returns count of deleted documents."""
    db = get_database()
    result = await db.leads.delete_many({})
    return result.deleted_count


# ============================================
# Score-Based Email Campaign
# ============================================

def get_email_frequency_hours(score: int) -> int:
    """
    Determine email frequency based on lead score.
    Higher scores = more frequent emails.
    
    Score Tiers:
    - 90-100 (Hot): Every 2 hours
    - 70-89 (Warm): Every 6 hours
    - 50-69 (Medium): Every 12 hours
    - 30-49 (Cool): Every 24 hours
    - 0-29 (Cold): Every 48 hours
    """
    if score >= 90:
        return 2  # Hot leads: every 2 hours
    elif score >= 70:
        return 6  # Warm leads: every 6 hours
    elif score >= 50:
        return 12  # Medium leads: every 12 hours
    elif score >= 30:
        return 24  # Cool leads: every 24 hours
    else:
        return 48  # Cold leads: every 48 hours


async def save_email_history(
    lead_id: str,
    lead_email: str,
    subject: str,
    success: bool,
    message: str = None
) -> str:
    """
    Save email send history to track when emails were sent.
    """
    db = get_database()
    
    document = {
        "lead_id": lead_id,
        "lead_email": lead_email,
        "subject": subject,
        "success": success,
        "message": message,
        "sent_at": datetime.utcnow()
    }
    
    result = await db.email_history.insert_one(document)
    
    # Also update the lead's last_emailed_at field
    try:
        await db.leads.update_one(
            {"_id": ObjectId(lead_id)},
            {"$set": {"last_emailed_at": datetime.utcnow()}}
        )
    except Exception:
        pass
    
    return str(result.inserted_id)


async def get_last_email_time(lead_id: str) -> Optional[datetime]:
    """Get the last time an email was sent to this lead."""
    db = get_database()
    
    try:
        doc = await db.email_history.find_one(
            {"lead_id": lead_id, "success": True},
            sort=[("sent_at", -1)]
        )
        return doc.get("sent_at") if doc else None
    except Exception:
        return None


async def get_leads_for_email_campaign() -> List[Dict[str, Any]]:
    """
    Get all leads that are eligible for email based on their score and last email time.
    
    Returns leads sorted by score (highest first) that haven't been emailed
    within their score-based frequency window.
    """
    db = get_database()
    now = datetime.utcnow()
    
    # Get all leads
    cursor = db.leads.find({}).sort("score", -1)
    
    eligible_leads = []
    async for lead in cursor:
        lead_id = str(lead["_id"])
        score = lead.get("score", 50)
        email = lead.get("email")
        
        if not email:
            continue
        
        # Get required frequency based on score
        frequency_hours = get_email_frequency_hours(score)
        
        # Check last email time
        last_emailed = lead.get("last_emailed_at")
        
        # If never emailed or enough time has passed, include this lead
        if last_emailed is None:
            eligible = True
        else:
            time_since_last = now - last_emailed
            hours_since_last = time_since_last.total_seconds() / 3600
            eligible = hours_since_last >= frequency_hours
        
        if eligible:
            lead["id"] = lead_id
            del lead["_id"]
            lead["frequency_hours"] = frequency_hours
            lead["priority"] = "hot" if score >= 90 else "warm" if score >= 70 else "medium" if score >= 50 else "cool" if score >= 30 else "cold"
            if lead.get("last_emailed_at"):
                lead["last_emailed_at"] = lead["last_emailed_at"].isoformat()
            if lead.get("created_at"):
                lead["created_at"] = lead["created_at"].isoformat()
            eligible_leads.append(lead)
    
    return eligible_leads


async def get_email_history(lead_id: str = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Get email history, optionally filtered by lead ID."""
    db = get_database()
    
    query = {}
    if lead_id:
        query["lead_id"] = lead_id
    
    cursor = db.email_history.find(query).sort("sent_at", -1).limit(limit)
    
    results = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        if doc.get("sent_at"):
            doc["sent_at"] = doc["sent_at"].isoformat()
        results.append(doc)
    
    return results

