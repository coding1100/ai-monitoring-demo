import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  Shield,
  RefreshCw,
  Server,
  Zap,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';

export const OperatorPage: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const runs = useDemoStore((state) => state.runs).filter((r) => r.workspace_id === currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter((l) => l.workspace_id === currentWorkspaceId);
  const rules = useDemoStore((state) => state.rules).filter((r) => r.workspace_id === currentWorkspaceId);

  const [systemPaused, setSystemPaused] = useState(false);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);

  const activeRuns = runs.filter((r) => r.status === 'running').length;

  const handleToggleSystem = async () => {
    setSystemPaused(!systemPaused);
  };

  const handleTripCircuit = async () => {
    setCircuitBreakerTripped(!circuitBreakerTripped);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">01 CONTROL</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Operator</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Operator Cockpit
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Real-time manual overrides, agent status monitoring, and global execution circuit breakers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="workflow_executions" count={runs.length} />
          <DiagramChip reference="01 Control / Operator" type="built" />
        </div>
      </div>

      {/* Main Operational Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Platform State</span>
            <Activity className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                systemPaused
                  ? 'bg-amber-500'
                  : circuitBreakerTripped
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {circuitBreakerTripped
                ? 'Circuit Tripped'
                : systemPaused
                ? 'Queue Paused'
                : 'All Systems Nominal'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Sending window: 09:00 - 17:00 EST
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Agent Runs</span>
            <Zap className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-mono-numbers font-semibold text-slate-900 dark:text-slate-100">
            {activeRuns}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {runs.length} total logged this cycle
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Enforced Code Rules</span>
            <Shield className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-mono-numbers font-semibold text-slate-900 dark:text-slate-100">
            {rules.length} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            100% evaluated in code
          </div>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Current Tenant Scope</span>
            <Server className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">
            {currentWorkspaceId}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            {leads.length} contacts bound
          </div>
        </div>
      </div>

      {/* Operator Override Controls */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Manual Emergency Overrides
            </h3>
            <p className="text-xs text-slate-500">
              Direct operator actions bypass orchestration schedule queues immediately.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Requires Admin or Operator Role
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-control border border-slate-300/40 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Outbound Sequence Pause
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Temporarily freeze all outbound email and SMS dispatches.
              </div>
            </div>
            <ActionButton
              rbacAction="manage_rules"
              variant={systemPaused ? 'primary' : 'secondary'}
              size="sm"
              onAsyncClick={handleToggleSystem}
            >
              {systemPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{systemPaused ? 'Resume Outbound' : 'Pause Outbound'}</span>
            </ActionButton>
          </div>

          <div className="p-4 rounded-control border border-slate-300/40 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-900/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Safety Circuit Breaker
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Halt all webhook listeners and kill running LLM completions.
              </div>
            </div>
            <ActionButton
              rbacAction="manage_rules"
              variant={circuitBreakerTripped ? 'primary' : 'danger'}
              size="sm"
              onAsyncClick={handleTripCircuit}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{circuitBreakerTripped ? 'Reset Breaker' : 'Trip Breaker'}</span>
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Live Runs Feed */}
      <div className="glass-dense p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Active Orchestrator Workers
          </h3>
          <button
            onClick={() => navigate('/orchestration/runs')}
            className="text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>View all runs</span>
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {runs.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    r.status === 'success'
                      ? 'bg-emerald-500'
                      : r.status === 'running'
                      ? 'bg-blue-500 animate-pulse'
                      : r.status === 'retried'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {r.workflowName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ID: {r.id} | Trigger: {r.trigger}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                <span>{r.duration}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/50">
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
