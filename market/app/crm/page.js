'use client';

import { useState } from 'react';
import { Plus, Users, Calendar, Briefcase, Activity, Mail, Phone, FileText, Tag } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { crmActivities, leadsData } from '../data/mockData';

export default function CRMPage() {
    const [activities] = useState(crmActivities);
    const [selectedType, setSelectedType] = useState('All');
    const types = ['All', 'meeting', 'deal', 'email', 'call'];

    const filteredActivities = activities.filter(a => selectedType === 'All' || a.type === selectedType);

    const stats = {
        totalContacts: leadsData.length,
        meetings: activities.filter(a => a.type === 'meeting').length,
        deals: activities.filter(a => a.type === 'deal').length,
        activities: activities.length,
    };

    const typeIcons = { meeting: Calendar, deal: Briefcase, email: Mail, note: FileText, call: Phone, status: Tag };
    const typeColors = { meeting: '#8b5cf6', deal: '#10b981', email: '#06b6d4', call: '#f59e0b', note: '#6366f1', status: '#ec4899' };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CRM Updates</h1>
                    <p style={{ fontSize: '15px', color: 'rgba(240,240,245,0.6)', margin: 0 }}>Track AI-managed customer relationships and activities</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><Plus size={16} /> Add Activity</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatsCard title="Total Contacts" value={stats.totalContacts} icon="users" gradient="purple" />
                <StatsCard title="Meetings" value={stats.meetings} icon="users" gradient="teal" />
                <StatsCard title="Active Deals" value={stats.deals} icon="dollar" gradient="green" />
                <StatsCard title="Activities" value={stats.activities} icon="trending" gradient="orange" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                <div style={{ background: 'rgba(20,22,35,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#fff' }}>Activity Timeline</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {types.map((type) => (
                                <button key={type} onClick={() => setSelectedType(type)} style={{ padding: '6px 12px', background: selectedType === type ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedType === type ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', color: selectedType === type ? '#fff' : 'rgba(240,240,245,0.6)', fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize' }}>{type}</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredActivities.map((activity, index) => {
                            const IconComponent = typeIcons[activity.type] || FileText;
                            return (
                                <div key={activity.id} style={{ display: 'flex', gap: '16px', position: 'relative', animation: 'fadeIn 0.5s ease-out forwards', animationDelay: `${index * 0.1}s` }}>
                                    {index < filteredActivities.length - 1 && <div style={{ position: 'absolute', left: '19px', top: '40px', width: '2px', height: 'calc(100% + 16px)', background: 'rgba(255,255,255,0.08)' }} />}
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${typeColors[activity.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                                        <IconComponent size={18} color={typeColors[activity.type]} />
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div><span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{activity.contact}</span><span style={{ fontSize: '13px', color: 'rgba(240,240,245,0.5)', marginLeft: '8px' }}>• {activity.company}</span></div>
                                            <span style={{ fontSize: '12px', color: 'rgba(240,240,245,0.4)' }}>{formatTime(activity.timestamp)}</span>
                                        </div>
                                        <div style={{ fontSize: '14px', color: typeColors[activity.type], marginBottom: '6px' }}>{activity.action}</div>
                                        <p style={{ fontSize: '13px', color: 'rgba(240,240,245,0.7)', margin: 0 }}>{activity.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ background: 'rgba(20,22,35,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)', height: 'fit-content' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0', color: '#fff' }}>Recent Contacts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leadsData.slice(0, 5).map((lead) => (
                            <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>{lead.name.charAt(0)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(240,240,245,0.5)' }}>{lead.company}</div>
                                </div>
                                <div style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: lead.status === 'Hot' ? 'rgba(239,68,68,0.15)' : 'rgba(139,92,246,0.15)', color: lead.status === 'Hot' ? '#ef4444' : '#8b5cf6' }}>{lead.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
