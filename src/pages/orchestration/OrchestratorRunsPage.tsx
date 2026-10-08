import React, { useState } from 'react';
import {
  GitFork,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  XCircle,
  PauseCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { WorkflowRun } from '../../types';

export const OrchestratorRunsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const runs = useDemoStore((state) => state.runs).filter((r) => r.workspace_id === currentWorkspaceId);
  const retryRun = useDemoStore((state) => state.retryRun);

  const [activeTab, setActiveTab] = useState<'all' | 'dead_letter'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(runs[0]?.id || null);

  const filteredRuns = runs.filter((r) => {
    if (activeTab === 'dead_letter') return r.isDeadLetter || r.status === 'failed';
    if (statusFilter !== 'all') return r.status === statusFilter;
    return true;
  });

  const selectedRun: WorkflowRun | undefined = runs.find((r) => r.id === selectedRunId) || filteredRuns[0];

  const handleRetry = async (runId: string) => {
    retryRun(runId);
  };

  const getStatusBadge = (status: WorkflowRun['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> success
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
            <Play className="w-3 h-3 fill-current" /> running
          </span>
        );
      case 'retried':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <RotateCcw className="w-3 h-3" /> retried
          </span>
        );
      case 'paused_by_rule':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <PauseCircle className="w-3 h-3" /> paused by rule
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" /> failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">02 ORCHESTRATION</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">n8n Orchestrator</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Workflow Execution Runs
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Live execution telemetry, step timeline analysis, rate-limit retries, and quarantine handling.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="n8n_executions" count={runs.length} />
          <DiagramChip reference="02 Orchestration / n8n orchestrator" type="built" />
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-panel p-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            All Executions ({runs.length})
          </button>
          <button
            onClick={() => setActiveTab('dead_letter')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
              activeTab === 'dead_letter'
                ? 'bg-red-600 text-white'
                : 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Dead-Letter Queue ({runs.filter((r) => r.isDeadLetter || r.status === 'failed').length})</span>
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="running">running</option>
              <option value="success">success</option>
              <option value="retried">retried</option>
              <option value="paused_by_rule">paused by rule</option>
              <option value="failed">failed</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table of Runs */}
        <div className="lg:col-span-7">
          <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
            <table className="w-full text-left text-xs table-compact border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                  <th className="px-3 py-2 font-medium">Run ID</th>
                  <th className="px-3 py-2 font-medium">Workflow</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Duration</th>
                  <th className="px-3 py-2 font-medium">Started</th>
                  <th className="px-3 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
                {filteredRuns.map((r) => {
                  const isSelected = r.id === selectedRunId;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRunId(r.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-500/10'
                          : 'hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {r.id}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                        {r.workflowName}
                      </td>
                      <td className="px-3 py-2">{getStatusBadge(r.status)}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                        {r.duration}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">
                        {r.startedAt.slice(11)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {(r.status === 'failed' || r.status === 'retried' || r.isDeadLetter) && (
                          <ActionButton
                            rbacAction="trigger_run"
                            variant="secondary"
                            size="sm"
                            onAsyncClick={() => handleRetry(r.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] py-1 px-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </ActionButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel: Step Timeline */}
        <div className="lg:col-span-5">
          {selectedRun ? (
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">
                    Execution Step Timeline
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {selectedRun.workflowName}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    ID: {selectedRun.id} | Campaign: {selectedRun.campaignId}
                  </div>
                </div>
                {getStatusBadge(selectedRun.status)}
              </div>

              {/* Error message banner if present */}
              {selectedRun.error && (
                <div className="p-3 rounded-control bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Workflow Exception Encountered:</span>
                  </div>
                  <p className="font-mono text-[11px]">{selectedRun.error}</p>
                </div>
              )}

              {/* Step Timeline */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                  Node Progression
                </div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {selectedRun.steps.map((step, idx) => (
                    <div key={step.id} className="relative flex items-start gap-3 text-xs pl-2">
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 z-10 flex items-center justify-center shrink-0 ${
                          step.status === 'done'
                            ? 'bg-emerald-500 text-white'
                            : step.status === 'running'
                            ? 'bg-blue-500 text-white animate-pulse'
                            : step.status === 'failed'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        <span className="text-[9px] font-bold">{idx + 1}</span>
                      </div>

                      <div className="flex-1 p-2.5 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {step.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {step.latency}
                          </span>
                        </div>
                        {step.outputSummary && (
                          <div className="text-[11px] text-slate-500 mt-1 font-mono">
                            {step.outputSummary}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-end">
                <ActionButton
                  rbacAction="trigger_run"
                  variant="primary"
                  size="sm"
                  onAsyncClick={() => handleRetry(selectedRun.id)}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Execute Node Re-Run</span>
                </ActionButton>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-xs text-slate-500">
              Select a run from the table to view step timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
