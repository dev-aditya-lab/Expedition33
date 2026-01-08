"""
Hashnode Blog Publisher Integration.
Generates and publishes blog posts directly to Hashnode.
Uses Hashnode's GraphQL API.
"""

import os
import requests
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Hashnode API Configuration
HASHNODE_API_URL = "https://gql.hashnode.com"


def get_hashnode_headers() -> Dict[str, str]:
    """Get headers for Hashnode API requests."""
    token = os.getenv("HASHNODE_TOKEN", "")
    return {
        "Authorization": token,
        "Content-Type": "application/json"
    }


def get_my_publication() -> Optional[Dict[str, Any]]:
    """
    Get the authenticated user's publication info.
    Returns publication ID and details.
    """
    token = os.getenv("HASHNODE_TOKEN")
    if not token:
        return None
    
    query = """
    query Me {
        me {
            id
            username
            publications(first: 1) {
                edges {
                    node {
                        id
                        title
                        url
                    }
                }
            }
        }
    }
    """
    
    try:
        response = requests.post(
            HASHNODE_API_URL,
            headers=get_hashnode_headers(),
            json={"query": query}
        )
        response.raise_for_status()
        data = response.json()
        
        if "errors" in data:
            print(f"[Hashnode] Error: {data['errors']}")
            return None
        
        me = data.get("data", {}).get("me", {})
        publications = me.get("publications", {}).get("edges", [])
        
        if publications:
            pub = publications[0]["node"]
            return {
                "user_id": me.get("id"),
                "username": me.get("username"),
                "publication_id": pub.get("id"),
                "publication_title": pub.get("title"),
                "publication_url": pub.get("url")
            }
        
        return {"user_id": me.get("id"), "username": me.get("username")}
        
    except Exception as e:
        print(f"[Hashnode] Error getting publication: {e}")
        return None


def publish_to_hashnode(
    title: str,
    content: str,
    tags: List[str] = None,
    publication_id: str = None,
    cover_image_url: Optional[str] = None,
    subtitle: Optional[str] = None
) -> Dict[str, Any]:
    """
    Publish a blog post to Hashnode.
    
    Args:
        title: Post title
        content: Post content in Markdown format
        tags: List of tag slugs (e.g., ["javascript", "web-development"])
        publication_id: Hashnode publication ID (uses env var if not provided)
        cover_image_url: Optional cover image URL
        subtitle: Optional subtitle/excerpt
    
    Returns:
        Dict with success status and post URL or error
    """
    token = os.getenv("HASHNODE_TOKEN")
    
    if not token:
        return {
            "success": False,
            "error": "HASHNODE_TOKEN not configured. Set it in your .env file."
        }
    
    # Get publication ID
    pub_id = publication_id or os.getenv("HASHNODE_PUBLICATION_ID")
    
    if not pub_id:
        # Try to get from user's publications
        pub_info = get_my_publication()
        if pub_info and pub_info.get("publication_id"):
            pub_id = pub_info["publication_id"]
        else:
            return {
                "success": False,
                "error": "HASHNODE_PUBLICATION_ID not configured and could not auto-detect. Set it in your .env file."
            }
    
    # Build tags array for GraphQL
    tags_input = []
    if tags:
        for tag in tags[:5]:  # Max 5 tags
            tags_input.append({
                "slug": tag.lower().replace(" ", "-"),
                "name": tag
            })
    
    # GraphQL mutation for publishing
    mutation = """
    mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
            post {
                id
                title
                slug
                url
            }
        }
    }
    """
    
    variables = {
        "input": {
            "title": title,
            "contentMarkdown": content,
            "publicationId": pub_id,
            "tags": tags_input if tags_input else []
        }
    }
    
    if cover_image_url:
        variables["input"]["coverImageOptions"] = {
            "coverImageURL": cover_image_url
        }
    
    if subtitle:
        variables["input"]["subtitle"] = subtitle
    
    try:
        response = requests.post(
            HASHNODE_API_URL,
            headers={
                "Authorization": token,
                "Content-Type": "application/json"
            },
            json={"query": mutation, "variables": variables}
        )
        response.raise_for_status()
        data = response.json()
        
        if "errors" in data:
            error_msg = data["errors"][0].get("message", "Unknown error")
            return {
                "success": False,
                "error": f"Hashnode API error: {error_msg}",
                "details": data["errors"]
            }
        
        post_data = data.get("data", {}).get("publishPost", {}).get("post", {})
        
        return {
            "success": True,
            "post_id": post_data.get("id"),
            "post_url": post_data.get("url"),
            "slug": post_data.get("slug"),
            "title": post_data.get("title")
        }
        
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to publish: {str(e)}"
        }


def generate_and_publish_blog(
    title: str,
    content: str,
    tags: List[str] = None
) -> Dict[str, Any]:
    """
    Convenience function to publish a blog post to Hashnode.
    
    Args:
        title: Blog post title
        content: Blog post content in markdown
        tags: List of tags
    
    Returns:
        Result dict with success status and details
    """
    return publish_to_hashnode(
        title=title,
        content=content,
        tags=tags
    )
