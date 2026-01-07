'use client';

import { CheckCircle, Loader2, Circle } from 'lucide-react';

export default function AgentStatus({ tasks }) {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.pulsingDot} />
                    <h3 style={styles.title}>AI Agent Activity</h3>
                </div>
                <span style={styles.badge}>Live</span>
            </div>

            <div style={styles.taskList}>
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        style={{
                            ...styles.task,
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        <div style={styles.taskHeader}>
                            <StatusIcon status={task.status} />
                            <span style={styles.taskName}>{task.task}</span>
                        </div>
                        {task.status === 'in_progress' && (
                            <div style={styles.progressWrapper}>
                                <div style={styles.progressBar}>
                                    <div
                                        style={{
                                            ...styles.progressFill,
                                            width: `${task.progress}%`,
                                        }}
                                    />
                                </div>
                                <span style={styles.progressText}>{task.progress}%</span>
                            </div>
                        )}
                        <span style={styles.timestamp}>{formatTime(task.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusIcon({ status }) {
    if (status === 'completed') {
        return (
            <div style={{ ...styles.statusIcon, background: 'rgba(16, 185, 129, 0.2)' }}>
                <CheckCircle size={12} color="#10b981" />
            </div>
        );
    }
    if (status === 'in_progress') {
        return (
            <div style={{ ...styles.statusIcon, background: 'rgba(139, 92, 246, 0.2)' }}>
                <Loader2 size={12} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }
    return (
        <div style={{ ...styles.statusIcon, background: 'rgba(255, 255, 255, 0.1)' }}>
            <Circle size={12} color="rgba(255,255,255,0.5)" />
        </div>
    );
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const styles = {
    container: {
        background: 'rgba(20, 22, 35, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(12px)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    pulsingDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#10b981',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
        animation: 'pulse-glow 2s ease-in-out infinite',
    },
    title: {
        fontSize: '16px',
        fontWeight: '600',
        margin: 0,
        color: '#fff',
    },
    badge: {
        padding: '4px 10px',
        background: 'rgba(16, 185, 129, 0.15)',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#10b981',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    task: {
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        animation: 'fadeIn 0.5s ease-out forwards',
    },
    taskHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    statusIcon: {
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskName: {
        fontSize: '14px',
        color: 'rgba(240, 240, 245, 0.9)',
        flex: 1,
    },
    progressWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    progressBar: {
        flex: 1,
        height: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
        borderRadius: '2px',
        transition: 'width 0.5s ease',
    },
    progressText: {
        fontSize: '12px',
        color: '#8b5cf6',
        fontWeight: '600',
        minWidth: '35px',
    },
    timestamp: {
        fontSize: '11px',
        color: 'rgba(240, 240, 245, 0.4)',
    },
};
