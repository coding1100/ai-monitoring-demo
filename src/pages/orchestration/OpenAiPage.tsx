import React, { useState } from 'react';
import {
  Cpu,
  Key,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';

export const OpenAiPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const connections = useDemoStore((state) => state.connections)[currentWorkspaceId] || [];
  const testConnection = useDemoStore((state) => state.testConnection);

  const openAiConn = connections.find((c) => c.category === 'llm') || {
    id: 'conn_llm',
    name: 'OpenAI API',
    apiKeyMasked: 'sk-proj-••••••••••••94fA',
    status: 'connected',
    lastTested: '2026-03-28 09:30',
    details: 'Latency 412ms, 200 OK.',
  };

  const [monthlyTokenCap, setMonthlyTokenCap] = useState(2500000);
  const [tokensUsed, setTokensUsed] = useState(684000);

  const handleTest = async () => {
    await testConnection('conn_llm');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">02 ORCHESTRATION</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">OpenAI API</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            OpenAI API Provider Configuration
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Tenant-isolated API keys, monthly token allowances, and upstream model connectivity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="workspace_integrations" />
          <DiagramChip reference="02 Orchestration / OpenAI API" type="bought" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credentials Card */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-control bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  OpenAI Organization Account
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Tenant scope: {currentWorkspaceId}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-[6px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{openAiConn.status}</span>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Secret API Key (Masked)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={openAiConn.apiKeyMasked}
                  className="w-full px-3 py-2 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 select-all"
                />
                <ActionButton
                  rbacAction="test_connection"
                  variant="primary"
                  size="sm"
                  onAsyncClick={handleTest}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </ActionButton>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Last tested: {openAiConn.lastTested} | Details: {openAiConn.details}
              </p>
            </div>

            {/* Monthly Token Cap Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Monthly Token Cap
                </label>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {(tokensUsed / 1000).toFixed(0)}k / {(monthlyTokenCap / 1000000).toFixed(1)}M tokens
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={250000}
                value={monthlyTokenCap}
                onChange={(e) => setMonthlyTokenCap(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>500k min</span>
                <span>Enforced in code rule #07</span>
                <span>5.0M max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inference Status Card */}
        <div className="glass-dense p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Assigned Models
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>gpt-4o</span>
                <span className="text-emerald-600 font-mono text-[10px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Assigned to Campaign Compiler and Persona Copywriter.
              </p>
            </div>

            <div className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>gpt-4o-mini</span>
                <span className="text-emerald-600 font-mono text-[10px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Assigned to Sentiment Classifier, B2B Scorer, and DLQ sanitizer.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-control bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500">
            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deterministic Seed Guarantee
            </div>
            All demo LLM completions run with zero external HTTP traffic using in-memory PRNG state.
          </div>
        </div>
      </div>
    </div>
  );
};
