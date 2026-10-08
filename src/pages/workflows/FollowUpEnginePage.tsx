import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { fakeDelay } from '../../utils/seededRandom';

export const FollowUpEnginePage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const followUpRules = useDemoStore((state) => state.followUpRules).filter(
    (r) => r.workspace_id === currentWorkspaceId
  );

  // Playground state
  const [testReplyText, setTestReplyText] = useState(
    'Hi Marcus, thanks for the benchmark info. Can we schedule a brief 15-minute call this Thursday afternoon to discuss pricing?'
  );
  const [evaluatedResult, setEvaluatedResult] = useState<{
    sentiment: string;
    actionTaken: string;
    crmUpdate: string;
    guardrailTriggered: string;
  } | null>({
    sentiment: 'positive',
    actionTaken: 'Advance CRM stage to "Qualified", pause all scheduled automated touches, and notify sales rep in Slack #ops-alerts.',
    crmUpdate: 'Status changed from Contacted -> Qualified',
    guardrailTriggered: 'RULE_STOP_ON_REPLY (Enforced in code)',
  });

  const handleTestClassifier = async () => {
    await fakeDelay(500);

    const lower = testReplyText.toLowerCase();
    if (lower.includes('stop') || lower.includes('unsubscribe') || lower.includes('remove')) {
      setEvaluatedResult({
        sentiment: 'unsubscribe',
        actionTaken: 'Immediately append to suppression list, cancel pending runs, set consent status to Unsubscribed.',
        crmUpdate: 'Status updated to Unsubscribed; deal tagged as Closed/Lost.',
        guardrailTriggered: 'RULE_OPT_OUT_IMMEDIATE (Enforced in code)',
      });
    } else if (lower.includes('not now') || lower.includes('later') || lower.includes('busy')) {
      setEvaluatedResult({
        sentiment: 'not now',
        actionTaken: 'Set follow-up timer for 90 days. Pause current sequence cadence.',
        crmUpdate: 'Status kept at Contacted; follow-up task added to CRM backlog.',
        guardrailTriggered: 'RULE_STOP_ON_REPLY (Enforced in code)',
      });
    } else if (lower.includes('out of office') || lower.includes('traveling') || lower.includes('away')) {
      setEvaluatedResult({
        sentiment: 'out of office',
        actionTaken: 'Hold sequence touches for 7 days then resume Step 2 dispatch.',
        crmUpdate: 'No stage alteration.',
        guardrailTriggered: 'Timer pause active',
      });
    } else {
      setEvaluatedResult({
        sentiment: 'positive',
        actionTaken: 'Advance CRM stage to "Qualified", pause all scheduled automated touches, and notify sales rep in Slack #ops-alerts.',
        crmUpdate: 'Status changed from Contacted -> Qualified',
        guardrailTriggered: 'RULE_STOP_ON_REPLY (Enforced in code)',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Follow-up Engine</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Follow-Up Engine & Dynamic State Machine
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Event-driven state transitions routing prospects between sequence delays, CRM stages, and alerts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="followup_transition_matrix" count={followUpRules.length} />
          <DiagramChip reference="03 Workflows / Follow-up engine" type="built" />
        </div>
      </div>

      {/* Rules Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Event Transition Matrix (5 Core Triggers)
          </h3>
          <span className="text-[10px] font-mono text-emerald-600">Active in n8n Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Trigger Event Condition</th>
                <th className="px-3 py-2 font-medium">Target Channel</th>
                <th className="px-3 py-2 font-medium">Automated System Action</th>
                <th className="px-3 py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {followUpRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                    <div>{rule.eventLabel}</div>
                    <div className="text-[10px] font-mono text-slate-400">{rule.event}</div>
                  </td>
                  <td className="px-3 py-2 font-mono uppercase text-[10px] text-slate-600 dark:text-slate-400">
                    {rule.channel}
                  </td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300 text-xs">
                    {rule.action}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 font-medium">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Reply Playground */}
      <div className="glass-dense p-6 rounded-panel space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Interactive Reply Classifier & Action Playground
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste an inbound prospect email or SMS reply to evaluate the LLM sentiment classifier and observe triggered actions.
            </p>
          </div>
          <span className="text-[10px] font-mono text-accent">Test Environment</span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={testReplyText}
            onChange={(e) => setTestReplyText(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTestReplyText('Please stop emailing me and remove me immediately.')}
                className="text-[11px] font-mono text-slate-500 hover:text-accent underline"
              >
                Sample: Opt-out
              </button>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                onClick={() => setTestReplyText('I am currently out of office until Monday.')}
                className="text-[11px] font-mono text-slate-500 hover:text-accent underline"
              >
                Sample: Out of Office
              </button>
              <span className="text-slate-400">|</span>
              <button
                type="button"
                onClick={() => setTestReplyText('Sounds interesting, can you send pricing?')}
                className="text-[11px] font-mono text-slate-500 hover:text-accent underline"
              >
                Sample: Positive
              </button>
            </div>

            <ActionButton
              variant="primary"
              size="sm"
              onAsyncClick={handleTestClassifier}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluate Reply</span>
            </ActionButton>
          </div>
        </div>

        {evaluatedResult && (
          <div className="p-4 rounded-control bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <span className="font-mono text-slate-500">Classification Result:</span>
              <span className="px-2.5 py-0.5 rounded font-mono font-semibold uppercase text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                {evaluatedResult.sentiment}
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div>
                <span className="text-slate-500">Action Executed: </span>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{evaluatedResult.actionTaken}</span>
              </div>
              <div>
                <span className="text-slate-500">CRM State Mutation: </span>
                <span className="text-accent">{evaluatedResult.crmUpdate}</span>
              </div>
              <div>
                <span className="text-slate-500">Guardrail Enforced: </span>
                <span className="text-purple-600 dark:text-purple-400">{evaluatedResult.guardrailTriggered}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
