import React, { useState } from 'react';
import {
  Binary,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  AlertTriangle,
  History,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { CodeRule } from '../../types';

export const RulesInCodePage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const rules = useDemoStore((state) => state.rules).filter((r) => r.workspace_id === currentWorkspaceId);
  const ruleLogs = useDemoStore((state) => state.ruleLogs).filter((l) => l.workspace_id === currentWorkspaceId);
  const updateRule = useDemoStore((state) => state.updateRule);
  const addRuleLog = useDemoStore((state) => state.addRuleLog);
  const addSuppression = useDemoStore((state) => state.addSuppression);
  const runs = useDemoStore((state) => state.runs);

  const [notification, setNotification] = useState<string | null>(null);

  // 1. Simulate Opt-out: writes to suppression list & adds blocked rule decision
  const handleSimulateOptOut = async () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const targetEmail = `dr.miller@tribeca-clinic-${Math.floor(Math.random() * 900 + 100)}.com`;

    addSuppression({
      id: `sup_sim_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      type: 'email',
      value: targetEmail,
      reason: 'user_opt_out',
      source: 'Simulation: Inbound STOP reply',
      addedAt: timestamp.slice(0, 16),
    });

    addRuleLog({
      id: `log_sim_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      timestamp,
      ruleCode: 'RULE_OPT_OUT_IMMEDIATE',
      ruleName: 'Immediate Opt-Out Suppression',
      target: targetEmail,
      action: 'blocked',
      reason: 'Simulated unsubscribe received. Record written to suppression list & pending cron canceled in code.',
    });

    setNotification(`Simulated Opt-Out: Suppressed ${targetEmail} immediately in code & registered in suppression table.`);
  };

  // 2. Simulate Bounce Spike: trips bounce threshold rule & pauses active campaign run
  const handleSimulateBounceSpike = async () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    addRuleLog({
      id: `log_sim_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      timestamp,
      ruleCode: 'RULE_BOUNCE_THRESHOLD_PAUSE',
      ruleName: 'Bounce Threshold Auto-Pause',
      target: 'Campaign Batch #04',
      action: 'blocked',
      reason: 'Simulated 5.2% hard-bounce spike detected over 24h rolling window (Threshold: 4.5%). Active campaign paused.',
    });

    setNotification('Simulated Bounce Spike: 5.2% bounce rate tripped rule #05. Campaign safely halted in code.');
  };

  // 3. Simulate Spend Cap: blocks execution because campaign cost limit reached
  const handleSimulateSpendCap = async () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    addRuleLog({
      id: `log_sim_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      timestamp,
      ruleCode: 'RULE_CAMPAIGN_SPEND_CAP',
      ruleName: 'Spend Cap Per Campaign',
      target: `cmp_${currentWorkspaceId}_01`,
      action: 'blocked',
      reason: 'Simulated enrichment request ($254.20) breached maximum cap ($250.00). Execution halted in code.',
    });

    setNotification('Simulated Spend Cap Breach: Operation exceeded $250.00 limit. Throttled in code.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">02 ORCHESTRATION</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Rules in Code</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Code-Enforced Guardrails
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            8 hardcoded safety constraints evaluated prior to every external network or AI action.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="guardrail_rules" count={rules.length} />
          <DiagramChip reference="02 Orchestration / Rules in code" type="built" />
        </div>
      </div>

      {/* Simulator Test Buttons Bar */}
      <div className="glass-panel p-5 space-y-3 border-l-4 border-l-accent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Interactive Guardrail Simulators
            </h3>
            <p className="text-xs text-slate-500">
              Trigger real-time edge cases to verify deterministic code enforcement and log auditing.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-accent font-medium">
            No API side-effects
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <ActionButton
            rbacAction="manage_rules"
            variant="secondary"
            size="sm"
            onAsyncClick={handleSimulateOptOut}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
            <span>Simulate Opt-Out</span>
          </ActionButton>

          <ActionButton
            rbacAction="manage_rules"
            variant="secondary"
            size="sm"
            onAsyncClick={handleSimulateBounceSpike}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Bounce Spike</span>
          </ActionButton>

          <ActionButton
            rbacAction="manage_rules"
            variant="secondary"
            size="sm"
            onAsyncClick={handleSimulateSpendCap}
          >
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span>Simulate Spend Cap Breach</span>
          </ActionButton>
        </div>

        {notification && (
          <div className="p-3 rounded-control bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-mono flex items-center justify-between mt-2 animate-fade-in">
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-[10px] underline ml-2 opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="glass-dense p-4 rounded-panel border border-slate-200/60 dark:border-slate-800/60 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {rule.name}
                  </h4>
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    enforced in code
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{rule.code}</div>
              </div>

              {/* Editable toggle or value */}
              {rule.type === 'toggle' ? (
                <button
                  type="button"
                  onClick={() => updateRule(rule.id, { value: !rule.value })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.value ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      rule.value ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : (
                <div className="flex items-center gap-1 font-mono text-xs">
                  <input
                    type={rule.type === 'number' ? 'number' : 'text'}
                    value={String(rule.value)}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        value: rule.type === 'number' ? Number(e.target.value) : e.target.value,
                      })
                    }
                    className="w-16 px-1.5 py-0.5 text-right rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-500">{rule.unit}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {rule.description}
            </p>
          </div>
        ))}
      </div>

      {/* Decision Log Table */}
      <div className="glass-dense p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Code Decision Log (Audit Stream)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {ruleLogs.length} recent evaluations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Timestamp</th>
                <th className="px-3 py-2 font-medium">Rule Evaluated</th>
                <th className="px-3 py-2 font-medium">Target Prospect / Batch</th>
                <th className="px-3 py-2 font-medium">Decision</th>
                <th className="px-3 py-2 font-medium">Enforcement Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {ruleLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                    <div>{log.ruleName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{log.ruleCode}</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {log.target}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        log.action === 'allowed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}
                    >
                      {log.action === 'allowed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{log.action}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {log.reason}
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
