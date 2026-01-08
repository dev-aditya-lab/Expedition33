'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
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

    const getBadgeClasses = (status) => {
        const classes = {
            Hot: 'bg-red-500/15 text-red-500',
            Warm: 'bg-amber-500/15 text-amber-500',
            Cold: 'bg-indigo-500/15 text-indigo-500',
            Qualified: 'bg-emerald-500/15 text-emerald-500',
            Contacted: 'bg-cyan-500/15 text-cyan-500',
        };
        return classes[status] || classes.Cold;
    };

    const columns = [
        {
            key: 'name', header: 'Contact', render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-semibold text-sm text-white">
                        {value.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{value}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            ),
        },
        { key: 'company', header: 'Company' },
        {
            key: 'status',
            header: 'Status',
            render: (value) => (
                <span className={`py-1.5 px-3 rounded-full text-xs font-semibold ${getBadgeClasses(value)}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'score', header: 'Score', render: (value) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-[60px] h-1.5 bg-white/10 rounded-sm overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-sm" style={{ width: `${value}%` }} />
                    </div>
                    <span className="text-[13px] font-semibold text-emerald-500">{value}</span>
                </div>
            ),
        },
        {
            key: 'source',
            header: 'Source',
            render: (value) => (
                <span className="py-1 px-2.5 bg-white/5 rounded-md text-xs text-gray-400">{value}</span>
            )
        },
        {
            key: 'value',
            header: 'Value',
            render: (value) => (
                <span className="font-semibold text-emerald-500">${value.toLocaleString()}</span>
            )
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto">
            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Lead Generation
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        Manage and track your leads powered by AI
                    </p>
                </div>
                <button className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all">
                    <Plus className="w-4 h-4" /> Add Lead
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
                <StatsCard title="Total Leads" value={stats.total} icon="users" gradient="purple" />
                <StatsCard title="Hot Leads" value={stats.hot} icon="flame" gradient="orange" />
                <StatsCard title="Qualified" value={stats.qualified} icon="check" gradient="green" />
                <StatsCard title="Pipeline Value" value={`$${(stats.totalValue / 1000).toFixed(0)}K`} icon="dollar" gradient="teal" />
            </div>

            <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
                    <div className="flex items-center gap-2.5 py-2.5 px-4 bg-white/5 rounded-xl border border-white/10">
                        <Search className="w-[18px] h-[18px] text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-white text-sm w-[120px] sm:w-[200px] placeholder:text-gray-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Hot', 'Warm', 'Cold', 'Qualified'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-[13px] cursor-pointer transition-all ${statusFilter === status
                                        ? 'bg-violet-500/20 border border-violet-500/40 text-violet-400'
                                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <DataTable columns={columns} data={filteredLeads} />
            </div>
        </div>
    );
}
