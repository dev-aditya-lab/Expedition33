'use client';

import { useState, useEffect } from 'react';
import { Clock, Hash, Mail, Share2, Globe, MessageSquare, RefreshCw, ChevronDown, ChevronUp, Loader2, Calendar, Image } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { getGenerationHistory, getAnalysisHistory, getHistoryStats, getSocialPosts, schedulePost, updatePostStatus } from '../api';

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState('social');
    const [generations, setGenerations] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [socialPosts, setSocialPosts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [schedulingPostId, setSchedulingPostId] = useState(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

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

    const statusColors = {
        draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        scheduled: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };

    useEffect(() => {
        loadData();
    }, [filterType]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [genData, analysisData, statsData, socialData] = await Promise.all([
                getGenerationHistory(50, filterType),
                getAnalysisHistory(50),
                getHistoryStats(),
                getSocialPosts(50)
            ]);

            setGenerations(genData.generations || []);
            setAnalyses(analysisData.analyses || []);
            setStats(statsData);
            setSocialPosts(socialData.posts || []);
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
        setSchedulingPostId(null);
    };

    const handleSchedule = async (postId) => {
        if (!scheduleDate || !scheduleTime) {
            alert('Please select both date and time');
            return;
        }

        const scheduledFor = `${scheduleDate}T${scheduleTime}:00`;
        
        try {
            await schedulePost(postId, scheduledFor);
            alert('Post scheduled successfully!');
            setSchedulingPostId(null);
            loadData();
        } catch (err) {
            alert('Error scheduling post: ' + err.message);
        }
    };

    const handleStatusChange = async (postId, newStatus) => {
        try {
            await updatePostStatus(postId, newStatus);
            loadData();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Generation History
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        View all AI-generated content, posts, and analyses
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title="Total Generations"
                        value={stats.total_generations || 0}
                        icon="hash"
                        gradient="purple"
                    />
                    <StatsCard
                        title="Social Posts"
                        value={socialPosts.length}
                        icon="share"
                        gradient="teal"
                    />
                    <StatsCard
                        title="Website Analyses"
                        value={stats.total_website_analyses || 0}
                        icon="users"
                        gradient="green"
                    />
                    <StatsCard
                        title="Scheduled"
                        value={socialPosts.filter(p => p.status === 'scheduled').length}
                        icon="mail"
                        gradient="orange"
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
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('social')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'social'
                            ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Share2 className="w-4 h-4" />
                    Social Posts ({socialPosts.length})
                </button>
                <button
                    onClick={() => setActiveTab('generations')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'generations'
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    Other Generations ({generations.length})
                </button>
                <button
                    onClick={() => setActiveTab('analyses')}
                    className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'analyses'
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Globe className="w-4 h-4" />
                    Website Analyses ({analyses.length})
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            )}

            {/* Social Posts List */}
            {!loading && activeTab === 'social' && (
                <div className="space-y-4">
                    {socialPosts.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No social posts yet</p>
                            <p className="text-xs mt-2">Generate social content to see it here</p>
                        </div>
                    ) : (
                        socialPosts.map((post) => {
                            const isExpanded = expandedId === post._id;
                            const isScheduling = schedulingPostId === post._id;
                            
                            return (
                                <div
                                    key={post._id}
                                    className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl"
                                >
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(post._id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
                                                <Share2 className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white m-0">
                                                    {post.business_name || 'Social Post'}
                                                </h3>
                                                <p className="text-xs text-gray-500 m-0">
                                                    {post.platform?.toUpperCase()} • {formatDate(post.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`py-1 px-2.5 rounded-lg text-xs font-medium border ${statusColors[post.status]}`}>
                                                {post.status}
                                            </span>
                                            {post.scheduled_for && (
                                                <span className="text-xs text-amber-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(post.scheduled_for)}
                                                </span>
                                            )}
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-[fadeIn_0.2s_ease-out]">
                                            {/* Post Image */}
                                            {post.image_url && (
                                                <div className="mb-4">
                                                    <img 
                                                        src={post.image_url} 
                                                        alt="Post image" 
                                                        className="w-full max-w-md rounded-xl"
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* Post Content */}
                                            <div className="p-4 bg-white/5 rounded-xl mb-4">
                                                <span className="text-[11px] text-gray-500 uppercase mb-2 block">Content</span>
                                                <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                                    {post.content}
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-3">
                                                {/* Schedule Button */}
                                                {post.status !== 'published' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSchedulingPostId(isScheduling ? null : post._id);
                                                        }}
                                                        className="flex items-center gap-2 py-2 px-4 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm hover:bg-amber-500/30 transition-all"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                        {isScheduling ? 'Cancel' : 'Schedule'}
                                                    </button>
                                                )}
                                                
                                                {/* Mark as Published */}
                                                {post.status !== 'published' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusChange(post._id, 'published');
                                                        }}
                                                        className="flex items-center gap-2 py-2 px-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all"
                                                    >
                                                        Mark Published
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {/* Schedule Form */}
                                            {isScheduling && (
                                                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-[fadeIn_0.2s_ease-out]">
                                                    <h4 className="text-sm font-semibold text-white mb-3">Schedule Post</h4>
                                                    <div className="flex flex-wrap gap-3 items-end">
                                                        <div>
                                                            <label className="text-xs text-gray-400 block mb-1">Date</label>
                                                            <input
                                                                type="date"
                                                                value={scheduleDate}
                                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                                className="py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-400 block mb-1">Time</label>
                                                            <input
                                                                type="time"
                                                                value={scheduleTime}
                                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                                className="py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSchedule(post._id);
                                                            }}
                                                            className="py-2 px-4 bg-amber-500 text-black text-sm font-semibold rounded-lg hover:bg-amber-400 transition-all"
                                                        >
                                                            Set Reminder
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Generations List */}
            {!loading && activeTab === 'generations' && (
                <div className="space-y-4">
                    {/* Filter by Type */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="text-xs text-gray-500 mr-2">Filter:</span>
                        {[null, 'seo', 'email', 'whatsapp', 'full'].map((type) => (
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
