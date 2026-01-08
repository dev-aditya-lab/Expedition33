'use client';

import { useState, useEffect } from 'react';
import { Mail, Loader2, Send, Users, RefreshCw, CheckCircle2, XCircle, Zap } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function EmailCampaign() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingLeads, setFetchingLeads] = useState(false);
    const [results, setResults] = useState(null);
    const [businessContext, setBusinessContext] = useState('AI Marketing Automation Platform - helping businesses grow with intelligent marketing');
    const [maxEmails, setMaxEmails] = useState(10);
    const [dryRun, setDryRun] = useState(true);

    // Fetch eligible leads
    const fetchEligibleLeads = async () => {
        setFetchingLeads(true);
        try {
            const response = await fetch(`${API_URL}/leads/email-eligible`);
            if (response.ok) {
                const data = await response.json();
                setLeads(data.eligible_leads || []);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setFetchingLeads(false);
        }
    };

    useEffect(() => {
        fetchEligibleLeads();
    }, []);

    // Run AI email campaign
    const runCampaign = async () => {
        setLoading(true);
        setResults(null);
        try {
            const response = await fetch(
                `${API_URL}/leads/ai-email-campaign?max_emails=${maxEmails}&dry_run=${dryRun}&business_context=${encodeURIComponent(businessContext)}`,
                { method: 'POST' }
            );
            if (response.ok) {
                const data = await response.json();
                setResults(data);
                if (!dryRun) {
                    // Refresh leads after sending
                    await fetchEligibleLeads();
                }
            }
        } catch (error) {
            console.error('Error running campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            hot: 'bg-red-500/20 text-red-400 border-red-500/30',
            warm: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            cool: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
            cold: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white m-0">AI Email Campaign</h3>
                        <p className="text-xs text-gray-500 m-0">{leads.length} leads eligible for email</p>
                    </div>
                </div>
                <button
                    onClick={fetchEligibleLeads}
                    disabled={fetchingLeads}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${fetchingLeads ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Configuration */}
            <div className="space-y-4 mb-5">
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Business Context (for AI personalization)</label>
                    <textarea
                        value={businessContext}
                        onChange={(e) => setBusinessContext(e.target.value)}
                        rows={2}
                        className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 outline-none focus:border-violet-500/50 resize-none"
                        placeholder="Describe your business for AI to personalize emails..."
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs text-gray-400 mb-2">Max Emails</label>
                        <input
                            type="number"
                            value={maxEmails}
                            onChange={(e) => setMaxEmails(parseInt(e.target.value) || 10)}
                            min={1}
                            max={50}
                            className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/50"
                        />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs text-gray-400 mb-2">Mode</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDryRun(true)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                    dryRun 
                                        ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400' 
                                        : 'bg-white/5 border border-white/10 text-gray-400'
                                }`}
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => setDryRun(false)}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                                    !dryRun 
                                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                                        : 'bg-white/5 border border-white/10 text-gray-400'
                                }`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Preview */}
            {leads.length > 0 && !results && (
                <div className="mb-5">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wide mb-3">Target Leads (by score)</h4>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                        {leads.slice(0, 15).map((lead) => (
                            <div
                                key={lead.id}
                                className={`py-1.5 px-3 rounded-lg text-xs border ${getPriorityColor(lead.priority)}`}
                            >
                                <span className="font-medium">{lead.name}</span>
                                <span className="opacity-60 ml-1">• {lead.company}</span>
                                <span className="ml-2 opacity-80">{lead.score}</span>
                            </div>
                        ))}
                        {leads.length > 15 && (
                            <div className="py-1.5 px-3 rounded-lg text-xs bg-white/5 text-gray-400">
                                +{leads.length - 15} more
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Run Campaign Button */}
            <button
                onClick={runCampaign}
                disabled={loading || leads.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating personalized emails with AI...
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4" />
                        {dryRun ? 'Preview AI-Generated Emails' : 'Send AI-Generated Emails'}
                    </>
                )}
            </button>

            {/* Results */}
            {results && (
                <div className="mt-5 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {results.success ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm font-medium text-white">{results.message}</span>
                        </div>
                        {results.dry_run && (
                            <span className="py-1 px-2 bg-amber-500/20 text-amber-400 text-xs rounded-lg">Preview Mode</span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                            <div className="text-lg font-bold text-white">{results.total_eligible}</div>
                            <div className="text-xs text-gray-500">Eligible</div>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                            <div className="text-lg font-bold text-emerald-400">{results.emails_sent}</div>
                            <div className="text-xs text-gray-500">{results.dry_run ? 'Generated' : 'Sent'}</div>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg text-center">
                            <div className="text-lg font-bold text-red-400">{results.emails_failed}</div>
                            <div className="text-xs text-gray-500">Failed</div>
                        </div>
                    </div>

                    {/* Email Previews */}
                    {results.results && results.results.length > 0 && (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {results.results.map((result, idx) => (
                                <div key={idx} className="p-3 bg-white/5 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`py-0.5 px-2 rounded-full text-xs ${getPriorityColor(result.priority)}`}>
                                                {result.priority}
                                            </span>
                                            <span className="text-sm font-medium text-white">{result.lead_name}</span>
                                            <span className="text-xs text-gray-500">• {result.company}</span>
                                        </div>
                                        {result.success ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mb-1">To: {result.lead_email}</div>
                                    {result.subject && (
                                        <div className="text-sm text-violet-400 font-medium mb-2">📧 {result.subject}</div>
                                    )}
                                    {result.body_preview && (
                                        <div className="text-xs text-gray-300 bg-black/20 p-2 rounded-lg whitespace-pre-wrap">
                                            {result.body_preview}
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-2">{result.message}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
