'use client';

import { useState } from 'react';
import { Target, Rocket, Loader2, CheckCircle, XCircle, Mail, Share2, Search, Zap } from 'lucide-react';
import { generateAllMarketing } from '../api';

const API_URL = 'http://localhost:8000';

export default function GoalInput({ onSubmit, onResult }) {
    const [goal, setGoal] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [actionProgress, setActionProgress] = useState([]);

    // Action toggles
    const [sendEmails, setSendEmails] = useState(true);
    const [createSocialPosts, setCreateSocialPosts] = useState(true);
    const [analyzeWebsite, setAnalyzeWebsite] = useState(false);

    const addProgress = (message, status = 'running') => {
        setActionProgress(prev => [...prev, { message, status, time: new Date().toLocaleTimeString() }]);
    };

    const updateLastProgress = (status) => {
        setActionProgress(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
                updated[updated.length - 1].status = status;
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);
        setActionProgress([]);

        try {
            const businessContext = {
                businessName: businessName || 'My Business',
                productDescription: productDescription || goal,
                targetAudience: targetAudience || 'General audience',
                goal: goal
            };

            // Step 1: Generate marketing content
            addProgress('🚀 Generating marketing content with AI...');
            const response = await generateAllMarketing(businessContext);
            updateLastProgress('done');
            
            let fullResult = { ...response };

            // Step 2: Send emails to leads if enabled
            if (sendEmails) {
                addProgress('📧 Sending AI-personalized emails to leads...');
                try {
                    const emailResponse = await fetch(
                        `${API_URL}/leads/ai-email-campaign?max_emails=10&dry_run=false&business_context=${encodeURIComponent(`${businessContext.businessName}: ${businessContext.productDescription}`)}`,
                        { method: 'POST' }
                    );
                    if (emailResponse.ok) {
                        const emailData = await emailResponse.json();
                        fullResult.emailCampaign = emailData;
                        updateLastProgress('done');
                    } else {
                        updateLastProgress('failed');
                    }
                } catch (err) {
                    console.error('Email error:', err);
                    updateLastProgress('failed');
                }
            }

            // Step 3: Create and schedule social posts if enabled
            if (createSocialPosts) {
                addProgress('📱 Creating and scheduling social posts...');
                try {
                    const socialResponse = await fetch(`${API_URL}/generate/social`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            business_name: businessContext.businessName,
                            product_description: businessContext.productDescription,
                            target_audience: businessContext.targetAudience,
                            platform: 'instagram',
                            generate_image: true,
                            manual_schedule: false // Auto-schedule
                        })
                    });
                    if (socialResponse.ok) {
                        const socialData = await socialResponse.json();
                        fullResult.socialPost = socialData;
                        updateLastProgress('done');
                    } else {
                        updateLastProgress('failed');
                    }
                } catch (err) {
                    console.error('Social error:', err);
                    updateLastProgress('failed');
                }
            }

            // Step 4: Analyze website if URL provided and enabled
            if (analyzeWebsite && websiteUrl) {
                addProgress('🔍 Analyzing website for SEO...');
                try {
                    const seoResponse = await fetch(`${API_URL}/analyze/website`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ website_url: websiteUrl })
                    });
                    if (seoResponse.ok) {
                        const seoData = await seoResponse.json();
                        fullResult.websiteAnalysis = seoData;
                        updateLastProgress('done');
                    } else {
                        updateLastProgress('failed');
                    }
                } catch (err) {
                    console.error('SEO error:', err);
                    updateLastProgress('failed');
                }
            }

            addProgress('✅ All actions completed!', 'done');
            setResult(fullResult);
            
            if (onSubmit) onSubmit(goal);
            if (onResult) onResult(fullResult);
            
        } catch (err) {
            setError(err.message);
            updateLastProgress('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const suggestions = [
        'Increase leads by 50%',
        'Improve email open rates',
        'Grow social engagement',
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-7">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white m-0">Set Your Business Goal</h2>
                    <p className="text-xs sm:text-sm text-gray-400 m-0">AI agent will generate content and execute actions</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                {/* Goal Input */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-3">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Generate 100 qualified leads this month..."
                        className="flex-1 min-w-0 py-3 sm:py-4 px-4 sm:px-5 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-[15px] placeholder:text-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-5 sm:px-7 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm sm:text-[15px] font-semibold cursor-pointer transition-all whitespace-nowrap hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                        disabled={isProcessing || !goal.trim()}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Rocket size={18} />
                                <span>Launch Agent</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Action Toggles */}
                <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Actions:
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendEmails}
                            onChange={(e) => setSendEmails(e.target.checked)}
                            className="w-4 h-4 rounded accent-violet-500"
                            disabled={isProcessing}
                        />
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-gray-300">Send Emails</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={createSocialPosts}
                            onChange={(e) => setCreateSocialPosts(e.target.checked)}
                            className="w-4 h-4 rounded accent-violet-500"
                            disabled={isProcessing}
                        />
                        <Share2 className="w-4 h-4 text-pink-400" />
                        <span className="text-xs text-gray-300">Create Social Posts</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={analyzeWebsite}
                            onChange={(e) => setAnalyzeWebsite(e.target.checked)}
                            className="w-4 h-4 rounded accent-violet-500"
                            disabled={isProcessing}
                        />
                        <Search className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-gray-300">SEO Analysis</span>
                    </label>
                </div>

                {/* Website URL (shown when SEO is enabled) */}
                {analyzeWebsite && (
                    <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Enter website URL for SEO analysis (e.g., https://example.com)"
                            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                            disabled={isProcessing}
                        />
                    </div>
                )}

                {/* Advanced Options Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-gray-500 hover:text-violet-400 mb-3 transition-colors"
                >
                    {showAdvanced ? '▼ Hide' : '▶ Show'} advanced options
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 animate-[fadeIn_0.3s_ease-out]">
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Business name"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                        <input
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Product description"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Target audience"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                    </div>
                )}
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-[13px] text-gray-500">Quick suggestions:</span>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setGoal(suggestion)}
                            className="py-2 px-3 sm:px-3.5 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs sm:text-[13px] cursor-pointer transition-all hover:bg-white/10 hover:border-violet-500/30 disabled:opacity-50"
                            disabled={isProcessing}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Progress */}
            {actionProgress.length > 0 && (
                <div className="mt-4 space-y-2">
                    {actionProgress.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                                item.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                                item.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                'bg-violet-500/10 text-violet-400'
                            }`}
                        >
                            {item.status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {item.status === 'done' && <CheckCircle className="w-3 h-3" />}
                            {item.status === 'failed' && <XCircle className="w-3 h-3" />}
                            <span>{item.message}</span>
                            <span className="ml-auto text-gray-500">{item.time}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                    <XCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {result && !error && !isProcessing && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle size={18} />
                    <span>All actions completed! Check the results below.</span>
                </div>
            )}

            {/* Processing Overlay */}
            {isProcessing && actionProgress.length === 0 && (
                <div className="absolute inset-0 bg-[rgba(10,11,20,0.9)] flex items-center justify-center rounded-2xl">
                    <div className="text-center">
                        <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full mx-auto mb-4 animate-spin" />
                        <p className="text-gray-300 text-sm m-0">AI Agent is generating your marketing content...</p>
                        <p className="text-gray-500 text-xs mt-2">This may take 15-30 seconds</p>
                    </div>
                </div>
            )}
        </div>
    );
}
