'use client';

import { useState } from 'react';
import { Plus, Calendar, Loader2, Send, RefreshCw } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { emailCampaigns } from '../data/mockData';
import { generateEmail, sendEmail } from '../api';

export default function EmailPage() {
    const [campaigns] = useState(emailCampaigns);
    const [selectedTab, setSelectedTab] = useState('All');
    const tabs = ['All', 'Active', 'Scheduled', 'Draft', 'Completed'];

    // New state for AI generation
    const [showGenerator, setShowGenerator] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState(null);
    const [businessName, setBusinessName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState(null);

    const filteredCampaigns = campaigns.filter(campaign => selectedTab === 'All' || campaign.status === selectedTab);

    const stats = {
        totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
        avgOpenRate: campaigns.filter(c => c.sent > 0).length > 0
            ? Math.round(campaigns.filter(c => c.sent > 0).reduce((sum, c) => sum + (c.opened / c.sent * 100), 0) / campaigns.filter(c => c.sent > 0).length) : 0,
        avgClickRate: campaigns.filter(c => c.opened > 0).length > 0
            ? Math.round(campaigns.filter(c => c.opened > 0).reduce((sum, c) => sum + (c.clicked / c.opened * 100), 0) / campaigns.filter(c => c.opened > 0).length) : 0,
        totalReplies: campaigns.reduce((sum, c) => sum + c.replied, 0),
    };

    const getStatusColor = (status) => {
        const colors = { Active: 'bg-emerald-500', Scheduled: 'bg-violet-500', Draft: 'bg-gray-500', Completed: 'bg-cyan-500' };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusTextColor = (status) => {
        const colors = { Active: 'text-emerald-500', Scheduled: 'text-violet-500', Draft: 'text-gray-500', Completed: 'text-cyan-500' };
        return colors[status] || 'text-gray-500';
    };

    const handleGenerate = async () => {
        if (!businessName || !productDescription || !targetAudience) return;
        
        setGenerating(true);
        setGeneratedEmail(null);
        
        try {
            const result = await generateEmail({
                businessName,
                productDescription,
                targetAudience
            });
            setGeneratedEmail(result.content);
        } catch (error) {
            alert('Error generating email: ' + error.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleSendEmail = async () => {
        if (!recipientEmail || !generatedEmail) return;
        
        setSending(true);
        setSendResult(null);
        
        try {
            const result = await sendEmail({
                businessName,
                productDescription,
                targetAudience,
                recipientEmail
            });
            setSendResult(result);
        } catch (error) {
            setSendResult({ success: false, message: error.message });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Email Marketing
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        AI-powered email campaigns and automation
                    </p>
                </div>
                <button 
                    onClick={() => setShowGenerator(!showGenerator)}
                    className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                    <Plus className="w-4 h-4" /> {showGenerator ? 'Close' : 'Create Campaign'}
                </button>
            </header>

            {/* AI Email Generator */}
            {showGenerator && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-violet-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6 animate-[fadeIn_0.3s_ease-out]">
                    <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Email Generator</h3>
                    
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

                    <button
                        onClick={handleGenerate}
                        disabled={generating || !businessName || !productDescription || !targetAudience}
                        className="flex items-center gap-2 py-2.5 px-5 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-400 text-sm font-semibold cursor-pointer hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" /> Generate Email Content
                            </>
                        )}
                    </button>

                    {/* Generated Email Display */}
                    {generatedEmail && (
                        <div className="mt-4 p-4 bg-white/5 rounded-xl">
                            <h4 className="text-sm font-semibold text-white mb-3">Generated Email:</h4>
                            <div className="text-sm text-gray-300 whitespace-pre-wrap mb-4 max-h-[300px] overflow-y-auto">
                                {generatedEmail}
                            </div>

                            {/* Send Email Section */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="Recipient email address"
                                    className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-cyan-500"
                                />
                                <button
                                    onClick={handleSendEmail}
                                    disabled={sending || !recipientEmail}
                                    className="flex items-center gap-2 py-2.5 px-5 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-400 text-sm font-semibold cursor-pointer hover:bg-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Send Email
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Send Result */}
                            {sendResult && (
                                <div className={`mt-3 p-3 rounded-lg text-sm ${sendResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {sendResult.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                <StatsCard title="Emails Sent" value={stats.totalSent.toLocaleString()} icon="mail" gradient="purple" />
                <StatsCard title="Avg Open Rate" value={`${stats.avgOpenRate}%`} icon="mail" gradient="teal" />
                <StatsCard title="Avg Click Rate" value={`${stats.avgClickRate}%`} icon="trending" gradient="green" />
                <StatsCard title="Total Replies" value={stats.totalReplies} icon="mail" gradient="orange" />
            </div>

            <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`flex items-center gap-2 py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl text-sm cursor-pointer transition-all ${selectedTab === tab
                                ? 'bg-violet-500/20 border border-violet-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {tab}
                        {tab !== 'All' && (
                            <span className="py-0.5 px-2 bg-white/10 rounded-lg text-xs">
                                {campaigns.filter(c => c.status === tab).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-[13px] font-semibold">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)} shadow-lg`} />
                                <span className={getStatusTextColor(campaign.status)}>{campaign.status}</span>
                            </div>
                            <button className="bg-transparent border-none text-gray-500 text-xl cursor-pointer hover:text-white">⋮</button>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white m-0 mb-2">{campaign.name}</h3>
                        <p className="text-sm text-gray-400 m-0 mb-4 leading-relaxed">{campaign.subject}</p>

                        {campaign.scheduledDate && (
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{campaign.scheduledDate}</span>
                            </div>
                        )}

                        {campaign.sent > 0 && (
                            <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-xl mb-4">
                                <div className="text-center">
                                    <span className="block text-base sm:text-lg font-bold text-white mb-1">{campaign.sent.toLocaleString()}</span>
                                    <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase">Sent</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-base sm:text-lg font-bold text-white mb-1">{Math.round(campaign.opened / campaign.sent * 100)}%</span>
                                    <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase">Opened</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-base sm:text-lg font-bold text-white mb-1">{Math.round(campaign.clicked / campaign.opened * 100)}%</span>
                                    <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase">Clicked</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-base sm:text-lg font-bold text-white mb-1">{campaign.replied}</span>
                                    <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase">Replied</span>
                                </div>
                            </div>
                        )}

                        <button className="w-full py-2.5 px-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-[13px] cursor-pointer hover:bg-white/10 transition-all">
                            {campaign.status === 'Draft' ? 'Edit Draft' : campaign.status === 'Scheduled' ? 'View Details' : 'View Report'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
