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
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# MongoDB Client (initialized on first use)
_client: Optional[AsyncIOMotorClient] = None
_db = None


def get_database():
    """Get the MongoDB database instance."""
    global _client, _db
    
    if _db is None:
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        database_name = os.getenv("MONGODB_DATABASE", "marketing_agent")
        
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
