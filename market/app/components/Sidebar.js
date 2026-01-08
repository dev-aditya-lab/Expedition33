'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const navItems = [
        { href: '/', label: 'Dashboard', icon: DashboardIcon },
        { href: '/leads', label: 'Leads', icon: LeadsIcon },
        { href: '/seo', label: 'SEO', icon: SEOIcon },
        { href: '/email', label: 'Email', icon: EmailIcon },
        { href: '/social', label: 'Social', icon: SocialIcon },
        { href: '/history', label: 'History', icon: HistoryIcon },
        { href: '/crm', label: 'CRM', icon: CRMIcon },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-[60px] bg-[rgba(20,22,35,0.98)] border-b border-white/10 px-4 items-center justify-between z-[101] backdrop-blur-xl hidden md:!hidden max-md:flex">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                        <AIIcon size={18} />
                    </div>
                    <span className="text-base font-bold bg-gradient-to-br from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        GrowthAI
                    </span>
                </div>
                <button
                    className="flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                >
                    <div className="w-[18px] h-3.5 flex flex-col justify-between">
                        <span className={`block h-0.5 w-full bg-white rounded-sm transition-all duration-300 ${isOpen ? 'rotate-45 translate-x-1 translate-y-1' : ''}`} />
                        <span className={`block h-0.5 w-full bg-white rounded-sm transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block h-0.5 w-full bg-white rounded-sm transition-all duration-300 ${isOpen ? '-rotate-45 translate-x-1 -translate-y-1' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Overlay */}
            <div
                onClick={closeSidebar}
                className={`fixed inset-0 bg-black/60 z-[99] transition-opacity duration-300 md:hidden ${mounted && isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 w-[260px] h-screen bg-gradient-to-b from-[rgba(20,22,35,0.98)] to-[rgba(10,11,20,0.99)] border-r border-white/10 p-6 flex flex-col z-[100] backdrop-blur-xl transition-transform duration-300 max-md:-translate-x-full ${isOpen ? 'max-md:translate-x-0' : ''}`}>
                <div className="flex items-center gap-3 px-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                        <AIIcon />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-br from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                        GrowthAI
                    </span>
                </div>

                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 py-3.5 px-4 rounded-xl text-[15px] font-medium transition-all relative ${isActive
                                    ? 'bg-violet-500/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon active={isActive} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-sm" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

// Icons
function AIIcon({ size = 24 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    );
}

function DashboardIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function LeadsIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function EmailIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function SocialIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

function CRMIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

function SEOIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
        </svg>
    );
}

function HistoryIcon({ active }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#8b5cf6' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

