"""
LangChain Agent setup for the AI Marketing Automation system.
Uses tools to generate comprehensive marketing content.
"""

from app.config import get_llm
from app.tools import get_marketing_tools
from app.integrations.email_sender import send_email
from app.integrations.whatsapp_sender import send_whatsapp

from app.integrations.social_poster import post_to_instagram

from app.integrations.hashnode_publisher import publish_to_hashnode


class MarketingAgent:
    """AI Marketing Agent that orchestrates all marketing tools."""
    
    def __init__(self):
        """Initialize the marketing agent with LLM and tools."""
        self.llm = get_llm()
        self.tools = get_marketing_tools()
    
    def generate_marketing_campaign(
        self,
        business_name: str,
        product_description: str,
        target_audience: str
    ) -> dict:
        """
        Generate a complete marketing campaign using all tools.
        
        Args:
            business_name: Name of the business/product
            product_description: Description of what the business offers
            target_audience: The intended audience for the marketing
            
        Returns:
            Dictionary with seo, social_media, email, and whatsapp content
        """
        # Construct the business info prompt
        business_info = f"""
Business Name: {business_name}
Product/Service: {product_description}
Target Audience: {target_audience}
"""
        
        print("\n" + "="*60)
        print("🚀 AI MARKETING AGENT - GENERATING CAMPAIGN")
        print("="*60)
        print(f"\n📋 Business Info:\n{business_info}")
        
        # Call each tool and collect results
        print("\n🔍 [Tool 1/4] Generating SEO Keywords...")
        seo_result = self.tools[0].invoke(business_info)
        print("✅ SEO content generated!")
        
        print("\n📱 [Tool 2/4] Creating Social Media Posts...")
        social_result = self.tools[1].invoke(business_info)
        print("✅ Social media posts created!")
        
        print("\n📧 [Tool 3/4] Writing Email Marketing Content...")
        email_result = self.tools[2].invoke(business_info)
        print("✅ Email content written!")
        
        print("\n💬 [Tool 4/4] Crafting WhatsApp Messages...")
        whatsapp_result = self.tools[3].invoke(business_info)
        print("✅ WhatsApp messages crafted!")
        
        print("\n" + "="*60)
        print("🎉 MARKETING CAMPAIGN COMPLETE!")
        print("="*60 + "\n")
        
        return {
            "seo": seo_result,
            "social_media": social_result,
            "email": email_result,
            "whatsapp": whatsapp_result
        }
    
    def generate_goal_based_campaign(
        self,
        goal: str,
        business_context: str
    ) -> dict:
        """
        Generate a goal-oriented marketing campaign.
        First creates a plan, then executes all tools aligned with the goal.
        
        Args:
            goal: The marketing goal to achieve
            business_context: Context about the business/product
            
        Returns:
            Dictionary with plan and all marketing content
        """
        # Combine goal and context for the tools
        goal_info = f"""
Goal: {goal}
Business Context: {business_context}
"""
        
        print("\n" + "="*60)
        print("🎯 AI MARKETING AGENT - GOAL-BASED CAMPAIGN")
        print("="*60)
        print(f"\n📋 Goal: {goal}")
        print(f"📋 Context: {business_context}")
        
        # Step 1: Generate the strategic plan
        print("\n📝 [Step 1/6] Creating Strategic Plan...")
        plan_result = self.tools[4].invoke(goal)  # goal_planning_tool
        print("✅ Strategic plan created!")
        
        # Step 2-5: Execute all tools with goal context
        print("\n🔍 [Step 2/6] Generating SEO Keywords...")
        seo_result = self.tools[0].invoke(goal_info)
        print("✅ SEO content generated!")
        
        print("\n📱 [Step 3/6] Creating Social Media Posts...")
        social_result = self.tools[1].invoke(goal_info)
        print("✅ Social media posts created!")
        
        print("\n📧 [Step 4/6] Writing Email Marketing Content...")
        email_result = self.tools[2].invoke(goal_info)
        print("✅ Email content written!")
        
        print("\n💬 [Step 5/6] Crafting WhatsApp Messages...")
        whatsapp_result = self.tools[3].invoke(goal_info)
        print("✅ WhatsApp messages crafted!")
        
        # Step 6: Generate Blog Post
        print("\n📝 [Step 6/6] Creating Blog Post...")
        blog_result = self.tools[5].invoke(goal_info)  # blog_post_tool
        print("✅ Blog post created!")
        
        print("\n" + "="*60)
        print("🎉 GOAL-BASED CAMPAIGN COMPLETE!")
        print("="*60 + "\n")
        
        return {
            "plan": plan_result,
            "seo": seo_result,
            "social_media": social_result,
            "email": email_result,
            "whatsapp": whatsapp_result,
            "blog_post": blog_result
        }
    
    def execute_autonomous_actions(
        self,
        marketing_content: dict,
        business_name: str,
        product_description: str = "",
        recipient_email: str = None,
        recipient_whatsapp: str = None,
        drive_folder_id: str = None,
        instagram_image_url: str = None,
        generate_instagram_image: bool = False
    ) -> dict:
        """
        Execute autonomous marketing actions: send email, WhatsApp, post to Instagram.
        
        Args:
            marketing_content: Generated marketing content dict
            business_name: Name of the business
            product_description: Description of product/service (for image generation)
            recipient_email: Email to send marketing content to
            recipient_whatsapp: WhatsApp number to send message to
            drive_folder_id: Google Drive folder ID for upload
            instagram_image_url: Public URL of image to post to Instagram
            generate_instagram_image: If True, auto-generate image with DALL-E + Cloudinary
            
        Returns:
            Dictionary with results for each action
        """
        results = {
            "email_result": None,
            "whatsapp_result": None,
            "drive_result": None,
            "instagram_result": None,
            "image_generation_result": None,
            "hashnode_result": None
        }
        
        print("\n" + "="*60)
        print("🤖 EXECUTING AUTONOMOUS ACTIONS")
        print("="*60)
        
        # 1. Send Email
        if recipient_email:
            print(f"\n📧 Sending email to {recipient_email}...")
            # Extract subject line from email content (first line after "Subject:")
            email_content = marketing_content.get("email", "")
            subject = "Your Marketing Campaign Content"
            if "Subject:" in email_content:
                lines = email_content.split("\n")
                for line in lines:
                    if "Subject:" in line or "subject:" in line.lower():
                        subject = line.replace("Subject:", "").replace("subject:", "").strip()
                        break
            
            email_result = send_email(
                to=recipient_email,
                subject=subject,
                body=email_content
            )
            results["email_result"] = email_result
            print(f"   {'✅' if email_result['success'] else '❌'} {email_result['message']}")
        
        # 2. Send WhatsApp
        if recipient_whatsapp:
            print(f"\n💬 Sending WhatsApp to {recipient_whatsapp}...")
            whatsapp_content = marketing_content.get("whatsapp", "")
            # Use first message only (usually under 160 chars)
            first_message = whatsapp_content.split("\n\n")[0] if whatsapp_content else ""
            
            whatsapp_result = send_whatsapp(
                to=recipient_whatsapp,
                message=first_message[:500]  # Limit message length
            )
            results["whatsapp_result"] = whatsapp_result
            print(f"   {'✅' if whatsapp_result['success'] else '❌'} {whatsapp_result['message']}")
        
        # 3. Upload to Google Drive
        print(f"\n📁 Uploading marketing pack to Google Drive...")
        drive_result = upload_marketing_pack_to_drive(
            marketing_content=marketing_content,
            business_name=business_name,
            folder_id=drive_folder_id
        )
        results["drive_result"] = drive_result
        print(f"   {'✅' if drive_result['success'] else '❌'} {drive_result['message']}")
        
        # 4. Post to Instagram
        if instagram_image_url or generate_instagram_image:
            print(f"\n📸 Posting to Instagram...")
            
            # Auto-generate image if requested and no URL provided
            final_image_url = instagram_image_url
            if generate_instagram_image and not instagram_image_url:
                print("   🎨 Auto-generating image with DALL-E...")
                gen_result = generate_and_upload_image(
                    business_name=business_name,
                    product_description=product_description
                )
                results["image_generation_result"] = gen_result
                
                if gen_result["success"]:
                    final_image_url = gen_result["public_url"]
                    print(f"   ✅ Image generated and uploaded: {final_image_url[:50]}...")
                else:
                    print(f"   ❌ Image generation failed: {gen_result['message']}")
            
            # Only post if we have an image URL
            if final_image_url:
                # Extract Instagram content from social_media (look for Instagram section)
                social_content = marketing_content.get("social_media", "")
                instagram_caption = ""
                
                # Try to extract Instagram-specific content
                if "Instagram" in social_content or "INSTAGRAM" in social_content:
                    lines = social_content.split("\n")
                    capture = False
                    for line in lines:
                        if "Instagram" in line or "INSTAGRAM" in line:
                            capture = True
                            continue
                        if capture:
                            if "LinkedIn" in line or "LINKEDIN" in line or "---" in line:
                                break
                            instagram_caption += line + "\n"
                    instagram_caption = instagram_caption.strip()
                
                # Fallback to full social content if no Instagram section found
                if not instagram_caption:
                    instagram_caption = social_content[:2200]  # Instagram caption limit
                
                instagram_result = post_to_instagram(
                    caption=instagram_caption,
                    image_url=final_image_url
                )
                results["instagram_result"] = instagram_result
                print(f"   {'✅' if instagram_result['success'] else '❌'} {instagram_result['message']}")
            else:
                results["instagram_result"] = {
                    "success": False,
                    "message": "No image URL available for Instagram posting"
                }
                print("   ❌ No image URL available for Instagram posting")
        
        # 5. Publish Blog Post to Hashnode
        blog_content = marketing_content.get("blog_post", "")
        if blog_content:
            print(f"\n📝 Publishing blog post to Hashnode...")
            
            # Extract title from blog content (first heading)
            blog_title = business_name + " - Marketing Insights"
            lines = blog_content.split('\n')
            for line in lines:
                if line.startswith('# '):
                    blog_title = line.replace('# ', '').strip()
                    break
            
            hashnode_result = publish_to_hashnode(
                title=blog_title,
                content=blog_content,
                tags=["marketing", "business", "ai"]
            )
            results["hashnode_result"] = hashnode_result
            if hashnode_result.get("success"):
                print(f"   ✅ Blog published! URL: {hashnode_result.get('post_url', 'N/A')}")
            else:
                print(f"   ❌ Failed to publish blog: {hashnode_result.get('error', 'Unknown error')}")
        else:
            results["hashnode_result"] = {
                "success": False,
                "message": "No blog content generated to publish"
            }
        
        print("\n" + "="*60)
        print("🎉 AUTONOMOUS ACTIONS COMPLETE!")
        print("="*60 + "\n")
        
        return results


# Singleton instance for the agent
_agent_instance = None


def get_marketing_agent() -> MarketingAgent:
    """Get or create the marketing agent singleton."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = MarketingAgent()
    return _agent_instance

