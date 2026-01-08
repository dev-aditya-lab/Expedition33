'use client';

import { useState } from 'react';
import { Search, Loader2, RefreshCw, Copy, Check, TrendingUp, Hash, FileText, Globe, ExternalLink } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { generateSEO, analyzeWebsite } from '../api';

export default function SEOPage() {
    // Tab state
    const [activeTab, setActiveTab] = useState('keywords'); // 'keywords' or 'website'

    // Keywords generation state
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [businessName, setBusinessName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Website analysis state
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [websiteResult, setWebsiteResult] = useState(null);
    
    // Parsed SEO content
    const [primaryKeywords, setPrimaryKeywords] = useState([]);
    const [longTailKeywords, setLongTailKeywords] = useState([]);
    const [titleSuggestions, setTitleSuggestions] = useState([]);

    const parseContent = (content) => {
        const lines = content.split('\n');
        let currentSection = '';
        const primary = [];
        const longTail = [];
        const titles = [];

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            if (lowerLine.includes('primary keyword')) {
                currentSection = 'primary';
                continue;
            } else if (lowerLine.includes('long-tail') || lowerLine.includes('long tail')) {
                currentSection = 'longtail';
                continue;
            } else if (lowerLine.includes('title') || lowerLine.includes('seo title')) {
                currentSection = 'titles';
                continue;
            }

            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('**') && !trimmed.startsWith('#')) {
                const keyword = trimmed.replace(/^[-*\d.)\s]+/, '').trim();
                if (keyword && keyword.length > 2) {
                    if (currentSection === 'primary') {
                        primary.push(keyword);
                    } else if (currentSection === 'longtail') {
                        longTail.push(keyword);
                    } else if (currentSection === 'titles') {
                        titles.push(keyword);
                    }
                }
            }
        }

        setPrimaryKeywords(primary.slice(0, 7));
        setLongTailKeywords(longTail.slice(0, 7));
        setTitleSuggestions(titles.slice(0, 5));
    };

    const handleGenerate = async () => {
        if (!businessName || !productDescription || !targetAudience) return;
        
        setGenerating(true);
        setGeneratedContent(null);
        setPrimaryKeywords([]);
        setLongTailKeywords([]);
        setTitleSuggestions([]);
        
        try {
            const result = await generateSEO({
                businessName,
                productDescription,
                targetAudience
            });
            setGeneratedContent(result.content);
            parseContent(result.content);
        } catch (error) {
            alert('Error generating SEO content: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleAnalyzeWebsite = async () => {
        if (!websiteUrl) return;
        
        // Add https if missing
        let url = websiteUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        setAnalyzing(true);
        setWebsiteResult(null);
        
        try {
            const result = await analyzeWebsite(url);
            setWebsiteResult(result);
            // Also parse the SEO analysis
            if (result.seo_analysis) {
                parseContent(result.seo_analysis);
            }
        } catch (error) {
            alert('Error analyzing website: ' + error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyAllKeywords = () => {
        const all = [...primaryKeywords, ...longTailKeywords].join(', ');
        copyToClipboard(all);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        SEO Keywords
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        AI-powered keyword research and website analysis
                    </p>
                </div>
            </header>

            {/* Tab Selector */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('keywords')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'keywords'
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Hash className="w-4 h-4" /> Keyword Generator
                </button>
                <button
                    onClick={() => setActiveTab('website')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'website'
                            ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Globe className="w-4 h-4" /> Website Analyzer
                </button>
            </div>

            {/* Keyword Generator Tab */}
            {activeTab === 'keywords' && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-emerald-500" />
                        AI SEO Keyword Generator
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Business name"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                        <input
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Product/Service description"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Target audience"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={generating || !businessName || !productDescription || !targetAudience}
                        className="flex items-center gap-2 py-2.5 px-5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-sm font-semibold cursor-pointer hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Researching Keywords...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" /> Generate SEO Keywords
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Website Analyzer Tab */}
            {activeTab === 'website' && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-violet-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-violet-500" />
                        Website SEO Analyzer
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Enter a website URL and our AI will analyze it and generate targeted SEO recommendations.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full py-3 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            />
                        </div>
                        <button
                            onClick={handleAnalyzeWebsite}
                            disabled={analyzing || !websiteUrl}
                            className="flex items-center gap-2 py-3 px-6 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-400 text-sm font-semibold cursor-pointer hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" /> Analyze Website
                                </>
                            )}
                        </button>
                    </div>

                    {/* Website Analysis Result */}
                    {websiteResult && (
                        <div className="mt-6 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                            {/* Website Info */}
                            <div className="p-4 bg-white/5 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <ExternalLink className="w-4 h-4 text-violet-400" />
                                    <a 
                                        href={websiteResult.website_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-violet-400 hover:text-violet-300 text-sm"
                                    >
                                        {websiteResult.website_url}
                                    </a>
                                </div>
                                
                                {websiteResult.title && (
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500">Title:</span>
                                        <p className="text-sm text-white">{websiteResult.title}</p>
                                    </div>
                                )}
                                
                                {websiteResult.description && (
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500">Meta Description:</span>
                                        <p className="text-sm text-gray-300">{websiteResult.description}</p>
                                    </div>
                                )}
                                
                                {websiteResult.content_summary && (
                                    <div>
                                        <span className="text-xs text-gray-500">Content Summary:</span>
                                        <p className="text-xs text-gray-400 line-clamp-3">{websiteResult.content_summary}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Generated Content Display */}
            {(generatedContent || websiteResult?.seo_analysis) && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatsCard 
                            title="Primary Keywords" 
                            value={primaryKeywords.length} 
                            icon="hash" 
                            gradient="green" 
                        />
                        <StatsCard 
                            title="Long-tail Keywords" 
                            value={longTailKeywords.length} 
                            icon="trending" 
                            gradient="teal" 
                        />
                        <StatsCard 
                            title="Title Suggestions" 
                            value={titleSuggestions.length} 
                            icon="mail" 
                            gradient="purple" 
                        />
                    </div>

                    {/* Keywords Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Primary Keywords */}
                        {primaryKeywords.length > 0 && (
                            <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-emerald-500" />
                                        Primary Keywords
                                    </h4>
                                    <span className="text-xs text-gray-500">High volume</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {primaryKeywords.map((keyword, i) => (
                                        <button
                                            key={i}
                                            onClick={() => copyToClipboard(keyword)}
                                            className="py-2 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all cursor-pointer"
                                        >
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Long-tail Keywords */}
                        {longTailKeywords.length > 0 && (
                            <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-cyan-500" />
                                        Long-tail Keywords
                                    </h4>
                                    <span className="text-xs text-gray-500">Low competition</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {longTailKeywords.map((keyword, i) => (
                                        <button
                                            key={i}
                                            onClick={() => copyToClipboard(keyword)}
                                            className="py-2 px-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/20 transition-all cursor-pointer"
                                        >
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Title Suggestions */}
                    {titleSuggestions.length > 0 && (
                        <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-violet-500" />
                                    SEO Title Suggestions
                                </h4>
                                <span className="text-xs text-gray-500">Under 60 characters</span>
                            </div>
                            <div className="space-y-3">
                                {titleSuggestions.map((title, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl group hover:bg-white/10 transition-all"
                                    >
                                        <span className="text-sm text-gray-200">{title}</span>
                                        <button
                                            onClick={() => copyToClipboard(title)}
                                            className="p-2 text-gray-500 hover:text-violet-400 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Copy All Button */}
                    {primaryKeywords.length > 0 && (
                        <div className="flex justify-center">
                            <button
                                onClick={copyAllKeywords}
                                className="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl text-white text-sm font-semibold hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-emerald-400" />
                                        Copied to Clipboard!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy All Keywords
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Raw Content */}
                    <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                        <h4 className="text-sm font-semibold text-white mb-3">Full SEO Analysis</h4>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto p-4 bg-white/5 rounded-xl">
                            {websiteResult?.seo_analysis || generatedContent}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
