'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Briefcase, Mail, Phone, FileText, Tag, Loader2, Database } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const API_URL = 'http://localhost:8000';

export default function CRMPage() {
    const [activities, setActivities] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const types = ['All', 'meeting', 'deal', 'email', 'call', 'status'];

    // Fetch data from database
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch leads
            const leadsRes = await fetch(`${API_URL}/leads`);
            if (leadsRes.ok) {
                const data = await leadsRes.json();
                setLeads(data.leads || []);
            }

            // Fetch activities
            const activitiesRes = await fetch(`${API_URL}/dashboard/activities`);
            if (activitiesRes.ok) {
                const data = await activitiesRes.json();
                setActivities(data.activities || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredActivities = activities.filter(a => selectedType === 'All' || a.type === selectedType);

    const stats = {
        totalContacts: leads.length,
        meetings: activities.filter(a => a.type === 'meeting').length,
        deals: activities.filter(a => a.type === 'deal').length,
        activities: activities.length,
    };

    const typeIcons = { meeting: Calendar, deal: Briefcase, email: Mail, note: FileText, call: Phone, status: Tag };
    const typeColors = {
        meeting: { bg: 'bg-violet-500/20', text: 'text-violet-500' },
        deal: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
        email: { bg: 'bg-cyan-500/20', text: 'text-cyan-500' },
        call: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
        note: { bg: 'bg-indigo-500/20', text: 'text-indigo-500' },
        status: { bg: 'bg-pink-500/20', text: 'text-pink-500' }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Hot': 'bg-red-500/15 text-red-500',
            'Warm': 'bg-amber-500/15 text-amber-500',
            'Cold': 'bg-blue-500/15 text-blue-500',
            'Qualified': 'bg-emerald-500/15 text-emerald-500',
            'Contacted': 'bg-violet-500/15 text-violet-500'
        };
        return colors[status] || 'bg-gray-500/15 text-gray-500';
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        CRM Updates
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        Track AI-managed customer relationships and activities
                    </p>
                </div>
                <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                    <Database className="w-4 h-4" /> Refresh Data
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                <StatsCard title="Total Contacts" value={stats.totalContacts} icon="users" gradient="purple" />
                <StatsCard title="Meetings" value={stats.meetings} icon="users" gradient="teal" />
                <StatsCard title="Active Deals" value={stats.deals} icon="dollar" gradient="green" />
                <StatsCard title="Activities" value={stats.activities} icon="trending" gradient="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4 lg:gap-6">
                <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
                        <h3 className="text-base sm:text-lg font-semibold text-white m-0">Activity Timeline</h3>
                        <div className="flex flex-wrap gap-2">
                            {types.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`py-1.5 px-3 rounded-lg text-xs cursor-pointer transition-all capitalize ${selectedType === type
                                            ? 'bg-violet-500/20 border border-violet-500/40 text-white'
                                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                        </div>
                    ) : filteredActivities.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredActivities.map((activity, index) => {
                                const IconComponent = typeIcons[activity.type] || FileText;
                                const colors = typeColors[activity.type] || typeColors.note;
                                return (
                                    <div
                                        key={activity.id || index}
                                        className="flex gap-3 sm:gap-4 relative animate-[fadeIn_0.5s_ease-out_forwards]"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {index < filteredActivities.length - 1 && (
                                            <div className="absolute left-[19px] top-10 w-0.5 h-[calc(100%+16px)] bg-white/10" />
                                        )}
                                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 z-[1]`}>
                                            <IconComponent className={`w-[18px] h-[18px] ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl p-3 sm:p-4">
                                            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                                <div>
                                                    <span className="text-sm sm:text-[15px] font-semibold text-white">{activity.contact}</span>
                                                    {activity.company && (
                                                        <span className="text-xs sm:text-[13px] text-gray-500 ml-2">• {activity.company}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                                            </div>
                                            <div className={`text-sm ${colors.text} mb-1.5`}>{activity.action}</div>
                                            <p className="text-xs sm:text-[13px] text-gray-400 m-0">{activity.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-sm">No activities yet</p>
                            <p className="text-xs">Import leads and send emails to see activity here</p>
                        </div>
                    )}
                </div>

                <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl h-fit">
                    <h3 className="text-sm sm:text-base font-semibold text-white m-0 mb-5">Recent Contacts</h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                        </div>
                    ) : leads.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {leads.slice(0, 5).map((lead) => (
                                <div key={lead.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-semibold text-sm text-white">
                                        {lead.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-white truncate">{lead.name}</div>
                                        <div className="text-xs text-gray-500">{lead.company}</div>
                                    </div>
                                    <div className={`py-1 px-2 rounded-md text-[11px] font-semibold ${getStatusColor(lead.status)}`}>
                                        {lead.status || 'New'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No contacts yet</p>
                            <p className="text-xs">Import leads to see them here</p>
                        </div>
                    )}
                </div>
            </div>
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
