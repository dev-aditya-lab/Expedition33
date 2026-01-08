'use client';

import { useState } from 'react';
import { Target, Rocket, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { generateAllMarketing } from '../api';

export default function GoalInput({ onSubmit, onResult }) {
    const [goal, setGoal] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!goal.trim()) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            // Use goal as product description if not specified
            const data = {
                businessName: businessName || 'My Business',
                productDescription: productDescription || goal,
                targetAudience: targetAudience || 'General audience',
                goal: goal
            };

            const response = await generateAllMarketing(data);
            setResult(response);
            
            if (onSubmit) onSubmit(goal);
            if (onResult) onResult(response);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const suggestions = [
        'Increase leads by 50%',
        'Improve email open rates',
        'Grow social engagement',
    ];

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-7">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-500">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white m-0">Set Your Business Goal</h2>
                    <p className="text-xs sm:text-sm text-gray-400 m-0">AI agent will generate marketing content for you</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                {/* Goal Input */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-3">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Generate 100 qualified leads this month..."
                        className="flex-1 min-w-0 py-3 sm:py-4 px-4 sm:px-5 bg-white/5 border border-white/10 rounded-xl text-white text-sm sm:text-[15px] placeholder:text-gray-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        className={`flex items-center justify-center gap-2 py-3 sm:py-4 px-5 sm:px-7 bg-gradient-to-br from-violet-500 to-cyan-500 border-none rounded-xl text-white text-sm sm:text-[15px] font-semibold cursor-pointer transition-all whitespace-nowrap hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                        disabled={isProcessing || !goal.trim()}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Rocket size={18} />
                                <span>Launch Agent</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Advanced Options Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs text-gray-500 hover:text-violet-400 mb-3 transition-colors"
                >
                    {showAdvanced ? '▼ Hide' : '▶ Show'} advanced options
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 animate-[fadeIn_0.3s_ease-out]">
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Business name"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                        <input
                            type="text"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            placeholder="Product description"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Target audience"
                            className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 outline-none focus:border-violet-500"
                            disabled={isProcessing}
                        />
                    </div>
                )}
            </form>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-[13px] text-gray-500">Quick suggestions:</span>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setGoal(suggestion)}
                            className="py-2 px-3 sm:px-3.5 bg-white/5 border border-white/10 rounded-full text-gray-300 text-xs sm:text-[13px] cursor-pointer transition-all hover:bg-white/10 hover:border-violet-500/30 disabled:opacity-50"
                            disabled={isProcessing}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
                    <XCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {result && !error && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle size={18} />
                    <span>Marketing content generated successfully! Check below for results.</span>
                </div>
            )}

            {/* Processing Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-[rgba(10,11,20,0.9)] flex items-center justify-center rounded-2xl">
                    <div className="text-center">
                        <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full mx-auto mb-4 animate-spin" />
                        <p className="text-gray-300 text-sm m-0">AI Agent is generating your marketing content...</p>
                        <p className="text-gray-500 text-xs mt-2">This may take 15-30 seconds</p>
                    </div>
                </div>
            )}
        </div>
    );
}
