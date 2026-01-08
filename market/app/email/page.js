'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Loader2, Send, RefreshCw, Users, Database, CheckCircle2, XCircle, Zap, Mail } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { generateEmail, sendEmail } from '../api';

const API_URL = 'http://localhost:8000';

export default function EmailPage() {
    // Email campaigns would come from database - currently empty until DB integration
    const [campaigns, setCampaigns] = useState([]);
    const [selectedTab, setSelectedTab] = useState('All');
    const tabs = ['All', 'Active', 'Scheduled', 'Draft', 'Completed'];

    // State for AI generation
    const [showGenerator, setShowGenerator] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState(null);
    const [businessName, setBusinessName] = useState('Your Business');
    const [productDescription, setProductDescription] = useState('AI Marketing Automation Platform');
    const [targetAudience, setTargetAudience] = useState('Business owners and marketers');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState(null);

    // State for leads from DB and auto-send
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [showLeadsList, setShowLeadsList] = useState(false);
    const [autoSending, setAutoSending] = useState(false);
    const [autoSendResults, setAutoSendResults] = useState(null);
    const [emailHistory, setEmailHistory] = useState([]);

    const filteredCampaigns = campaigns.filter(campaign => selectedTab === 'All' || campaign.status === selectedTab);

    // Fetch email history on mount
    useEffect(() => {
        fetchEmailHistory();
    }, []);

    const fetchEmailHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/leads/email-history?limit=20`);
            if (response.ok) {
                const data = await response.json();
                setEmailHistory(data.history || []);
            }
        } catch (error) {
            console.error('Error fetching email history:', error);
        }
    };

    const stats = {
        totalSent: emailHistory.length,
        successfulSent: emailHistory.filter(e => e.success).length,
        failedSent: emailHistory.filter(e => !e.success).length,
        leadsLoaded: leads.length,
    };

    const getStatusColor = (status) => {
        const colors = { Active: 'bg-emerald-500', Scheduled: 'bg-violet-500', Draft: 'bg-gray-500', Completed: 'bg-cyan-500' };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusTextColor = (status) => {
        const colors = { Active: 'text-emerald-500', Scheduled: 'text-violet-500', Draft: 'text-gray-500', Completed: 'text-cyan-500' };
        return colors[status] || 'text-gray-500';
    };

    // Fetch leads from database AND automatically send emails
    const fetchAndSendEmails = async () => {
        setLoadingLeads(true);
        setAutoSending(true);
        setAutoSendResults(null);
        
        try {
            // Step 1: Fetch leads from database
            const leadsResponse = await fetch(`${API_URL}/leads`);
            if (!leadsResponse.ok) {
                throw new Error('Failed to fetch leads');
            }
            
            const leadsData = await leadsResponse.json();
            const fetchedLeads = leadsData.leads || [];
            setLeads(fetchedLeads);
            setShowLeadsList(true);
            
            if (fetchedLeads.length === 0) {
                setAutoSendResults({
                    success: false,
                    message: 'No leads found in database. Import leads first!',
                    emails_sent: 0,
                    emails_failed: 0
                });
                return;
            }
            
            // Step 2: Automatically send AI-personalized emails to all leads
            const businessContext = `${businessName}: ${productDescription} targeting ${targetAudience}`;
            
            const emailResponse = await fetch(
                `${API_URL}/leads/ai-email-campaign?max_emails=${fetchedLeads.length}&dry_run=false&business_context=${encodeURIComponent(businessContext)}`,
                { method: 'POST' }
            );
            
            if (emailResponse.ok) {
                const emailData = await emailResponse.json();
                setAutoSendResults(emailData);
                
                // Refresh email history
                await fetchEmailHistory();
            } else {
                setAutoSendResults({
                    success: false,
                    message: 'Failed to send emails. Check Gmail credentials in .env',
                    emails_sent: 0,
                    emails_failed: 0
                });
            }
            
        } catch (error) {
            console.error('Error:', error);
            setAutoSendResults({
                success: false,
                message: error.message,
                emails_sent: 0,
                emails_failed: 0
            });
        } finally {
            setLoadingLeads(false);
            setAutoSending(false);
        }
    };

    // Preview emails without sending (dry run)
    const previewEmails = async () => {
        setLoadingLeads(true);
        setAutoSending(true);
        setAutoSendResults(null);
        
        try {
            // Fetch leads first
            const leadsResponse = await fetch(`${API_URL}/leads`);
            if (leadsResponse.ok) {
                const leadsData = await leadsResponse.json();
                setLeads(leadsData.leads || []);
                setShowLeadsList(true);
            }
            
            // Run dry run
            const businessContext = `${businessName}: ${productDescription} targeting ${targetAudience}`;
            const response = await fetch(
                `${API_URL}/leads/ai-email-campaign?max_emails=50&dry_run=true&business_context=${encodeURIComponent(businessContext)}`,
                { method: 'POST' }
            );
            
            if (response.ok) {
                const data = await response.json();
                setAutoSendResults(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadingLeads(false);
            setAutoSending(false);
        }
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
                        AI-powered email campaigns with automatic personalization
                    </p>
                </div>
                <button 
                    onClick={() => setShowGenerator(!showGenerator)}
                    className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                    <Plus className="w-4 h-4" /> {showGenerator ? 'Close' : 'Manual Email'}
                </button>
            </header>

            {/* Auto-Send Section - Main Feature */}
            <div className="bg-[rgba(20,22,35,0.8)] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white m-0">🚀 Auto-Send AI Emails</h3>
                            <p className="text-xs text-gray-400 m-0">Fetch leads from DB & send personalized emails automatically</p>
                        </div>
                    </div>
                </div>

                {/* Business Context Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Your business name"
                            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Product/Service</label>
                        <input
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="What you offer"
                            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Target Audience</label>
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Who you're targeting"
                            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={previewEmails}
                        disabled={autoSending}
                        className="flex items-center gap-2 py-3 px-6 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-semibold cursor-pointer hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        {autoSending && !autoSendResults ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                        ) : (
                            <><Database className="w-4 h-4" /> Preview Emails (Dry Run)</>
                        )}
                    </button>
                    <button
                        onClick={fetchAndSendEmails}
                        disabled={autoSending}
                        className="flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-emerald-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
                    >
                        {autoSending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending Emails...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Import Leads & Send Emails</>
                        )}
                    </button>
                </div>

                {/* Auto-Send Results */}
                {autoSendResults && (
                    <div className={`mt-5 p-4 rounded-xl border ${autoSendResults.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            {autoSendResults.success ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <span className={`font-semibold ${autoSendResults.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                {autoSendResults.message}
                            </span>
                            {autoSendResults.dry_run && (
                                <span className="py-1 px-2 bg-amber-500/20 text-amber-400 text-xs rounded-lg ml-auto">Preview Mode</span>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-black/20 rounded-lg">
                                <div className="text-xl font-bold text-white">{autoSendResults.total_eligible || 0}</div>
                                <div className="text-xs text-gray-500">Leads Found</div>
                            </div>
                            <div className="text-center p-3 bg-black/20 rounded-lg">
                                <div className="text-xl font-bold text-emerald-400">{autoSendResults.emails_sent || 0}</div>
                                <div className="text-xs text-gray-500">{autoSendResults.dry_run ? 'Would Send' : 'Sent'}</div>
                            </div>
                            <div className="text-center p-3 bg-black/20 rounded-lg">
                                <div className="text-xl font-bold text-red-400">{autoSendResults.emails_failed || 0}</div>
                                <div className="text-xs text-gray-500">Failed</div>
                            </div>
                        </div>

                        {/* Individual Results */}
                        {autoSendResults.results && autoSendResults.results.length > 0 && (
                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                {autoSendResults.results.map((result, idx) => (
                                    <div key={idx} className="p-3 bg-black/20 rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                <span className="text-sm font-medium text-white">{result.lead_name}</span>
                                                <span className="text-xs text-gray-500">• {result.company}</span>
                                            </div>
                                            <span className={`text-xs ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                                Score: {result.score}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">{result.lead_email}</div>
                                        {result.subject && (
                                            <div className="text-xs text-violet-400 mt-1">📧 {result.subject}</div>
                                        )}
                                        {result.body_preview && (
                                            <div className="text-xs text-gray-300 mt-2 p-2 bg-black/30 rounded-lg whitespace-pre-wrap line-clamp-3">
                                                {result.body_preview}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stats from Email History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                <StatsCard title="Leads in DB" value={leads.length || '—'} icon="users" gradient="purple" />
                <StatsCard title="Emails Sent" value={stats.totalSent} icon="mail" gradient="teal" />
                <StatsCard title="Successful" value={stats.successfulSent} icon="trending" gradient="green" />
                <StatsCard title="Failed" value={stats.failedSent} icon="mail" gradient="orange" />
            </div>

            {/* Email History */}
            {emailHistory.length > 0 && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-white m-0">📧 Recent Email History</h3>
                        <button
                            onClick={fetchEmailHistory}
                            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                        >
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {emailHistory.map((email, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${email.success ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-white truncate">{email.lead_email}</div>
                                    <div className="text-xs text-gray-500 truncate">{email.subject}</div>
                                </div>
                                <div className="text-xs text-gray-500">{formatTime(email.sent_at)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Manual Email Generator (collapsed by default) */}
            {showGenerator && (
                <div className="bg-[rgba(20,22,35,0.8)] border border-violet-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl mb-6 animate-[fadeIn_0.3s_ease-out]">
                    <h3 className="text-lg font-semibold text-white mb-4">🤖 Manual Email Generator</h3>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !businessName || !productDescription || !targetAudience}
                        className="flex items-center gap-2 py-2.5 px-5 bg-violet-500/20 border border-violet-500/40 rounded-xl text-violet-400 text-sm font-semibold cursor-pointer hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                        {generating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                        ) : (
                            <><RefreshCw className="w-4 h-4" /> Generate Email Content</>
                        )}
                    </button>

                    {generatedEmail && (
                        <div className="mt-4 p-4 bg-white/5 rounded-xl">
                            <h4 className="text-sm font-semibold text-white mb-3">Generated Email:</h4>
                            <div className="text-sm text-gray-300 whitespace-pre-wrap mb-4 max-h-[300px] overflow-y-auto">
                                {generatedEmail}
                            </div>

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
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send className="w-4 h-4" /> Send Email</>
                                    )}
                                </button>
                            </div>

                            {sendResult && (
                                <div className={`mt-3 p-3 rounded-lg text-sm ${sendResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {sendResult.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
