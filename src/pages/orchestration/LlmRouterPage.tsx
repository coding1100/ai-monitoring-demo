import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Zap,
  CheckCircle2,
  Sliders,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { fakeDelay } from '../../utils/seededRandom';

export const LlmRouterPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const testConnection = useDemoStore((state) => state.testConnection);

  const [testResult, setTestResult] = useState<string | null>(null);

  // Routing tasks table
  const tasks = [
    {
      task: 'Lead Qualification & Scoring',
      tier: 'Tier 1 (Small Model)',
      model: 'gpt-4o-mini',
      purpose: 'Extract practitioner license attributes and assign 0-100 fit score.',
      avgTokens: 320,
      monthlyVolume: '4,280 calls',
      costPerK: '$0.00015',
    },
    {
      task: 'Intent & Sentiment Classification',
      tier: 'Tier 1 (Small Model)',
      model: 'gpt-4o-mini',
      purpose: 'Categorize inbound prospect replies into 6 deterministic labels.',
      avgTokens: 180,
      monthlyVolume: '890 calls',
      costPerK: '$0.00015',
    },
    {
      task: 'Outreach Personalization Hooks',
      tier: 'Tier 2 (Large Model)',
      model: 'gpt-4o',
      purpose: 'Synthesize highly specific, clinic-referenced cold outreach icebreakers.',
      avgTokens: 850,
      monthlyVolume: '1,420 calls',
      costPerK: '$0.00250',
    },
    {
      task: 'Campaign Strategy Compilation',
      tier: 'Tier 2 (Large Model)',
      model: 'gpt-4o',
      purpose: 'Translate high-level operator commands into structured multi-touch schedules.',
      avgTokens: 1240,
      monthlyVolume: '45 calls',
      costPerK: '$0.00250',
    },
  ];

  const handleTestRouting = async () => {
    await fakeDelay(550);
    setTestResult('Latency: 382ms | Tier 1: 200 OK | Tier 2: 200 OK | Deterministic seed verified.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">02 ORCHESTRATION</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">LLM Router</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            LLM Router & Model Tier Matrix
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Task-to-tier routing table optimizing inference cost, latency, and reasoning depth per workspace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="llm_routing_configs" count={tasks.length} />
          <DiagramChip reference="02 Orchestration / LLM router" type="built" />
        </div>
      </div>

      {/* Model Tier Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tier 1 Small */}
        <div className="glass-panel p-5 space-y-3 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-control bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Tier 1: High-Speed / Extraction
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Model: gpt-4o-mini</span>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-semibold">$0.15 / 1M tokens</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dedicated to parsing structured data, scoring leads, filtering spam, and sentiment labeling. Latency target: &lt;450ms.
          </p>
        </div>

        {/* Tier 2 Large */}
        <div className="glass-panel p-5 space-y-3 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-control bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <BrainCircuit className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Tier 2: High-Reasoning / Synthesis
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Model: gpt-4o</span>
              </div>
            </div>
            <span className="text-xs font-mono text-purple-600 font-semibold">$2.50 / 1M tokens</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Dedicated to contextual copywriting, variable icebreakers, multi-channel cadences, and prompt compilation.
          </p>
        </div>
      </div>

      {/* Task Routing Table */}
      <div className="glass-dense p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Task-to-Tier Mapping Table
            </h3>
            <span className="text-xs text-slate-500">Enforced routing rules evaluated on each prompt dispatch</span>
          </div>

          <ActionButton
            rbacAction="test_connection"
            variant="secondary"
            size="sm"
            onAsyncClick={handleTestRouting}
          >
            <span>Test Model Router Latency</span>
          </ActionButton>
        </div>

        {testResult && (
          <div className="p-3 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Orchestration Task</th>
                <th className="px-3 py-2 font-medium">Assigned Tier</th>
                <th className="px-3 py-2 font-medium">Model ID</th>
                <th className="px-3 py-2 font-medium">Avg Tokens</th>
                <th className="px-3 py-2 font-medium">Est Monthly Vol</th>
                <th className="px-3 py-2 font-medium">Unit Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {tasks.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                    <div>{t.task}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{t.purpose}</div>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        t.tier.includes('Tier 1')
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                          : 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {t.tier}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {t.model}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{t.avgTokens}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{t.monthlyVolume}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{t.costPerK}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
