'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatsCard from '../components/StatsCard';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:8000';

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch leads from backend
    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/leads`);
            if (response.ok) {
                const data = await response.json();
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            showNotification('error', 'Failed to fetch leads from server');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // Handle import button click
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file selection and parse Excel
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                showNotification('error', 'No data found in the Excel file');
                setIsImporting(false);
                return;
            }

            // Map Excel columns to lead schema
            const leads = jsonData.map(row => ({
                name: row.name || row.Name || '',
                email: row.email || row.Email || '',
                company: row.company || row.Company || '',
                status: row.status || row.Status || 'Cold',
                score: parseInt(row.score || row.Score) || 50,
                source: row.source || row.Source || 'Website',
                lastContact: row.lastContact || row.LastContact || row['Last Contact'] || null,
                value: parseInt(row.value || row.Value) || 0
            }));

            // Validate required fields
            const validLeads = leads.filter(lead => lead.name && lead.email && lead.company);

            if (validLeads.length === 0) {
                showNotification('error', 'No valid leads found. Ensure name, email, and company columns exist.');
                setIsImporting(false);
                return;
            }

            // Send to backend
            const response = await fetch(`${API_URL}/leads/import`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ leads: validLeads }),
            });

            if (response.ok) {
                const result = await response.json();
                showNotification('success', `Successfully imported ${result.imported_count} leads!`);
                await fetchLeads(); // Refresh the leads list
            } else {
                const error = await response.json();
                showNotification('error', error.detail || 'Failed to import leads');
            }
        } catch (error) {
            console.error('Error importing file:', error);
            showNotification('error', 'Failed to parse or import the Excel file');
        } finally {
            setIsImporting(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: leads.length,
        hot: leads.filter(l => l.status === 'Hot').length,
        qualified: leads.filter(l => l.status === 'Qualified').length,
        totalValue: leads.reduce((sum, l) => sum + (l.value || 0), 0),
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
                        {value?.charAt(0) || '?'}
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
                        <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-sm" style={{ width: `${value || 0}%` }} />
                    </div>
                    <span className="text-[13px] font-semibold text-emerald-500">{value || 0}</span>
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
                <span className="font-semibold text-emerald-500">${(value || 0).toLocaleString()}</span>
            )
        },
    ];

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 py-3 px-5 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                        : 'bg-red-500/20 border-red-500/40 text-red-400'
                }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <header className="flex flex-wrap justify-between items-start gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                        Lead Generation
                    </h1>
                    <p className="text-sm sm:text-[15px] text-gray-400 m-0">
                        Manage and track your leads powered by AI
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    
                    {/* Import Button */}
                    <button 
                        onClick={handleImportClick}
                        disabled={isImporting}
                        className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-semibold cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isImporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {isImporting ? 'Importing...' : 'Import Excel'}
                    </button>
                    
                    {/* Add Lead Button */}
                    <button className="flex items-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-violet-500/30 transition-all">
                        <Plus className="w-4 h-4" /> Add Lead
                    </button>
                </div>
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
                
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    </div>
                ) : filteredLeads.length > 0 ? (
                    <DataTable columns={columns} data={filteredLeads} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg mb-2">No leads found</p>
                        <p className="text-sm">Import an Excel file or add leads manually to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
