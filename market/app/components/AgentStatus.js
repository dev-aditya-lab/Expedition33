'use client';

import { CheckCircle, Loader2, Circle } from 'lucide-react';

export default function AgentStatus({ tasks }) {
    return (
        <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse" />
                    <h3 className="text-sm sm:text-base font-semibold text-white m-0">AI Agent Activity</h3>
                </div>
                <span className="py-1 px-2.5 bg-emerald-500/15 rounded-xl text-[11px] font-semibold text-emerald-500 uppercase tracking-wide">
                    Live
                </span>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="p-3 sm:p-3.5 bg-white/5 rounded-xl border border-white/5 animate-[fadeIn_0.5s_ease-out_forwards]"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-center gap-2.5 mb-2">
                            <StatusIcon status={task.status} />
                            <span className="text-xs sm:text-sm text-gray-200 flex-1">{task.task}</span>
                        </div>
                        {task.status === 'in_progress' && (
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="flex-1 h-1 bg-white/10 rounded-sm overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-sm transition-all duration-500"
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-violet-500 font-semibold min-w-[35px]">
                                    {task.progress}%
                                </span>
                            </div>
                        )}
                        <span className="text-[11px] text-gray-500">{formatTime(task.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusIcon({ status }) {
    if (status === 'completed') {
        return (
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
            </div>
        );
    }
    if (status === 'in_progress') {
        return (
            <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />
            </div>
        );
    }
    return (
        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
            <Circle className="w-3 h-3 text-gray-500" />
        </div>
    );
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
