"""
Configuration module for the AI Marketing Agent.
Loads environment variables and provides LLM configuration.
Uses Groq for fast, free AI inference.
"""

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set. Please check your .env file.")

# LLM Configuration using Groq
def get_llm() -> ChatGroq:
    """
    Returns a configured ChatGroq instance.
    Uses Llama 3.3 70B model for high-quality responses.
    """
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        api_key=GROQ_API_KEY
    )


