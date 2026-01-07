'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Dashboard', icon: DashboardIcon },
        { href: '/leads', label: 'Leads', icon: LeadsIcon },
        { href: '/email', label: 'Email', icon: EmailIcon },
        { href: '/social', label: 'Social', icon: SocialIcon },
        { href: '/crm', label: 'CRM', icon: CRMIcon },
    ];

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logo}>
                <div style={styles.logoIcon}>
                    <AIIcon />
                </div>
                <span style={styles.logoText}>GrowthAI</span>
            </div>

            <nav style={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                ...styles.navItem,
                                ...(isActive ? styles.navItemActive : {}),
                            }}
                        >
                            <Icon active={isActive} />
                            <span>{item.label}</span>
                            {isActive && <div style={styles.activeIndicator} />}
                        </Link>
                    );
                })}
            </nav>

            <div style={styles.agentStatus}>
                <div style={styles.agentHeader}>
                    <div style={styles.agentDot} />
                    <span style={styles.agentLabel}>AI Agent Active</span>
                </div>
                <p style={styles.agentText}>Processing 3 tasks...</p>
            </div>
        </aside>
    );
}

// Icons
function AIIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const styles = {
    sidebar: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '260px',
        height: '100vh',
        background: 'linear-gradient(180deg, rgba(20, 22, 35, 0.95) 0%, rgba(10, 11, 20, 0.98) 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        backdropFilter: 'blur(12px)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px',
        marginBottom: '40px',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: '20px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        color: 'rgba(240, 240, 245, 0.7)',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        position: 'relative',
    },
    navItemActive: {
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#fff',
    },
    activeIndicator: {
        position: 'absolute',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '24px',
        background: 'linear-gradient(180deg, #8b5cf6 0%, #06b6d4 100%)',
        borderRadius: '2px',
    },
    agentStatus: {
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    agentHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
    },
    agentDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#10b981',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
        animation: 'pulse-glow 2s ease-in-out infinite',
    },
    agentLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#10b981',
    },
    agentText: {
        fontSize: '12px',
        color: 'rgba(240, 240, 245, 0.6)',
        margin: 0,
    },
};
