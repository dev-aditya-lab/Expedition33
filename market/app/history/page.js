'use client';

import { useState, useEffect } from 'react';
import { Clock, Search, Hash, Mail, Share2, Globe, MessageSquare, RefreshCw, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { getGenerationHistory, getAnalysisHistory, getHistoryStats } from '../api';

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState('generations');
    const [generations, setGenerations] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const typeIcons = {
        seo: Hash,
        social: Share2,
        email: Mail,
        whatsapp: MessageSquare,
        full: Globe,
    };

    const typeColors = {
        seo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        social: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
        email: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        whatsapp: 'bg-green-500/20 text-green-400 border-green-500/30',
        full: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };

    useEffect(() => {
        loadData();
    }, [filterType]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [genData, analysisData, statsData] = await Promise.all([
                getGenerationHistory(50, filterType),
                getAnalysisHistory(50),
                getHistoryStats()
            ]);

            setGenerations(genData.generations || []);
            setAnalyses(analysisData.analyses || []);
            setStats(statsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Generation History
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        View all AI-generated content and analyses
                    </p>
                </div>
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center gap-2 py-2.5 px-5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium cursor-pointer hover:bg-white/10 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </header>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatsCard
                        title="Total Generations"
                        value={stats.total_generations || 0}
                        icon="hash"
                        gradient="purple"
                    />
                    <StatsCard
                        title="Website Analyses"
                        value={stats.total_website_analyses || 0}
                        icon="share"
                        gradient="teal"
                    />
                    <StatsCard
                        title="Most Common"
                        value={Object.keys(stats.by_type || {}).sort((a, b) => stats.by_type[b] - stats.by_type[a])[0] || 'N/A'}
                        icon="trending"
                        gradient="green"
                    />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">
                    {error}
                    <p className="text-xs text-gray-500 mt-2">
                        Make sure MongoDB is configured in your .env file
                    </p>
                </div>
            )}

            {/* Tab Selector */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('generations')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'generations'
                            ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    Content Generations ({generations.length})
                </button>
                <button
                    onClick={() => setActiveTab('analyses')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'analyses'
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Globe className="w-4 h-4" />
                    Website Analyses ({analyses.length})
                </button>
            </div>

            {/* Filter by Type (for generations) */}
            {activeTab === 'generations' && (
                <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs text-gray-500 mr-2">Filter:</span>
                    {[null, 'seo', 'social', 'email', 'whatsapp', 'full'].map((type) => (
                        <button
                            key={type || 'all'}
                            onClick={() => setFilterType(type)}
                            className={`py-1.5 px-3 rounded-lg text-xs transition-all ${
                                filterType === type
                                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                        >
                            {type || 'All'}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            )}

            {/* Generations List */}
            {!loading && activeTab === 'generations' && (
                <div className="space-y-4">
                    {generations.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No generations yet</p>
                            <p className="text-xs mt-2">Generate content to see it here</p>
                        </div>
                    ) : (
                        generations.map((gen) => {
                            const IconComponent = typeIcons[gen.type] || Hash;
                            const isExpanded = expandedId === gen._id;
                            
                            return (
                                <div
                                    key={gen._id}
                                    className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl"
                                >
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(gen._id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${typeColors[gen.type]}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white m-0">
                                                    {gen.business_name || 'Unknown Business'}
                                                </h3>
                                                <p className="text-xs text-gray-500 m-0">
                                                    {gen.type?.toUpperCase()} • {formatDate(gen.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`py-1 px-2.5 rounded-lg text-xs font-medium border ${typeColors[gen.type]}`}>
                                                {gen.type}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <span className="text-[11px] text-gray-500 uppercase">Product</span>
                                                    <p className="text-sm text-gray-300 m-0">{gen.product_description || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[11px] text-gray-500 uppercase">Target Audience</span>
                                                    <p className="text-sm text-gray-300 m-0">{gen.target_audience || '-'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <span className="text-[11px] text-gray-500 uppercase mb-2 block">Generated Content</span>
                                                <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                                    {Object.entries(gen.content || {}).map(([key, value]) => (
                                                        <div key={key} className="mb-2">
                                                            <span className="text-violet-400 font-medium">{key}:</span>
                                                            <div className="text-gray-300 ml-2">{typeof value === 'string' ? value.slice(0, 500) + (value.length > 500 ? '...' : '') : JSON.stringify(value)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Website Analyses List */}
            {!loading && activeTab === 'analyses' && (
                <div className="space-y-4">
                    {analyses.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No website analyses yet</p>
                            <p className="text-xs mt-2">Analyze a website in the SEO section</p>
                        </div>
                    ) : (
                        analyses.map((analysis) => {
                            const isExpanded = expandedId === analysis._id;
                            
                            return (
                                <div
                                    key={analysis._id}
                                    className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl"
                                >
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(analysis._id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                                                <Globe className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white m-0">
                                                    {analysis.website_url}
                                                </h3>
                                                <p className="text-xs text-gray-500 m-0">
                                                    {formatDate(analysis.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
                                            {analysis.title && (
                                                <div className="mb-3">
                                                    <span className="text-[11px] text-gray-500 uppercase">Title</span>
                                                    <p className="text-sm text-gray-300 m-0">{analysis.title}</p>
                                                </div>
                                            )}
                                            
                                            {analysis.description && (
                                                <div className="mb-3">
                                                    <span className="text-[11px] text-gray-500 uppercase">Meta Description</span>
                                                    <p className="text-sm text-gray-300 m-0">{analysis.description}</p>
                                                </div>
                                            )}
                                            
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <span className="text-[11px] text-gray-500 uppercase mb-2 block">SEO Analysis</span>
                                                <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                                                    {analysis.seo_analysis}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
