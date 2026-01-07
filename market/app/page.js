'use client';

import { useState } from 'react';
import { Target, Users, Mail, Share2, DollarSign, Calendar, Briefcase, Phone, FileText, Tag } from 'lucide-react';
import GoalInput from './components/GoalInput';
import StatsCard from './components/StatsCard';
import AgentStatus from './components/AgentStatus';
import { dashboardStats, agentTasks, crmActivities } from './data/mockData';

export default function Dashboard() {
  const [activeGoal, setActiveGoal] = useState(null);

  const handleGoalSubmit = (goal) => {
    setActiveGoal(goal);
  };

  const activityIcons = {
    meeting: Calendar,
    deal: Briefcase,
    email: Mail,
    note: FileText,
    call: Phone,
    status: Tag,
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Monitor your AI agent and marketing performance</p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.date}>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </header>

      <GoalInput onSubmit={handleGoalSubmit} />

      {activeGoal && (
        <div style={styles.activeGoal}>
          <Target size={20} color="#8b5cf6" />
          <div>
            <span style={styles.goalLabel}>Active Goal</span>
            <p style={styles.goalText}>{activeGoal}</p>
          </div>
        </div>
      )}

      <div style={styles.statsGrid}>
        <StatsCard title="Total Leads" value={dashboardStats.totalLeads.toLocaleString()} change={dashboardStats.leadsGrowth} changeType="positive" icon="users" gradient="purple" />
        <StatsCard title="Emails Sent" value={dashboardStats.emailsSent.toLocaleString()} change={dashboardStats.emailGrowth} changeType="positive" icon="mail" gradient="teal" />
        <StatsCard title="Social Reach" value={`${(dashboardStats.socialReach / 1000).toFixed(1)}K`} change={dashboardStats.socialGrowth} changeType="positive" icon="share" gradient="green" />
        <StatsCard title="Pipeline Value" value={`$${(dashboardStats.pipelineValue / 1000).toFixed(0)}K`} change={dashboardStats.pipelineGrowth} changeType="positive" icon="dollar" gradient="orange" />
      </div>

      <div style={styles.contentGrid}>
        <AgentStatus tasks={agentTasks} />

        <div style={styles.activityCard}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          <div style={styles.activityList}>
            {crmActivities.slice(0, 5).map((activity, index) => {
              const IconComponent = activityIcons[activity.type] || FileText;
              return (
                <div key={activity.id} style={{ ...styles.activityItem, animationDelay: `${index * 0.1}s` }}>
                  <div style={styles.activityIcon}>
                    <IconComponent size={16} color="rgba(240,240,245,0.7)" />
                  </div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityHeader}>
                      <span style={styles.activityName}>{activity.contact}</span>
                      <span style={styles.activityTime}>{formatTime(activity.timestamp)}</span>
                    </div>
                    <p style={styles.activityAction}>{activity.action}</p>
                    <p style={styles.activityDesc}>{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.performanceCard}>
        <h3 style={styles.cardTitle}>Performance Overview</h3>
        <div style={styles.metricsGrid}>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Email Open Rate</div>
            <div style={styles.metricValue}>{dashboardStats.emailOpenRate}%</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${dashboardStats.emailOpenRate}%` }} />
            </div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Social Engagement</div>
            <div style={styles.metricValue}>{dashboardStats.socialEngagement}%</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${dashboardStats.socialEngagement * 10}%`, background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)' }} />
            </div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Leads This Week</div>
            <div style={styles.metricValue}>{dashboardStats.leadsThisWeek}</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: '89%', background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)' }} />
            </div>
          </div>
          <div style={styles.metricItem}>
            <div style={styles.metricLabel}>Deals in Progress</div>
            <div style={styles.metricValue}>{dashboardStats.dealsInProgress}</div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: '75%', background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = {
  page: { maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '15px', color: 'rgba(240, 240, 245, 0.6)', margin: 0 },
  headerRight: { textAlign: 'right' },
  date: { fontSize: '14px', color: 'rgba(240, 240, 245, 0.5)' },
  activeGoal: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', marginTop: '20px', marginBottom: '24px', animation: 'fadeIn 0.5s ease-out forwards' },
  goalLabel: { fontSize: '12px', color: '#8b5cf6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  goalText: { margin: '4px 0 0 0', fontSize: '15px', color: 'rgba(240, 240, 245, 0.9)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '32px', marginBottom: '32px' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' },
  activityCard: { background: 'rgba(20, 22, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' },
  cardTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0', color: '#fff' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  activityItem: { display: 'flex', gap: '14px', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', animation: 'fadeIn 0.5s ease-out forwards' },
  activityIcon: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px' },
  activityContent: { flex: 1, minWidth: 0 },
  activityHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  activityName: { fontSize: '14px', fontWeight: '600', color: '#fff' },
  activityTime: { fontSize: '11px', color: 'rgba(240, 240, 245, 0.4)' },
  activityAction: { fontSize: '13px', color: '#8b5cf6', margin: '0 0 4px 0' },
  activityDesc: { fontSize: '12px', color: 'rgba(240, 240, 245, 0.6)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  performanceCard: { background: 'rgba(20, 22, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(12px)' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' },
  metricItem: { padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' },
  metricLabel: { fontSize: '13px', color: 'rgba(240, 240, 245, 0.6)', marginBottom: '8px' },
  metricValue: { fontSize: '28px', fontWeight: '700', marginBottom: '12px', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  progressBar: { height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)', borderRadius: '3px', transition: 'width 0.5s ease' },
};
