import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  DollarSign,
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ClientHomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentWorkspaceId,
    clientWorkspaces,
    planDefinitions,
    socialPosts,
  } = useDemoStore();

  const currentWorkspace =
    clientWorkspaces.find((w) => w.id === currentWorkspaceId) ||
    clientWorkspaces[0];

  const currentPlan =
    planDefinitions.find((p) => p.name === currentWorkspace.plan) ||
    planDefinitions[1];

  const leadsPercent = Math.min(100, Math.round((currentWorkspace.leadsThisMonth / currentPlan.leads) * 100));
  const spendPercent = Math.min(100, Math.round((currentWorkspace.aiSpend / (currentPlan.price * 0.35)) * 100));

  // Next scheduled posts
  const scheduledPosts = socialPosts.slice(0, 3);

  // Active campaigns sample
  const activeCampaigns = [
    {
      id: 'camp-1',
      title: 'Q4 High-Intent Decision Maker Outreach',
      channels: ['Email', 'SMS'],
      status: 'Active',
      leadsReached: Math.round(currentWorkspace.leadsThisMonth * 0.65),
      replyRate: '14.2%',
    },
    {
      id: 'camp-2',
      title: 'Inbound Consultation Re-Engagement Loop',
      channels: ['SMS', 'Social'],
      status: 'Active',
      leadsReached: Math.round(currentWorkspace.leadsThisMonth * 0.35),
      replyRate: '19.8%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
              05 Output / Client Hub
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Tenant: {currentWorkspace.name}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time performance indicators, active multi-channel campaigns, inbound lead replies, and scheduled content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/control/command-center')}
            className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Launch AI Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Leads this month vs plan */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Leads This Month</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {currentWorkspace.leadsThisMonth.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / {currentPlan.leads.toLocaleString()}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>{leadsPercent}% of plan</span>
              <span className="capitalize">{currentWorkspace.plan} Plan</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${leadsPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Conversations needing a reply */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Replies Needing Attention</span>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {currentWorkspace.conversationsNeedingReply}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              High intent
            </span>
          </div>
          <button
            onClick={() => navigate('/workflows/inbound-replies')}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>Review triage inbox</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* AI spend vs plan */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Token Spend This Month</span>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              ${currentWorkspace.aiSpend.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / ${(currentPlan.price * 0.35).toFixed(0)} cap
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>{spendPercent}% utilized</span>
              <span>Guardrails safe</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Outreach throughput */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Messages Dispatched</span>
            <Send className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {(currentWorkspace.emailsSent + currentWorkspace.smsSent).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">email + sms</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            {currentWorkspace.emailsSent.toLocaleString()} emails, {currentWorkspace.smsSent.toLocaleString()} SMS segments
          </p>
        </div>
      </div>

      {/* Main Grid: Active Campaigns & Scheduled Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Campaigns */}
        <div className="lg:col-span-2 rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Active Outreach Sequences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-step sequences currently nurturing contacts
              </p>
            </div>
            <button
              onClick={() => navigate('/workflows/email-sequences')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all sequences
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-200/60 dark:divide-white/5">
            {activeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      {camp.status}
                    </span>
                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {camp.title}
                    </h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Channels: {camp.channels.join(', ')}</span>
                    <span>•</span>
                    <span>{camp.leadsReached.toLocaleString()} prospects enrolled</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Reply Rate</div>
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {camp.replyRate}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/workflows/follow-up-engine')}
                    className="rounded-[8px] border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Social Posts */}
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Upcoming Social Posts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled publication calendar
              </p>
            </div>
            <button
              onClick={() => navigate('/workflows/social')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Calendar
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-[10px] border border-slate-200/60 p-3 bg-white/40 dark:border-white/5 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-medium text-blue-600 dark:text-blue-400 capitalize">
                      {post.platform}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {post.scheduledDate ? `${post.scheduledDate} ${post.scheduledTime}` : 'Scheduled'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No upcoming posts scheduled.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
