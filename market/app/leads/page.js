'use client';

import { useState } from 'react';
import { Search, Plus, Users, Flame, CheckCircle, DollarSign } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatsCard from '../components/StatsCard';
import { leadsData } from '../data/mockData';

export default function LeadsPage() {
    const [leads] = useState(leadsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: leads.length,
        hot: leads.filter(l => l.status === 'Hot').length,
        qualified: leads.filter(l => l.status === 'Qualified').length,
        totalValue: leads.reduce((sum, l) => sum + l.value, 0),
    };

    const columns = [
        {
            key: 'name', header: 'Contact', render: (value, row) => (
                <div style={styles.contactCell}>
                    <div style={styles.avatar}>{value.charAt(0)}</div>
                    <div><div style={styles.contactName}>{value}</div><div style={styles.contactEmail}>{row.email}</div></div>
                </div>
            ),
        },
        { key: 'company', header: 'Company' },
        { key: 'status', header: 'Status', render: (value) => (<span style={{ ...styles.badge, ...getBadgeStyle(value) }}>{value}</span>) },
        {
            key: 'score', header: 'Score', render: (value) => (
                <div style={styles.scoreCell}><div style={styles.scoreBar}><div style={{ ...styles.scoreFill, width: `${value}%` }} /></div><span style={styles.scoreValue}>{value}</span></div>
            ),
        },
        { key: 'source', header: 'Source', render: (value) => (<span style={styles.sourceTag}>{value}</span>) },
        { key: 'value', header: 'Value', render: (value) => (<span style={styles.valueText}>${value.toLocaleString()}</span>) },
    ];

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Lead Generation</h1>
                    <p style={styles.subtitle}>Manage and track your leads powered by AI</p>
                </div>
                <button style={styles.addButton}><Plus size={16} /> Add Lead</button>
            </header>

            <div style={styles.statsGrid}>
                <StatsCard title="Total Leads" value={stats.total} icon="users" gradient="purple" />
                <StatsCard title="Hot Leads" value={stats.hot} icon="flame" gradient="orange" />
                <StatsCard title="Qualified" value={stats.qualified} icon="check" gradient="green" />
                <StatsCard title="Pipeline Value" value={`$${(stats.totalValue / 1000).toFixed(0)}K`} icon="dollar" gradient="teal" />
            </div>

            <div style={styles.tableCard}>
                <div style={styles.tableHeader}>
                    <div style={styles.searchWrapper}>
                        <Search size={18} color="rgba(240, 240, 245, 0.4)" />
                        <input type="text" placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
                    </div>
                    <div style={styles.filters}>
                        {['All', 'Hot', 'Warm', 'Cold', 'Qualified'].map((status) => (
                            <button key={status} onClick={() => setStatusFilter(status)} style={{ ...styles.filterButton, ...(statusFilter === status ? styles.filterActive : {}) }}>{status}</button>
                        ))}
                    </div>
                </div>
                <DataTable columns={columns} data={filteredLeads} />
            </div>
        </div>
    );
}

function getBadgeStyle(status) {
    const styles = {
        Hot: { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
        Warm: { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
        Cold: { background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' },
        Qualified: { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
        Contacted: { background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' },
    };
    return styles[status] || styles.Cold;
}

const styles = {
    page: { maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
    title: { fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { fontSize: '15px', color: 'rgba(240, 240, 245, 0.6)', margin: 0 },
    addButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
    tableCard: { background: 'rgba(20, 22, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' },
    tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' },
    searchWrapper: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' },
    searchInput: { background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '200px' },
    filters: { display: 'flex', gap: '8px' },
    filterButton: { padding: '8px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', color: 'rgba(240, 240, 245, 0.7)', fontSize: '13px', cursor: 'pointer' },
    filterActive: { background: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#8b5cf6' },
    contactCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' },
    contactName: { fontWeight: '600', marginBottom: '2px' },
    contactEmail: { fontSize: '12px', color: 'rgba(240, 240, 245, 0.5)' },
    badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    scoreCell: { display: 'flex', alignItems: 'center', gap: '10px' },
    scoreBar: { width: '60px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' },
    scoreFill: { height: '100%', background: 'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)', borderRadius: '3px' },
    scoreValue: { fontSize: '13px', fontWeight: '600', color: '#10b981' },
    sourceTag: { padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', fontSize: '12px', color: 'rgba(240, 240, 245, 0.7)' },
    valueText: { fontWeight: '600', color: '#10b981' },
};
