'use client';

import { useState } from 'react';
import { Plus, Calendar, Mail, MousePointer, MessageSquare } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { emailCampaigns } from '../data/mockData';

export default function EmailPage() {
    const [campaigns] = useState(emailCampaigns);
    const [selectedTab, setSelectedTab] = useState('All');
    const tabs = ['All', 'Active', 'Scheduled', 'Draft', 'Completed'];

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
        const colors = { Active: '#10b981', Scheduled: '#8b5cf6', Draft: '#6b7280', Completed: '#06b6d4' };
        return colors[status] || '#6b7280';
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Email Marketing</h1>
                    <p style={{ fontSize: '15px', color: 'rgba(240,240,245,0.6)', margin: 0 }}>AI-powered email campaigns and automation</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><Plus size={16} /> Create Campaign</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatsCard title="Emails Sent" value={stats.totalSent.toLocaleString()} icon="mail" gradient="purple" />
                <StatsCard title="Avg Open Rate" value={`${stats.avgOpenRate}%`} icon="mail" gradient="teal" />
                <StatsCard title="Avg Click Rate" value={`${stats.avgClickRate}%`} icon="trending" gradient="green" />
                <StatsCard title="Total Replies" value={stats.totalReplies} icon="mail" gradient="orange" />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {tabs.map((tab) => (
                    <button key={tab} onClick={() => setSelectedTab(tab)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: selectedTab === tab ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedTab === tab ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', color: selectedTab === tab ? '#fff' : 'rgba(240,240,245,0.7)', fontSize: '14px', cursor: 'pointer' }}>
                        {tab}{tab !== 'All' && <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}>{campaigns.filter(c => c.status === tab).length}</span>}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} style={{ background: 'rgba(20,22,35,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(campaign.status), boxShadow: `0 0 8px ${getStatusColor(campaign.status)}60` }} />
                                <span style={{ color: getStatusColor(campaign.status) }}>{campaign.status}</span>
                            </div>
                            <button style={{ background: 'transparent', border: 'none', color: 'rgba(240,240,245,0.5)', fontSize: '20px', cursor: 'pointer' }}>⋮</button>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: '#fff' }}>{campaign.name}</h3>
                        <p style={{ fontSize: '14px', color: 'rgba(240,240,245,0.6)', margin: '0 0 16px 0', lineHeight: 1.5 }}>{campaign.subject}</p>
                        {campaign.scheduledDate && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(240,240,245,0.5)', marginBottom: '16px' }}>
                                <Calendar size={14} /> <span>{campaign.scheduledDate}</span>
                            </div>
                        )}
                        {campaign.sent > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '16px' }}>
                                <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{campaign.sent.toLocaleString()}</span><span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.5)', textTransform: 'uppercase' }}>Sent</span></div>
                                <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{Math.round(campaign.opened / campaign.sent * 100)}%</span><span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.5)', textTransform: 'uppercase' }}>Opened</span></div>
                                <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{Math.round(campaign.clicked / campaign.opened * 100)}%</span><span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.5)', textTransform: 'uppercase' }}>Clicked</span></div>
                                <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{campaign.replied}</span><span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.5)', textTransform: 'uppercase' }}>Replied</span></div>
                            </div>
                        )}
                        <button style={{ width: '100%', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(240,240,245,0.8)', fontSize: '13px', cursor: 'pointer' }}>
                            {campaign.status === 'Draft' ? 'Edit Draft' : campaign.status === 'Scheduled' ? 'View Details' : 'View Report'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
