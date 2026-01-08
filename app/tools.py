"""
LangChain tools for marketing content generation.
Each tool is designed to generate specific marketing assets.
"""

from langchain.tools import tool
from app.config import get_llm


@tool
def seo_keyword_tool(business_info: str) -> str:
    """
    Generates SEO keywords, long-tail keywords, and SEO title suggestions for a business.
    Use this tool when you need to create search engine optimization content.
    
    Args:
        business_info: A description of the business, product, and target audience.
    
    Returns:
        SEO content including primary keywords, long-tail keywords, and title suggestions.
    """
    llm = get_llm()
    
    prompt = f"""You are an expert SEO specialist. Based on the following business information, generate:

1. **Primary Keywords** (5-7 high-volume keywords)
2. **Long-tail Keywords** (5-7 specific, lower-competition phrases)
3. **SEO Title Suggestions** (3 compelling title options under 60 characters)

Business Information:
{business_info}

Format your response clearly with headers for each section."""

    response = llm.invoke(prompt)
    return response.content


@tool
def social_media_tool(business_info: str) -> str:
    """
    Generates social media marketing posts for Instagram and LinkedIn.
    Includes emojis, hashtags, and a call-to-action.
    
    Args:
        business_info: A description of the business, product, and target audience.
    
    Returns:
        Social media posts optimized for Instagram and LinkedIn.
    """
    llm = get_llm()
    
    prompt = f"""You are a creative social media marketing expert. Based on the following business information, generate:

1. **Instagram Post**
   - Engaging caption with emojis
   - 5-10 relevant hashtags
   - Clear call-to-action (CTA)

2. **LinkedIn Post**
   - Professional yet engaging tone
   - Industry-relevant hashtags (3-5)
   - Strong CTA for professionals

Business Information:
{business_info}

Make the posts viral-worthy and engaging!"""

    response = llm.invoke(prompt)
    return response.content


@tool
def email_marketing_tool(business_info: str) -> str:
    """
    Generates professional email marketing content with subject line and body.
    Uses a professional marketing tone suitable for campaigns.
    
    Args:
        business_info: A description of the business, product, and target audience.
    
    Returns:
        Email marketing content with subject line and body.
    """
    llm = get_llm()
    
    prompt = f"""You are an expert email marketing copywriter. Based on the following business information, generate:

1. **Subject Line Options** (3 attention-grabbing subject lines)
2. **Email Body**
   - Professional marketing tone
   - Clear value proposition
   - Benefit-focused content
   - Strong call-to-action
   - Professional sign-off

Business Information:
{business_info}

Make the email compelling and conversion-focused!"""

    response = llm.invoke(prompt)
    return response.content


@tool
def whatsapp_marketing_tool(business_info: str) -> str:
    """
    Generates short, friendly WhatsApp promotional messages with CTA.
    Messages are concise and conversational.
    
    Args:
        business_info: A description of the business, product, and target audience.
    
    Returns:
        WhatsApp marketing messages ready to send.
    """
    llm = get_llm()
    
    prompt = f"""You are a WhatsApp marketing specialist. Based on the following business information, generate:

1. **Primary Message** (under 160 characters)
   - Friendly, conversational tone
   - Include 1-2 relevant emojis
   - Clear CTA

2. **Follow-up Message** (under 200 characters)
   - Creates urgency
   - Friendly tone
   - Direct CTA

3. **Offer Message** (under 180 characters)
   - Highlights a special offer/benefit
   - Engaging and personal

Business Information:
{business_info}

Keep messages short, punchy, and mobile-friendly!"""

    response = llm.invoke(prompt)
    return response.content


@tool
def goal_planning_tool(goal: str) -> str:
    """
    Generates a step-by-step marketing strategy to achieve a given goal.
    This tool should be used first to plan the approach before executing other tools.
    
    Args:
        goal: The marketing goal to achieve.
    
    Returns:
        A detailed step-by-step plan to achieve the goal.
    """
    llm = get_llm()
    
    prompt = f"""You are a strategic marketing planner. Given the following goal, create a detailed step-by-step plan.

Goal: {goal}

Generate a structured plan with:

1. **Goal Analysis** - Break down what the goal means and key success metrics
2. **Strategy Overview** - High-level approach to achieve this goal
3. **Step-by-Step Actions** - Numbered list of specific actions to take:
   - Step 1: [Action]
   - Step 2: [Action]
   - etc.
4. **Marketing Channels** - Which channels to focus on (SEO, Social Media, Email, WhatsApp)
5. **Timeline** - Suggested timeline for execution
6. **Expected Outcomes** - What success looks like

Be specific and actionable. Do not use special characters."""

    response = llm.invoke(prompt)
    return response.content

@tool
def blog_post_tool(topic_info: str) -> str:
    """
    Generates an SEO-optimized blog post in Markdown format.
    Perfect for publishing to Medium, WordPress, or other blog platforms.
    
    Args:
        topic_info: A description of the topic, target audience, and key points to cover.
    
    Returns:
        A complete blog post in Markdown format with title, sections, and SEO optimization.
    """
    llm = get_llm()
    
    prompt = f"""You are an expert content writer and SEO specialist. Write a compelling blog post based on:

{topic_info}

Create a blog post with:

1. **Engaging Title** - Hook the reader, include main keyword
2. **Introduction** - 2-3 sentences that grab attention and preview the value
3. **Main Sections** (3-5 sections with H2 headers):
   - Each section should be 100-150 words
   - Include relevant examples, tips, or data
   - Use bullet points where appropriate
4. **Conclusion** - Summarize key takeaways with a call-to-action
5. **SEO Tags** - Suggest 5 relevant tags

Format the entire response in clean Markdown. Make it:
- Engaging and valuable for readers
- SEO-friendly with natural keyword placement
- Around 800-1200 words total
- Easy to read with clear structure

DO NOT include any meta commentary. Just output the blog post."""

    response = llm.invoke(prompt)
    return response.content


# List of all available tools for the agent
def get_marketing_tools():
    """Returns a list of all marketing tools for the agent."""
    return [
        seo_keyword_tool,
        social_media_tool,
        email_marketing_tool,
        whatsapp_marketing_tool,
        goal_planning_tool,
        blog_post_tool
    ]

