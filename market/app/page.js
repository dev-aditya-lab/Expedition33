'use client';

import { useState, useEffect } from 'react';
import { Target, Calendar, Briefcase, Mail, FileText, Phone, Tag, Share2, Hash, MessageSquare, Loader2 } from 'lucide-react';
import GoalInput from './components/GoalInput';
import StatsCard from './components/StatsCard';
import AgentStatus from './components/AgentStatus';
import EmailCampaign from './components/EmailCampaign';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const [activeGoal, setActiveGoal] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch(`${API_URL}/dashboard/stats`);
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDashboardStats(stats);
      }
      
      // Fetch activities
      const activitiesRes = await fetch(`${API_URL}/dashboard/activities`);
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGoalSubmit = (goal) => {
    setActiveGoal(goal);
  };

  const handleResult = (result) => {
    setGeneratedContent(result);
  };

  const activityIcons = {
    meeting: Calendar,
    deal: Briefcase,
    email: Mail,
    note: FileText,
    call: Phone,
    status: Tag,
  };

  // Default stats if loading
  const stats = dashboardStats || {
    totalLeads: 0,
    leadsThisWeek: 0,
    emailsSent: 0,
    emailOpenRate: 0,
    socialReach: 0,
    socialEngagement: 0,
    pipelineValue: 0,
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="flex flex-wrap justify-between items-start gap-3 mb-6">
        <div>
          <h1 className="text-[clamp(22px,5vw,32px)] font-bold m-0 mb-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-[clamp(13px,3vw,15px)] text-gray-400 m-0">
            Monitor your AI agent and marketing performance
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[13px] text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </header>

      <GoalInput onSubmit={handleGoalSubmit} onResult={handleResult} />

      {activeGoal && (
        <div className="flex items-start gap-3 py-3.5 px-4 bg-violet-500/10 border border-violet-500/20 rounded-xl mt-4 mb-5 animate-[fadeIn_0.5s_ease-out_forwards]">
          <Target className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] text-violet-500 font-semibold uppercase tracking-wide">Active Goal</span>
            <p className="m-0 mt-1 text-sm text-gray-200 break-words">{activeGoal}</p>
          </div>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-6">
          {/* SEO Content */}
          <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-emerald-500/20 rounded-lg">
                <Hash className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-base font-semibold text-white m-0">SEO Keywords</h3>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generatedContent.seo}
            </div>
          </div>

          {/* Social Media Content */}
          <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-violet-500/20 rounded-lg">
                <Share2 className="w-4 h-4 text-violet-500" />
              </div>
              <h3 className="text-base font-semibold text-white m-0">Social Media Posts</h3>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generatedContent.social_media}
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-cyan-500/20 rounded-lg">
                <Mail className="w-4 h-4 text-cyan-500" />
              </div>
              <h3 className="text-base font-semibold text-white m-0">Email Marketing</h3>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generatedContent.email}
            </div>
          </div>

          {/* WhatsApp Content */}
          <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-green-500/20 rounded-lg">
                <MessageSquare className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-base font-semibold text-white m-0">WhatsApp Messages</h3>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {generatedContent.whatsapp}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid - Now with Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mt-6 sm:mt-8 mb-6 sm:mb-8">
        {loading ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          </div>
        ) : (
          <>
            <StatsCard 
              title="Total Leads" 
              value={stats.totalLeads?.toLocaleString() || '0'} 
              change={stats.leadsThisWeek > 0 ? `+${stats.leadsThisWeek} this week` : null}
              changeType="positive" 
              icon="users" 
              gradient="purple" 
            />
            <StatsCard 
              title="Emails Sent" 
              value={stats.emailsSent?.toLocaleString() || '0'} 
              icon="mail" 
              gradient="teal" 
            />
            <StatsCard 
              title="Social Reach" 
              value={`${((stats.socialReach || 0) / 1000).toFixed(1)}K`} 
              icon="share" 
              gradient="green" 
            />
            <StatsCard 
              title="Pipeline Value" 
              value={`$${((stats.pipelineValue || 0) / 1000).toFixed(0)}K`} 
              icon="dollar" 
              gradient="orange" 
            />
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
        <EmailCampaign />

        <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
          <h3 className="text-sm sm:text-base font-semibold text-white m-0 mb-4 sm:mb-5">Recent Activity</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
            </div>
          ) : activities.length > 0 ? (
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {activities.slice(0, 5).map((activity, index) => {
                const IconComponent = activityIcons[activity.type] || FileText;
                return (
                  <div
                    key={activity.id || index}
                    className="flex gap-3 p-3 bg-white/5 rounded-xl animate-[fadeIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm font-semibold text-white">{activity.contact}</span>
                        <span className="text-[11px] text-gray-500">{formatTime(activity.timestamp)}</span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-violet-500 m-0 mb-1">{activity.action}</p>
                      <p className="text-[11px] sm:text-xs text-gray-400 m-0 truncate">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Import leads and send emails to see activity here</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Card */}
      <div className="bg-[rgba(20,22,35,0.8)] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
        <h3 className="text-sm sm:text-base font-semibold text-white m-0 mb-4 sm:mb-5">Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
            <div className="text-xs sm:text-[13px] text-gray-400 mb-2">Email Open Rate</div>
            <div className="text-xl sm:text-[28px] font-bold mb-3 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
              {stats.emailOpenRate || 0}%
            </div>
            <div className="h-1.5 bg-white/10 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-sm transition-all duration-500"
                style={{ width: `${stats.emailOpenRate || 0}%` }}
              />
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
            <div className="text-xs sm:text-[13px] text-gray-400 mb-2">Social Engagement</div>
            <div className="text-xl sm:text-[28px] font-bold mb-3 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
              {stats.socialEngagement || 0}%
            </div>
            <div className="h-1.5 bg-white/10 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-sm transition-all duration-500"
                style={{ width: `${(stats.socialEngagement || 0) * 10}%` }}
              />
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
            <div className="text-xs sm:text-[13px] text-gray-400 mb-2">Leads This Week</div>
            <div className="text-xl sm:text-[28px] font-bold mb-3 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
              {stats.leadsThisWeek || 0}
            </div>
            <div className="h-1.5 bg-white/10 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-sm transition-all duration-500"
                style={{ width: `${Math.min((stats.leadsThisWeek || 0) * 10, 100)}%` }}
              />
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-white/5 rounded-xl">
            <div className="text-xs sm:text-[13px] text-gray-400 mb-2">Hot Leads</div>
            <div className="text-xl sm:text-[28px] font-bold mb-3 bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent">
              {stats.hotLeads || 0}
            </div>
            <div className="h-1.5 bg-white/10 rounded-sm overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-sm transition-all duration-500"
                style={{ width: `${stats.totalLeads > 0 ? ((stats.hotLeads || 0) / stats.totalLeads) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
