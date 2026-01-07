import { Users, Mail, Share2, DollarSign, Flame, CheckCircle, TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, change, changeType, icon, gradient }) {
    const isPositive = changeType === 'positive';

    const gradientStyles = {
        purple: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
        teal: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
        green: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
        orange: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
    };

    const iconColors = {
        purple: '#8b5cf6',
        teal: '#06b6d4',
        green: '#10b981',
        orange: '#f59e0b',
    };

    const iconMap = {
        users: Users,
        mail: Mail,
        share: Share2,
        dollar: DollarSign,
        flame: Flame,
        check: CheckCircle,
        trending: TrendingUp,
    };

    const IconComponent = iconMap[icon] || Users;
    const color = iconColors[gradient] || iconColors.purple;

    return (
        <div style={{ ...styles.card, background: gradientStyles[gradient] || gradientStyles.purple }}>
            <div style={styles.header}>
                <div style={{ ...styles.iconWrapper, background: `${color}20` }}>
                    <IconComponent size={20} color={color} />
                </div>
                {change && (
                    <div style={{
                        ...styles.change,
                        color: isPositive ? '#10b981' : '#ef4444',
                        background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    }}>
                        {isPositive ? '↑' : '↓'} {change}%
                    </div>
                )}
            </div>
            <div style={styles.value}>{value}</div>
            <div style={styles.title}>{title}</div>
        </div>
    );
}

const styles = {
    card: {
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
    },
    iconWrapper: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    change: {
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
    },
    value: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '6px',
        background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    title: {
        fontSize: '14px',
        color: 'rgba(240, 240, 245, 0.6)',
    },
};
