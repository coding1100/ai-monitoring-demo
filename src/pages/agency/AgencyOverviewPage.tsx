import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Cpu,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Server,
  Database,
  Mail,
  MessageSquare,
  CreditCard,
  UserPlus,
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
import { useDemoStore } from '../../store/useDemoStore';

export const AgencyOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const clientWorkspaces = useDemoStore((state) => state.clientWorkspaces);
  const activeWorkspacesCount = clientWorkspaces.filter((w) => w.status === 'active').length;

  const totalMrr = clientWorkspaces
    .filter((w) => w.status === 'active' || w.status === 'trial')
    .reduce((sum, w) => sum + w.revenue, 0);

  const totalAiSpend = clientWorkspaces.reduce((sum, w) => sum + w.aiSpend, 0);
  const avgMargin = (
    clientWorkspaces.reduce((sum, w) => sum + w.margin, 0) / (clientWorkspaces.length || 1)
  ).toFixed(1);

  const openAlertsCount = 2; // GHL rate limit, Twilio webhook latency

  // Revenue vs Cost Trend Chart (6 Months)
  const financialTrend = [
    { month: 'May', revenue: 3100, cost: 720, margin: 2380 },
    { month: 'Jun', revenue: 3600, cost: 840, margin: 2760 },
    { month: 'Jul', revenue: 4100, cost: 960, margin: 3140 },
    { month: 'Aug', revenue: 4500, cost: 1050, margin: 3450 },
    { month: 'Sep', revenue: 5100, cost: 1180, margin: 3920 },
    { month: 'Oct', revenue: totalMrr, cost: Math.round(totalMrr * (1 - Number(avgMargin) / 100)), margin: Math.round(totalMrr * (Number(avgMargin) / 100)) },
  ];

  // Workspaces by Plan Distribution
  const starterCount = clientWorkspaces.filter((w) => w.plan === 'Starter').length;
  const growthCount = clientWorkspaces.filter((w) => w.plan === 'Growth').length;
  const scaleCount = clientWorkspaces.filter((w) => w.plan === 'Scale').length;

  const planDistribution = [
    { name: 'Starter ($149)', value: starterCount, color: '#3b82f6' },
    { name: 'Growth ($349)', value: growthCount, color: '#2563eb' },
    { name: 'Scale ($799)', value: scaleCount, color: '#1d4ed8' },
  ];

  const healthServices = [
    { name: 'n8n Orchestrator', status: 'Healthy', latency: '42ms', icon: Server, color: 'text-emerald-600' },
    { name: 'Supabase Postgres', status: 'Healthy', latency: '18ms', icon: Database, color: 'text-emerald-600' },
    { name: 'GoHighLevel Sync', status: 'Degraded', latency: '310ms', icon: ShieldCheck, color: 'text-amber-600' },
    { name: 'Stripe Billing', status: 'Healthy', latency: '85ms', icon: CreditCard, color: 'text-emerald-600' },
    { name: 'Instantly Email', status: 'Healthy', latency: '92ms', icon: Mail, color: 'text-emerald-600' },
    { name: 'Twilio 10DLC SMS', status: 'Healthy', latency: '110ms', icon: MessageSquare, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-accent">AGENCY CONTROL TOWER</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Overview</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Agency Operations & Multi-Tenant Economics
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Unified control plane monitoring 12 provisioned client workspaces, platform margins, and infrastructure health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-control bg-accent hover:bg-accent-hover text-white shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>View client sign-up</span>
          </button>
          <DiagramChip reference="Agency / Executive Overview" type="built" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Active Workspaces
            </span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            {activeWorkspacesCount} <span className="text-xs text-slate-400 font-normal">/ {clientWorkspaces.length}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>100% tenant isolation active</span>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Agency Monthly MRR
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            ${totalMrr.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs previous cycle</span>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Total AI Spend
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            ${totalAiSpend.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            <span>Avg $0.027 per enriched lead</span>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Average Margin
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {avgMargin}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            <span>Exceeds target 70.0% threshold</span>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Open Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
            {openAlertsCount}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            <span>1 rate limit, 1 past due invoice</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Cost Chart (2 cols) */}
        <div className="lg:col-span-2 glass-dense p-5 rounded-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Monthly Revenue vs Platform Operational Cost
              </h3>
              <p className="text-[11px] text-slate-500">
                Gross subscription collections versus direct AI, verification, and compute costs.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Revenue</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Net Margin</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Gross Revenue" />
                <Bar dataKey="margin" fill="#10b981" radius={[4, 4, 0, 0]} name="Gross Margin" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workspaces by Plan Donut Chart (1 col) */}
        <div className="glass-dense p-5 rounded-panel space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Workspaces by Subscription Tier
            </h3>
            <p className="text-[11px] text-slate-500">
              Active client distribution across Starter, Growth, and Scale plans.
            </p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {clientWorkspaces.length}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Tenants</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-center font-mono">
            {planDistribution.map((p) => (
              <div key={p.name} className="p-2 rounded bg-slate-100/50 dark:bg-slate-900/50">
                <div className="text-[10px] text-slate-500">{p.name.split(' ')[0]}</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{p.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health Strip */}
      <div className="glass-panel p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Platform Integration & Infrastructure Health
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Global Uptime: 99.98%</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {healthServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className={`text-[10px] font-mono font-bold ${svc.color}`}>
                    {svc.status}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                  {svc.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Ping: {svc.latency}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
