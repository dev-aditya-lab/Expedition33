'use client';

import { useState } from 'react';
import { Plus, Eye, Heart, MessageCircle, Repeat2, Calendar } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { socialPosts } from '../data/mockData';

export default function SocialPage() {
    const [posts] = useState(socialPosts);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const platforms = ['All', 'LinkedIn', 'Twitter', 'Instagram'];

    const filteredPosts = posts.filter(post => selectedPlatform === 'All' || post.platform === selectedPlatform);

    const stats = {
        totalReach: posts.reduce((sum, p) => sum + p.reach, 0),
        totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
        totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
        totalShares: posts.reduce((sum, p) => sum + p.shares, 0),
    };

    const getStatusStyle = (status) => {
        const map = {
            Published: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
            Scheduled: { background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
            Draft: { background: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' },
        };
        return map[status] || map.Draft;
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Social Media</h1>
                    <p style={{ fontSize: '15px', color: 'rgba(240,240,245,0.6)', margin: 0 }}>Schedule and manage AI-generated social content</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><Plus size={16} /> Create Post</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatsCard title="Total Reach" value={`${(stats.totalReach / 1000).toFixed(1)}K`} icon="share" gradient="purple" />
                <StatsCard title="Total Likes" value={stats.totalLikes} icon="users" gradient="teal" />
                <StatsCard title="Comments" value={stats.totalComments} icon="mail" gradient="green" />
                <StatsCard title="Shares" value={stats.totalShares} icon="share" gradient="orange" />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {platforms.map((platform) => (
                    <button key={platform} onClick={() => setSelectedPlatform(platform)} style={{ padding: '10px 20px', background: selectedPlatform === platform ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedPlatform === platform ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', color: selectedPlatform === platform ? '#fff' : 'rgba(240,240,245,0.7)', fontSize: '14px', cursor: 'pointer' }}>{platform}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {filteredPosts.map((post) => (
                    <div key={post.id} style={{ background: 'rgba(20,22,35,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', color: 'rgba(240,240,245,0.8)' }}>{post.platform}</span>
                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', ...getStatusStyle(post.status) }}>{post.status}</span>
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(240,240,245,0.9)', margin: '0 0 16px 0' }}>{post.content}</p>
                        {post.scheduledDate && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(240,240,245,0.5)', margin: '0 0 16px 0' }}>
                                <Calendar size={14} /> {post.scheduledDate}
                            </div>
                        )}
                        {post.status === 'Published' && (
                            <div style={{ display: 'flex', gap: '16px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={14} color="#ef4444" /> <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{post.likes}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} color="#06b6d4" /> <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{post.comments}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Repeat2 size={14} color="#10b981" /> <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{post.shares}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} color="#8b5cf6" /> <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{(post.reach / 1000).toFixed(1)}K</span></div>
                            </div>
                        )}
                        <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(240,240,245,0.8)', fontSize: '13px', cursor: 'pointer' }}>
                            {post.status === 'Draft' ? 'Edit & Schedule' : post.status === 'Scheduled' ? 'View Details' : 'View Analytics'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
