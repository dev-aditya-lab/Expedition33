import { Users, Mail, Share2, DollarSign, Flame, CheckCircle, TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, change, changeType, icon, gradient }) {
    const isPositive = changeType === 'positive';

    const gradientStyles = {
        purple: 'from-violet-500/15 to-violet-500/5',
        teal: 'from-cyan-500/15 to-cyan-500/5',
        green: 'from-emerald-500/15 to-emerald-500/5',
        orange: 'from-amber-500/15 to-amber-500/5',
    };

    const iconBgColors = {
        purple: 'bg-violet-500/20',
        teal: 'bg-cyan-500/20',
        green: 'bg-emerald-500/20',
        orange: 'bg-amber-500/20',
    };

    const iconColors = {
        purple: 'text-violet-500',
        teal: 'text-cyan-500',
        green: 'text-emerald-500',
        orange: 'text-amber-500',
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

    return (
        <div className={`bg-gradient-to-br ${gradientStyles[gradient] || gradientStyles.purple} border border-white/10 rounded-2xl p-4 sm:p-6 transition-all hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]`}>
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${iconBgColors[gradient] || iconBgColors.purple} flex items-center justify-center ${iconColors[gradient] || iconColors.purple}`}>
                    <IconComponent className="w-5 h-5" />
                </div>
                {change && (
                    <div className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold ${isPositive
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                        {isPositive ? '↑' : '↓'} {change}%
                    </div>
                )}
            </div>
            <div className="text-2xl sm:text-[32px] font-bold mb-1.5 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
                {value}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{title}</div>
        </div>
    );
}
