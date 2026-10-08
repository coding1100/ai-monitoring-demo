import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileText,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { WORKSPACES } from '../../data/mockData';

export const PlanUsagePage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  const limits = currentWs.limits;

  const meters = [
    {
      name: 'Monthly Verified Leads',
      used: limits.leads.used,
      max: limits.leads.max,
      unit: 'leads',
      pct: Math.round((limits.leads.used / limits.leads.max) * 100),
      color: '#2563eb',
    },
    {
      name: 'Outbound Email Dispatches',
      used: limits.emails.used,
      max: limits.emails.max,
      unit: 'emails',
      pct: Math.round((limits.emails.used / limits.emails.max) * 100),
      color: '#10b981',
    },
    {
      name: 'Twilio SMS Outbound Units',
      used: limits.sms.used,
      max: limits.sms.max,
      unit: 'sms',
      pct: Math.round((limits.sms.used / limits.sms.max) * 100),
      color: '#8b5cf6',
    },
    {
      name: 'AI Model Completion Spend',
      used: limits.aiSpend.used,
      max: limits.aiSpend.max,
      unit: 'USD',
      pct: Math.round((limits.aiSpend.used / limits.aiSpend.max) * 100),
      color: '#f59e0b',
    },
  ];

  const plans = [
    {
      name: 'Starter Tier',
      price: '$149 / mo',
      desc: 'Single provider practice with up to 250 leads and basic email sequencing.',
      active: currentWs.tier === 'Growth' ? false : false,
    },
    {
      name: 'Growth Tier',
      price: '$349 / mo',
      desc: 'Expanding multi-channel practice with 500 leads, Twilio 10DLC, and LLM hooks.',
      active: currentWs.tier === 'Growth',
    },
    {
      name: 'Professional Tier',
      price: '$799 / mo',
      desc: 'High-throughput agency package with dedicated IP warmup and unlimited rules.',
      active: currentWs.tier === 'Professional',
    },
  ];

  const invoices = [
    { id: 'INV-2026-03', date: '2026-03-01', amount: '$349.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-02', date: '2026-02-01', amount: '$349.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-01', date: '2026-01-01', amount: '$349.00', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">WORKSPACE</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Plan & Usage</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Plan Allocation & Resource Consumption Meters
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time usage quotas for leads, emails, SMS, and AI expenditure with auto-throttle thresholds.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="billing_subscriptions" />
          <DiagramChip reference="Workspace / Plan & usage" type="built" />
        </div>
      </div>

      {/* 4 Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {meters.map((m) => (
          <div key={m.name} className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-800 dark:text-slate-200">{m.name}</span>
              <span className="font-mono text-[11px] font-semibold">{m.pct}%</span>
            </div>

            <div className="text-xl font-mono-numbers font-bold text-slate-900 dark:text-slate-100">
              {m.unit === 'USD' ? `$${m.used.toFixed(2)}` : m.used.toLocaleString()}
              <span className="text-xs font-normal text-slate-500">
                {' '}
                / {m.unit === 'USD' ? `$${m.max}.00` : m.max.toLocaleString()}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${m.pct}%`, backgroundColor: m.color }}
              />
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              Resets at billing cycle renewal (Apr 1)
            </div>
          </div>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="glass-dense p-6 rounded-panel space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Available Subscription Tiers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-5 rounded-control border space-y-3 text-xs relative ${
                p.active
                  ? 'border-accent bg-blue-500/10 shadow-sm'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              {p.active && (
                <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-white font-semibold">
                  Current Tier
                </span>
              )}
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</h4>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{p.price}</div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{p.desc}</p>
              <div className="pt-2">
                <ActionButton
                  rbacAction="manage_billing"
                  variant={p.active ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={p.active}
                  className="w-full"
                >
                  {p.active ? 'Active Plan' : 'Upgrade Workspace'}
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="glass-panel p-5 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Billing & Invoice Statements
        </h3>

        <div className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{inv.id}</div>
                  <div className="text-[10px] text-slate-500">{inv.date} | {inv.method}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{inv.amount}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600">
                  {inv.status}
                </span>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
