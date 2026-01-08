'use client';

import { useState } from 'react';
import { Plus, Eye, Heart, MessageCircle, Repeat2, Calendar, Loader2, Image, RefreshCw, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { generateSocial } from '../api';

export default function SocialPage() {
    // Social posts would come from database - currently empty until DB integration
    const [posts, setPosts] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const platforms = ['All', 'LinkedIn', 'Instagram'];

    // New state for AI generation
    const [showGenerator, setShowGenerator] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const [businessName, setBusinessName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [generateImage, setGenerateImage] = useState(true);
    const [manualSchedule, setManualSchedule] = useState(true);  // If false, auto-schedule
    
    // For preview extraction
    const [instagramCaption, setInstagramCaption] = useState('');
    const [instagramHashtags, setInstagramHashtags] = useState('');

    const filteredPosts = posts.filter(post => selectedPlatform === 'All' || post.platform === selectedPlatform);

    const stats = {
        totalReach: posts.reduce((sum, p) => sum + p.reach, 0),
        totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
        totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
        totalShares: posts.reduce((sum, p) => sum + p.shares, 0),
    };

    const getStatusClasses = (status) => {
        const map = {
            Published: 'bg-emerald-500/15 text-emerald-500',
            Scheduled: 'bg-violet-500/15 text-violet-500',
            Draft: 'bg-gray-500/15 text-gray-400',
        };
        return map[status] || map.Draft;
    };

    // Extract Instagram caption and hashtags from generated content
    const parseInstagramContent = (content) => {
        const lines = content.split('\n');
        let caption = '';
        let hashtags = '';
        let isInstagramSection = false;
        let captureCaption = false;
        let captureHashtags = false;

        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            
            if (lowerLine.includes('instagram')) {
                isInstagramSection = true;
                continue;
            }
            
            if (isInstagramSection && lowerLine.includes('linkedin')) {
                break; // Stop when we reach LinkedIn section
            }
            
            if (isInstagramSection) {
                if (lowerLine.includes('caption') || lowerLine.includes('post')) {
                    captureCaption = true;
                    captureHashtags = false;
                    continue;
                }
                if (lowerLine.includes('hashtag')) {
                    captureHashtags = true;
                    captureCaption = false;
                    continue;
                }
                if (lowerLine.includes('cta') || lowerLine.includes('call-to-action') || lowerLine.includes('call to action')) {
                    captureCaption = false;
                    captureHashtags = false;
                }
                
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('**') && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('-')) {
                    if (captureCaption && !trimmedLine.startsWith('#')) {
                        caption += trimmedLine + '\n';
                    }
                }
                
                // Capture hashtags
                const hashtagMatch = line.match(/#\w+/g);
                if (hashtagMatch) {
                    hashtags += hashtagMatch.join(' ') + ' ';
                }
            }
        }

        // Fallback: just get first part of content and any hashtags
        if (!caption.trim()) {
            const allLines = content.split('\n').filter(l => l.trim() && !l.startsWith('**') && !l.startsWith('#'));
            caption = allLines.slice(0, 3).join('\n');
        }
        if (!hashtags.trim()) {
            const allHashtags = content.match(/#\w+/g);
            if (allHashtags) {
                hashtags = allHashtags.slice(0, 10).join(' ');
            }
        }

        return { caption: caption.trim(), hashtags: hashtags.trim() };
    };

    const handleGenerate = async () => {
        if (!businessName || !productDescription || !targetAudience) return;
        
        setGenerating(true);
        setGeneratedContent(null);
        setGeneratedImageUrl(null);
        setInstagramCaption('');
        setInstagramHashtags('');
        
        try {
            const result = await generateSocial({
                businessName,
                productDescription,
                targetAudience,
                platform: 'instagram',
                generateImage: generateImage,
                manualSchedule: manualSchedule
            });
            setGeneratedContent(result.content);
            
            // Parse Instagram content
            const parsed = parseInstagramContent(result.content);
            setInstagramCaption(parsed.caption);
            setInstagramHashtags(parsed.hashtags);
            
            if (result.image_url) {
                setGeneratedImageUrl(result.image_url);
            }
        } catch (error) {
            alert('Error generating social content: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Social Media
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        Schedule and manage AI-generated social content
                    </p>
                </div>
                <button
                    onClick={() => setShowGenerator(!showGenerator)}
                    className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                    <Plus className="w-4 h-4" /> {showGenerator ? 'Close' : 'Create Post'}
                </button>
            </header>

            {/* AI Social Generator */}
            {showGenerator && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-violet-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6 animate-[fadeIn_0.3s_ease-out]">
                    <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Social Media Generator</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Business name"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                        />
                        <input
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Product/Service description"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                        />
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Target audience"
                            className="py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                        />
                    </div>

                    {/* Generate Image Toggle */}
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={generateImage}
                            onChange={(e) => setGenerateImage(e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                            <Image className="w-4 h-4" /> Generate AI image (FREE with Pollinations.ai)
                        </span>
                    </label>

                    {/* Manual Schedule Toggle */}
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={manualSchedule}
                            onChange={(e) => setManualSchedule(e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> I'll schedule it manually
                        </span>
                    </label>
                    
                    {!manualSchedule && (
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <p className="text-xs text-amber-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Post will be auto-scheduled at the optimal time (based on engagement data or 7am-10pm slots)
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={generating || !businessName || !productDescription || !targetAudience}
                        className="flex items-center gap-2 py-2.5 px-5 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-400 text-sm font-semibold cursor-pointer hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating{generateImage ? ' (with image)' : ''}...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" /> Generate Social Posts
                            </>
                        )}
                    </button>

                    {/* Generated Content Display */}
                    {generatedContent && (
                        <div className="mt-6">
                            {/* Instagram Preview */}
                            {generatedImageUrl && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        📱 Instagram Post Preview
                                    </h4>
                                    
                                    {/* Instagram Phone Frame */}
                                    <div className="max-w-[400px] mx-auto">
                                        <div className="bg-black rounded-3xl p-3 shadow-2xl">
                                            {/* Phone notch */}
                                            <div className="w-20 h-6 bg-black rounded-b-xl mx-auto mb-2"></div>
                                            
                                            {/* Instagram Post */}
                                            <div className="bg-white rounded-2xl overflow-hidden">
                                                {/* Post Header */}
                                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                            {businessName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900 m-0">{businessName.toLowerCase().replace(/\s+/g, '')}</p>
                                                            <p className="text-[11px] text-gray-500 m-0">Sponsored</p>
                                                        </div>
                                                    </div>
                                                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                                </div>
                                                
                                                {/* Post Image */}
                                                <div className="aspect-square bg-gray-100">
                                                    <img 
                                                        src={generatedImageUrl}
                                                        alt="Generated post"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="p-3">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-4">
                                                            <Heart className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-500 transition-colors" />
                                                            <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer" />
                                                            <Send className="w-6 h-6 text-gray-800 cursor-pointer" />
                                                        </div>
                                                        <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer" />
                                                    </div>
                                                    
                                                    {/* Likes */}
                                                    <p className="text-sm font-semibold text-gray-900 mb-2">1,234 likes</p>
                                                    
                                                    {/* Caption */}
                                                    <div className="text-sm text-gray-900">
                                                        <span className="font-semibold">{businessName.toLowerCase().replace(/\s+/g, '')} </span>
                                                        <span className="whitespace-pre-wrap">{instagramCaption.slice(0, 150)}{instagramCaption.length > 150 ? '...' : ''}</span>
                                                    </div>
                                                    
                                                    {/* Hashtags */}
                                                    {instagramHashtags && (
                                                        <p className="text-sm text-blue-600 mt-1">
                                                            {instagramHashtags.slice(0, 100)}{instagramHashtags.length > 100 ? '...' : ''}
                                                        </p>
                                                    )}
                                                    
                                                    {/* Time */}
                                                    <p className="text-[11px] text-gray-400 mt-2 uppercase">Just now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Full Generated Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Generated Posts Text */}
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <h4 className="text-sm font-semibold text-white mb-3">📝 Full Generated Content:</h4>
                                    <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                                        {generatedContent}
                                    </div>
                                </div>

                                {/* Generated Image (if available) */}
                                {generatedImageUrl && (
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <h4 className="text-sm font-semibold text-white mb-3">🖼️ Generated Image:</h4>
                                        <img 
                                            src={generatedImageUrl} 
                                            alt="AI Generated Marketing Image"
                                            className="w-full rounded-lg"
                                        />
                                        <a 
                                            href={generatedImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-xs text-violet-400 hover:text-violet-300"
                                        >
                                            Open full size image →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                <StatsCard title="Total Reach" value={`${(stats.totalReach / 1000).toFixed(1)}K`} icon="share" gradient="purple" />
                <StatsCard title="Total Likes" value={stats.totalLikes} icon="users" gradient="teal" />
                <StatsCard title="Comments" value={stats.totalComments} icon="mail" gradient="green" />
                <StatsCard title="Shares" value={stats.totalShares} icon="share" gradient="orange" />
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
                {platforms.map((platform) => (
                    <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl text-sm cursor-pointer transition-all ${selectedPlatform === platform
                                ? 'bg-violet-500/20 border border-violet-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {platform}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[13px] text-gray-300">{post.platform}</span>
                            <span className={`py-1 px-2.5 rounded-xl text-xs font-semibold ${getStatusClasses(post.status)}`}>
                                {post.status}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-200 m-0 mb-4">{post.content}</p>

                        {post.scheduledDate && (
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{post.scheduledDate}</span>
                            </div>
                        )}

                        {post.reach > 0 && (
                            <div className="flex gap-4 p-3 bg-white/5 rounded-xl text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {(post.reach/1000).toFixed(1)}K</span>
                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {post.comments}</span>
                                <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> {post.shares}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
