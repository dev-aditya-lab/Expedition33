'use client';

import { useState } from 'react';
import { Target, Rocket, Loader2 } from 'lucide-react';

export default function GoalInput({ onSubmit }) {
    const [goal, setGoal] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            if (onSubmit) onSubmit(goal);
            setGoal('');
        }, 2000);
    };

    const suggestions = [
        'Increase leads by 50%',
        'Improve email open rates',
        'Grow social engagement',
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.iconWrapper}>
                    <Target size={24} stroke="url(#targetGradient)" />
                    <svg width="0" height="0">
                        <defs>
                            <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div>
                    <h2 style={styles.title}>Set Your Business Goal</h2>
                    <p style={styles.subtitle}>Let AI agent plan and execute your growth strategy</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Generate 100 qualified leads this month..."
                        style={styles.input}
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isProcessing ? styles.buttonProcessing : {}),
                        }}
                        disabled={isProcessing || !goal.trim()}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Rocket size={18} />
                                <span>Launch Agent</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div style={styles.suggestions}>
                <span style={styles.suggestionsLabel}>Quick suggestions:</span>
                <div style={styles.suggestionTags}>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setGoal(suggestion)}
                            style={styles.tag}
                            disabled={isProcessing}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {isProcessing && (
                <div style={styles.processingOverlay}>
                    <div style={styles.processingContent}>
                        <div style={styles.processingSpinner} />
                        <p style={styles.processingText}>AI Agent is analyzing your goal and creating a strategy...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(139, 92, 246, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8b5cf6',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        margin: '0 0 4px 0',
        color: '#fff',
    },
    subtitle: {
        fontSize: '14px',
        color: 'rgba(240, 240, 245, 0.6)',
        margin: 0,
    },
    form: {
        marginBottom: '20px',
    },
    inputWrapper: {
        display: 'flex',
        gap: '12px',
    },
    input: {
        flex: 1,
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px 28px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        border: 'none',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
    },
    buttonProcessing: {
        opacity: 0.8,
        cursor: 'not-allowed',
    },
    suggestions: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
    },
    suggestionsLabel: {
        fontSize: '13px',
        color: 'rgba(240, 240, 245, 0.5)',
    },
    suggestionTags: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    tag: {
        padding: '8px 14px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        color: 'rgba(240, 240, 245, 0.8)',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    processingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 11, 20, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
    },
    processingContent: {
        textAlign: 'center',
    },
    processingSpinner: {
        width: '48px',
        height: '48px',
        border: '3px solid rgba(139, 92, 246, 0.2)',
        borderTopColor: '#8b5cf6',
        borderRadius: '50%',
        margin: '0 auto 16px',
        animation: 'spin 1s linear infinite',
    },
    processingText: {
        color: 'rgba(240, 240, 245, 0.8)',
        fontSize: '14px',
        margin: 0,
    },
};
