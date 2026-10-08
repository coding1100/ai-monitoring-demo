import React from 'react';
import {
  Coins,
  DollarSign,
  PieChart as PieIcon,
  Cpu,
  BarChart2,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { useDemoStore } from '../../store/useDemoStore';
import { WORKSPACES } from '../../data/mockData';

export const CostsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const plans = useDemoStore((state) => state.plans).filter((p) => p.workspace_id === currentWorkspaceId);
  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  const campaignCosts = [
    { name: 'NYC Med Spa Direct Cadence', cost: 18.40, leads: 100, costPerLead: '$0.18', status: 'Active' },
    { name: 'Q4 Cold Lead Re-engagement', cost: 8.20, leads: 45, costPerLead: '$0.18', status: 'Completed' },
    { name: 'Spring Partnership Briefing', cost: 14.80, leads: 80, costPerLead: '$0.19', status: 'Scheduled' },
  ];

  const tokensByTask = [
    { task: 'Lead Scoring & Feature Extraction', model: 'gpt-4o-mini', tokens: '1,369,600', cost: '$0.21' },
    { task: 'Inbound Reply Sentiment Classifier', model: 'gpt-4o-mini', tokens: '160,200', cost: '$0.02' },
    { task: 'Personalization Hooks Synthesis', model: 'gpt-4o', tokens: '1,207,000', cost: '$3.02' },
    { task: 'Campaign Prompt Architecture', model: 'gpt-4o', tokens: '55,800', cost: '$0.14' },
  ];

  const vendorEstimates = [
    { vendor: 'OpenAI (Inference Tokens)', current: `$${currentWs.limits.aiSpend.used.toFixed(2)}`, projected: '$84.00' },
    { vendor: 'Instantly.ai (Cold Email API)', current: '$37.00', projected: '$37.00' },
    { vendor: 'Twilio (SMS & 10DLC Carrier Surcharges)', current: '$12.40', projected: '$18.50' },
    { vendor: 'Apollo.io (B2B Lead Credits)', current: '$49.00', projected: '$49.00' },
    { vendor: 'ZeroBounce (Email Verification)', current: '$8.50', projected: '$12.00' },
  ];

  const aiUsed = currentWs.limits.aiSpend.used;
  const aiMax = currentWs.limits.aiSpend.max;
  const spendPercent = Math.min(100, Math.round((aiUsed / aiMax) * 100));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">05 OUTPUT</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Costs</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Unit Economics & Token Expenditure
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Transparent per-campaign cost breakdown, task token consumption, spend caps, and monthly vendor estimates.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="billing_meter_ledgers" />
          <DiagramChip reference="05 Output / Costs" type="built" />
        </div>
      </div>

      {/* Spend Cap Guardrail Meter */}
      <div className="glass-panel p-6 space-y-3 border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Workspace Spend Ceiling Progress
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Enforced in code rule #07: Halts all automated queries if total expenditure reaches cap.
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-mono-numbers font-bold text-emerald-600 dark:text-emerald-400">
              ${aiUsed.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-500"> / ${aiMax}.00 limit</span>
          </div>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${spendPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>{spendPercent}% allocated this billing cycle</span>
          <span>${(aiMax - aiUsed).toFixed(2)} remaining</span>
        </div>
      </div>

      {/* Cost Per Campaign Breakdown Table */}
      <div className="glass-dense p-5 rounded-panel space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Expenditure Per Campaign Plan
        </h3>

        <table className="w-full text-left text-xs table-compact">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
              <th className="px-3 py-2 font-medium">Campaign Description</th>
              <th className="px-3 py-2 font-medium">Audience Size</th>
              <th className="px-3 py-2 font-medium">Total Cost</th>
              <th className="px-3 py-2 font-medium">Unit Cost / Lead</th>
              <th className="px-3 py-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {campaignCosts.map((cmp, idx) => (
              <tr key={idx} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 font-mono">
                <td className="px-3 py-2 font-sans font-medium text-slate-900 dark:text-slate-100">
                  {cmp.name}
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{cmp.leads}</td>
                <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                  ${cmp.cost.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-emerald-600">{cmp.costPerLead}</td>
                <td className="px-3 py-2 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-200/60 dark:bg-slate-800/60">
                    {cmp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Two Columns: Tokens by Task & Monthly Vendor Cost Estimate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokens by Task & Model */}
        <div className="glass-panel p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Tokens Incurred by Model Task
          </h3>
          <div className="space-y-2">
            {tokensByTask.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs flex items-center justify-between font-mono"
              >
                <div>
                  <div className="font-sans font-medium text-slate-800 dark:text-slate-200">
                    {t.task}
                  </div>
                  <div className="text-[10px] text-slate-500">Tier Model: {t.model}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{t.tokens} tokens</div>
                  <div className="text-[10px] text-slate-500">{t.cost}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Vendor Estimates */}
        <div className="glass-panel p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Estimated Monthly Vendor Infrastructure
          </h3>
          <div className="space-y-2">
            {vendorEstimates.map((v, idx) => (
              <div
                key={idx}
                className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs flex items-center justify-between font-mono"
              >
                <span className="font-sans font-medium text-slate-800 dark:text-slate-200">
                  {v.vendor}
                </span>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{v.current}</div>
                  <div className="text-[10px] text-slate-500">Proj: {v.projected} / mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
