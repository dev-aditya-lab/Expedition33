"""
LangChain Agent setup for the AI Marketing Automation system.
Uses tools to generate comprehensive marketing content.
"""

from app.config import get_llm
from app.tools import get_marketing_tools


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
        print("\n📝 [Step 1/5] Creating Strategic Plan...")
        plan_result = self.tools[4].invoke(goal)  # goal_planning_tool
        print("✅ Strategic plan created!")
        
        # Step 2-5: Execute all tools with goal context
        print("\n🔍 [Step 2/5] Generating SEO Keywords...")
        seo_result = self.tools[0].invoke(goal_info)
        print("✅ SEO content generated!")
        
        print("\n📱 [Step 3/5] Creating Social Media Posts...")
        social_result = self.tools[1].invoke(goal_info)
        print("✅ Social media posts created!")
        
        print("\n📧 [Step 4/5] Writing Email Marketing Content...")
        email_result = self.tools[2].invoke(goal_info)
        print("✅ Email content written!")
        
        print("\n💬 [Step 5/5] Crafting WhatsApp Messages...")
        whatsapp_result = self.tools[3].invoke(goal_info)
        print("✅ WhatsApp messages crafted!")
        
        print("\n" + "="*60)
        print("🎉 GOAL-BASED CAMPAIGN COMPLETE!")
        print("="*60 + "\n")
        
        return {
            "plan": plan_result,
            "seo": seo_result,
            "social_media": social_result,
            "email": email_result,
            "whatsapp": whatsapp_result
        }


# Singleton instance for the agent
_agent_instance = None


def get_marketing_agent() -> MarketingAgent:
    """Get or create the marketing agent singleton."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = MarketingAgent()
    return _agent_instance
