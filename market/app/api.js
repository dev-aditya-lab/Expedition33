/**
 * API Client for AI Marketing Agent Backend
 * Connects to FastAPI backend at localhost:8000
 */

const API_BASE = 'http://localhost:8000';

/**
 * Generate all marketing content at once
 */
export async function generateAllMarketing(data) {
    const response = await fetch(`${API_BASE}/generate-marketing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience,
            goal: data.goal || null,
            execute_actions: data.executeActions || false,
            recipient_email: data.recipientEmail || null,
            generate_instagram_image: data.generateImage || false
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate marketing content');
    }
    
    return response.json();
}

/**
 * Generate SEO content only
 */
export async function generateSEO(data) {
    const response = await fetch(`${API_BASE}/generate/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate SEO content');
    }
    
    return response.json();
}

/**
 * Generate social media content (with optional AI image)
 */
export async function generateSocial(data) {
    const response = await fetch(`${API_BASE}/generate/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience,
            platform: data.platform || 'instagram',
            generate_image: data.generateImage || false,
            image_url: data.imageUrl || null
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate social content');
    }
    
    return response.json();
}

/**
 * Generate email marketing content
 */
export async function generateEmail(data) {
    const response = await fetch(`${API_BASE}/generate/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate email content');
    }
    
    return response.json();
}

/**
 * Generate WhatsApp messages
 */
export async function generateWhatsApp(data) {
    const response = await fetch(`${API_BASE}/generate/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate WhatsApp content');
    }
    
    return response.json();
}

/**
 * Send email directly
 */
export async function sendEmail(data) {
    const response = await fetch(`${API_BASE}/send/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            business_name: data.businessName,
            product_description: data.productDescription,
            target_audience: data.targetAudience,
            recipient_email: data.recipientEmail
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send email');
    }
    
    return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Analyze a website for SEO
 */
export async function analyzeWebsite(websiteUrl) {
    const response = await fetch(`${API_BASE}/analyze/website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            website_url: websiteUrl
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to analyze website');
    }
    
    return response.json();
}

/**
 * Get generation history
 */
export async function getGenerationHistory(limit = 50, type = null) {
    let url = `${API_BASE}/history/generations?limit=${limit}`;
    if (type) url += `&type=${type}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch history');
    }
    
    return response.json();
}

/**
 * Get website analysis history
 */
export async function getAnalysisHistory(limit = 50) {
    const response = await fetch(`${API_BASE}/history/analyses?limit=${limit}`);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch analyses');
    }
    
    return response.json();
}

/**
 * Get history stats
 */
export async function getHistoryStats() {
    const response = await fetch(`${API_BASE}/history/stats`);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch stats');
    }
    
    return response.json();
}
