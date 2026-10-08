import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { useDemoStore } from '../../store/useDemoStore';
import { WORKSPACES } from '../../data/mockData';

export const DashboardPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter((l) => l.workspace_id === currentWorkspaceId);
  const inboxes = useDemoStore((state) => state.inboxes).filter((i) => i.workspace_id === currentWorkspaceId);
  const replies = useDemoStore((state) => state.replies).filter((r) => r.workspace_id === currentWorkspaceId);
  const smsRecords = useDemoStore((state) => state.smsRecords).filter((s) => s.workspace_id === currentWorkspaceId);
  const sequences = useDemoStore((state) => state.sequences).filter((s) => s.workspace_id === currentWorkspaceId);

  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  // Dynamic calculations matching tables exactly
  const totalLeads = leads.length;
  const apolloCount = leads.filter((l) => l.source === 'apollo_b2b').length;
  const webFormCount = leads.filter((l) => l.source === 'web_form').length;
  const metaAdCount = leads.filter((l) => l.source === 'meta_ad').length;
  const csvCount = leads.filter((l) => l.source === 'csv_import').length;
  const socialCount = leads.filter((l) => l.source === 'inbound_social').length;

  const positiveReplies = replies.filter((r) => r.sentiment === 'positive').length;
  const appointmentsCount = leads.filter((l) => l.stage === 'Appointment').length;
  const customerCount = leads.filter((l) => l.stage === 'Customer').length;

  const emailsSent = currentWs.limits.emails.used;
  const deliveryRate = 98.2;
  const bounceRate = 1.8;

  // Pipeline stage chart data
  const pipelineData = [
    { name: 'Lead', count: leads.filter((l) => l.stage === 'Lead').length },
    { name: 'Contacted', count: leads.filter((l) => l.stage === 'Contacted').length },
    { name: 'Engaged', count: leads.filter((l) => l.stage === 'Engaged').length },
    { name: 'Qualified', count: leads.filter((l) => l.stage === 'Qualified').length },
    { name: 'Appointment', count: appointmentsCount },
    { name: 'Opportunity', count: leads.filter((l) => l.stage === 'Opportunity').length },
    { name: 'Customer', count: customerCount },
  ];

  const sourceData = [
    { name: 'Apollo B2B', value: apolloCount, color: '#2563eb' },
    { name: 'Web Forms', value: webFormCount, color: '#10b981' },
    { name: 'Meta Ads', value: metaAdCount, color: '#f59e0b' },
    { name: 'CSV Import', value: csvCount, color: '#8b5cf6' },
    { name: 'Social', value: socialCount, color: '#ec4899' },
  ];

  const conversionFunnel = [
    { stage: 'Leads Ingested', value: totalLeads, rate: '100%' },
    { stage: 'Outreach Delivered', value: Math.floor(totalLeads * 0.92), rate: '92.0%' },
    { stage: 'Prospect Responses', value: replies.length, rate: `${((replies.length / totalLeads) * 100).toFixed(1)}%` },
    { stage: 'Positive / Booked', value: positiveReplies + appointmentsCount, rate: `${(((positiveReplies + appointmentsCount) / totalLeads) * 100).toFixed(1)}%` },
    { stage: 'Converted Customer', value: customerCount, rate: `${((customerCount / totalLeads) * 100).toFixed(1)}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">05 OUTPUT</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dashboard</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Executive Performance & Funnel Conversion
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time attribution and unit metrics calculated dynamically from workspace data records.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="analytics_views" count={totalLeads} />
          <DiagramChip reference="05 Output / Dashboard" type="built" />
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Leads Ingested</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
            {totalLeads}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>100% matched to tables</span>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Outbound Emails Sent</span>
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
            {emailsSent.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Delivery: {deliveryRate}% | Bounce: {bounceRate}%
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Positive Responses</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
            {positiveReplies}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {replies.length} total inbound replies
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Appointments Booked</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
            {appointmentsCount}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {customerCount} converted deals
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Distribution Bar Chart */}
        <div className="lg:col-span-8 glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              CRM Stage Distribution (PostgreSQL Leads)
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Stage Counts</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 24, 34, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Distribution */}
        <div className="lg:col-span-4 glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Leads by Ingestion Source
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{totalLeads} Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {sourceData.map((src) => (
              <div key={src.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-700 dark:text-slate-300">{src.name}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {src.value} ({((src.value / totalLeads) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(src.value / totalLeads) * 100}%`,
                      backgroundColor: src.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel & SMS Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-6 glass-dense p-5 rounded-panel space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            End-to-End Conversion Funnel
          </h3>
          <div className="space-y-2">
            {conversionFunnel.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[10px]">0{idx + 1}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.stage}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-accent">
                    {item.rate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS & AI Operational Spend */}
        <div className="lg:col-span-6 glass-panel p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            SMS Activity & AI Resource Utilization
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">Twilio SMS Processed</div>
              <div className="text-xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
                {currentWs.limits.sms.used} / {currentWs.limits.sms.max}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">10DLC A2P Carrier Verified</div>
            </div>

            <div className="p-3.5 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">AI Inference Spend</div>
              <div className="text-xl font-mono-numbers font-bold text-emerald-600 dark:text-emerald-400">
                ${currentWs.limits.aiSpend.used.toFixed(2)} / ${currentWs.limits.aiSpend.max}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Under $250.00 Monthly Ceiling</div>
            </div>
          </div>

          <div className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Active Campaign Performance</div>
            <div>
              {sequences[0]?.name || 'Direct Outreach Cadence'}: {sequences[0]?.openRate || 58.4}% open rate, {sequences[0]?.replyRate || 16.2}% reply rate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
