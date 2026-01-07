# 🚀 AI Marketing Automation Agent

> Generate comprehensive marketing content (SEO, Social Media, Email, WhatsApp) from a single prompt using AI.

## ✨ Features

- **🔍 SEO Tool**: Generates primary keywords, long-tail keywords, and SEO title suggestions
- **📱 Social Media Tool**: Creates Instagram & LinkedIn posts with emojis, hashtags, and CTAs
- **📧 Email Marketing Tool**: Produces professional email content with subject lines
- **💬 WhatsApp Tool**: Generates short, friendly promotional messages

## 🛠️ Tech Stack

- **Language**: Python 3.9+
- **Framework**: LangChain + FastAPI
- **LLM**: OpenAI GPT-4o-mini
- **Memory**: ConversationBufferMemory

## 📦 Installation

### 1. Clone/Navigate to the Project

```bash
cd ai-marketing-agent
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy the example env file
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

## 🚀 Running the Server

```bash
uvicorn app.main:app --reload
```

The server will start at: **http://localhost:8000**

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📡 API Usage

### Endpoint

```
POST /generate-marketing
```

### Request Body

```json
{
  "business_name": "AI Exam Prep App",
  "product_description": "AI-powered exam preparation for engineering students",
  "target_audience": "College students in India"
}
```

### Response

```json
{
  "seo": "**Primary Keywords**\n1. AI exam prep\n2. Engineering study app...",
  "social_media": "📚 Ready to ace your exams? 🚀...",
  "email": "Subject: Transform Your Exam Prep with AI...",
  "whatsapp": "Hey! 👋 Ready to crush your exams?..."
}
```

## 🧪 Testing the API

### Using cURL

```bash
curl -X POST "http://localhost:8000/generate-marketing" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "AI Exam Prep App",
    "product_description": "AI-powered exam preparation for engineering students",
    "target_audience": "College students in India"
  }'
```

### Using PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/generate-marketing" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"business_name": "AI Exam Prep App", "product_description": "AI-powered exam preparation for engineering students", "target_audience": "College students in India"}'
```

### Using Swagger UI

1. Open http://localhost:8000/docs
2. Click on `POST /generate-marketing`
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"

## 🎤 Hackathon Demo Steps

### 1. Start the Server (Terminal)
```bash
uvicorn app.main:app --reload
```

### 2. Open Swagger UI
Navigate to http://localhost:8000/docs

### 3. Demo the API
- Show the interactive documentation
- Execute a sample request
- Highlight the agent's tool selection (visible in terminal logs)
- Show the comprehensive marketing pack output

### 4. Key Talking Points
- ⚡ Single prompt → Complete marketing pack
- 🧠 AI agent autonomously selects and uses tools
- 🔄 Conversation memory for context retention
- 🛠️ Extensible tool architecture
- 📊 Real-world business applicability

## 📁 Project Structure

```
ai-marketing-agent/
│
├── app/
│   ├── main.py        # FastAPI entry point
│   ├── agent.py       # LangChain agent setup
│   ├── tools.py       # Marketing tools (SEO, Social, Email, WhatsApp)
│   ├── schemas.py     # Pydantic request/response models
│   └── config.py      # LLM + environment configuration
│
├── .env.example       # API key template
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## 🔧 Extending the Agent

To add new marketing tools:

1. Add a new tool function in `app/tools.py`:
```python
@tool
def new_marketing_tool(business_info: str) -> str:
    """Description of what this tool does."""
    llm = get_llm()
    prompt = f"Your prompt here: {business_info}"
    response = llm.invoke(prompt)
    return response.content
```

2. Add it to `get_marketing_tools()` list
3. Update the response schema if needed

## ⚠️ Troubleshooting

### "OPENAI_API_KEY is not set"
- Ensure `.env` file exists with your API key
- Check the key format: `OPENAI_API_KEY=sk-...`

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Rate Limits
- The agent makes multiple LLM calls
- Consider using `gpt-3.5-turbo` for faster, cheaper iterations

## 📄 License

MIT License - Feel free to use and modify for your hackathon!

---

Built with ❤️ using LangChain and FastAPI
