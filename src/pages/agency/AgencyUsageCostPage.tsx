import React, { useState } from 'react';
import {
  Cpu,
  DollarSign,
  TrendingUp,
  Sliders,
  CheckCircle2,
  PieChart as PieIcon,
  Filter,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { DiagramChip } from '../../components/common/DiagramChip';
import { useDemoStore } from '../../store/useDemoStore';
import { ClientWorkspace } from '../../types';

export const AgencyUsageCostPage: React.FC = () => {
  const clientWorkspaces = useDemoStore((state) => state.clientWorkspaces);
  const [search, setSearch] = useState('');
  const [editingCapId, setEditingCapId] = useState<string | null>(null);
  const [tempCap, setTempCap] = useState<number>(25);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveCap = (ws: ClientWorkspace) => {
    ws.dailySpendCap = tempCap;
    setEditingCapId(null);
    showToast(`Daily spend cap for ${ws.name} saved to $${tempCap}/day`);
  };

  const totalTokensEstimatedMillions = 42.8;
  const avgCostPerLead = (
    clientWorkspaces.reduce((sum, w) => sum + w.tokenCostPerLead, 0) / clientWorkspaces.length
  ).toFixed(3);

  const avgCostPerCampaign = (
    clientWorkspaces.reduce((sum, w) => sum + w.tokenCostPerCampaign, 0) / clientWorkspaces.length
  ).toFixed(2);

  const filtered = clientWorkspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.subAccountName.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = filtered.map((w) => ({
    name: w.name.split(' ')[0],
    aiSpend: w.aiSpend,
    costPerLead: Number((w.tokenCostPerLead * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-6 animate-fade-in relative">
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3 rounded-control glass-modal border border-accent bg-blue-600/15 text-xs text-slate-900 dark:text-slate-100 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-accent">AGENCY CONTROL TOWER</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Usage & Cost</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Tenant Token Economics & Spend Guardrails
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Granular per-tenant LLM token tracking, lead unit economics, model tier splits, and daily budget caps.
          </p>
        </div>

        <DiagramChip reference="Agency / Token Telemetry" type="built" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Monthly Tokens Ingested
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            {totalTokensEstimatedMillions}M
          </div>
          <div className="text-[11px] text-slate-500">
            Across 12 client workspaces
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Average Cost Per Lead
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            ${avgCostPerLead}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Enrichment, scoring, and classification
          </div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Average Cost Per Campaign
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100">
            ${avgCostPerCampaign}
          </div>
          <div className="text-[11px] text-slate-500">
            Full cadence generation & sequence execution
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-dense p-5 rounded-panel space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tenant AI Token Expenditure ($)
          </h3>
          <span className="text-xs font-mono text-slate-500">Seeded Model Telemetry</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#f8fafc',
                }}
                formatter={(val: any) => [`$${val}`, 'Monthly AI Spend']}
              />
              <Bar dataKey="aiSpend" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Workspace Telemetry Table */}
      <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60 space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Per-Workspace Token Metrics & Daily Guardrail Caps
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter workspace..."
              aria-label="Filter workspace"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Workspace</th>
                <th className="px-3 py-2 font-medium">Total AI Spend</th>
                <th className="px-3 py-2 font-medium">Cost / Lead</th>
                <th className="px-3 py-2 font-medium">Cost / Campaign</th>
                <th className="px-3 py-2 font-medium">Model Split (Small vs Large)</th>
                <th className="px-3 py-2 font-medium text-right">Daily Spend Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {filtered.map((ws) => (
                <tr key={ws.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{ws.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{ws.plan} Plan</div>
                  </td>

                  <td className="px-3 py-2 font-mono font-bold text-blue-600">
                    ${ws.aiSpend.toFixed(1)}
                  </td>

                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">
                    ${ws.tokenCostPerLead}
                  </td>

                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">
                    ${ws.tokenCostPerCampaign}
                  </td>

                  <td className="px-3 py-2 font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                        <div style={{ width: `${ws.modelSplit.small}%` }} className="bg-blue-600 h-full" />
                        <div style={{ width: `${ws.modelSplit.large}%` }} className="bg-accent h-full opacity-60" />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {ws.modelSplit.small}% / {ws.modelSplit.large}%
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2 text-right">
                    {editingCapId === ws.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-slate-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          value={tempCap}
                          onChange={(e) => setTempCap(Number(e.target.value))}
                          className="w-16 px-1.5 py-0.5 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCap(ws)}
                          className="px-2 py-0.5 text-[10px] rounded bg-emerald-600 text-white font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCapId(ws.id);
                          setTempCap(ws.dailySpendCap);
                        }}
                        className="px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-accent text-slate-800 dark:text-slate-200 transition-colors"
                        title="Click to edit daily spend cap"
                      >
                        ${ws.dailySpendCap} / day
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
