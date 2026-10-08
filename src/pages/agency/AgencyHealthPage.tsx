import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  Layers,
  Clock,
} from 'lucide-react';
import { SystemWorkflowHealth } from '../../types';

interface AlertRule {
  id: string;
  title: string;
  description: string;
  channel: 'Slack' | 'Email' | 'SMS';
  enabled: boolean;
  severity: 'Critical' | 'Warning' | 'Info';
}

const INITIAL_ALERT_RULES: AlertRule[] = [
  {
    id: 'rule-01',
    title: 'Workflow Execution Error Rate > 1.0%',
    description: 'Triggers immediately when n8n node failure rate exceeds 1 percent within a 5-minute rolling window.',
    channel: 'Slack',
    enabled: true,
    severity: 'Critical',
  },
  {
    id: 'rule-02',
    title: 'Workspace Daily Spend Cap Exceeded',
    description: 'Notifies agency operations when a client reaches 90% of configured daily token expenditure.',
    channel: 'Email',
    enabled: true,
    severity: 'Warning',
  },
  {
    id: 'rule-03',
    title: 'GoHighLevel Rate Limit (HTTP 429)',
    description: 'Alerts operations when upstream CRM endpoints throttle batch contact synchronization webhooks.',
    channel: 'Slack',
    enabled: true,
    severity: 'Warning',
  },
  {
    id: 'rule-04',
    title: 'Payment Invoice Dunning Failure',
    description: 'Dispatches high-priority alert when customer card charge fails on secondary automated retry.',
    channel: 'SMS',
    enabled: true,
    severity: 'Critical',
  },
  {
    id: 'rule-05',
    title: 'Queue Depth Exceeds 250 Items',
    description: 'Monitors inbound Apollo and Meta webhook redis buffer depth for processing backpressure.',
    channel: 'Email',
    enabled: false,
    severity: 'Info',
  },
];

interface QueueCard {
  name: string;
  depth: number;
  avgLatency: string;
  status: 'normal' | 'congested';
}

const QUEUE_METRICS: QueueCard[] = [
  { name: 'Inbound Webhook Buffer', depth: 14, avgLatency: '42ms', status: 'normal' },
  { name: 'LLM Prompt Router Queue', depth: 6, avgLatency: '110ms', status: 'normal' },
  { name: 'GoHighLevel Sync Worker', depth: 32, avgLatency: '240ms', status: 'normal' },
  { name: 'Twilio SMS Dispatch Pool', depth: 0, avgLatency: '18ms', status: 'normal' },
];

export const AgencyHealthPage: React.FC = () => {
  const { systemWorkflows } = useDemoStore();
  const [workflows, setWorkflows] = useState<SystemWorkflowHealth[]>(systemWorkflows);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(INITIAL_ALERT_RULES);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerRun = (wf: SystemWorkflowHealth) => {
    setRunningWorkflowId(wf.id);
    setTimeout(() => {
      setRunningWorkflowId(null);
      setWorkflows((prev) =>
        prev.map((item) =>
          item.id === wf.id
            ? { ...item, executions24h: item.executions24h + 1, errorRate: 0.01 }
            : item
        )
      );
      showToast(`Dispatched manual execution trigger for ${wf.name}`);
    }, 600);
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Updated alert notification preference');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
              02 Orchestration / Health
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Infrastructure Telemetry</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Health & Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time status of n8n orchestration pipelines, Redis queue depths, operational error ledgers, and multi-channel alerting rules.
          </p>
        </div>

        <button
          onClick={() => showToast('Polled all workflow engine health endpoints')}
          className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCw className="h-3.5 w-3.5 text-slate-500" />
          Poll Status Now
        </button>
      </div>

      {/* Queue Depths Row */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-blue-500" />
          Execution Buffer & Queue Depths
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {QUEUE_METRICS.map((queue, idx) => (
            <div
              key={idx}
              className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{queue.name}</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {queue.depth}
                </span>
                <span className="text-xs text-slate-400">items in flight</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Avg latency</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {queue.avgLatency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* n8n Orchestration Workflows List */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              n8n Orchestration Pipelines ({workflows.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Host: n8n-cluster-primary.internal (v1.64.3)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Workflow Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">24h Executions</th>
                <th className="px-4 py-3 text-right">Error Rate</th>
                <th className="px-4 py-3 text-right">Avg Duration</th>
                <th className="px-4 py-3 text-right">Manual Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {workflows.map((wf) => {
                const isTriggering = runningWorkflowId === wf.id;

                return (
                  <tr key={wf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {wf.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {wf.id}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          wf.status === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : wf.status === 'degraded'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            wf.status === 'healthy'
                              ? 'bg-emerald-500'
                              : wf.status === 'degraded'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-slate-400'
                          }`}
                        />
                        {wf.status === 'healthy' ? 'Healthy' : wf.status === 'degraded' ? 'Degraded' : 'Paused'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                      {wf.executions24h.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right font-mono">
                      <span
                        className={
                          wf.errorRate > 0.2
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }
                      >
                        {(wf.errorRate * 100).toFixed(2)}%
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">
                      {wf.avgDurationMs}ms
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleTriggerRun(wf)}
                        disabled={isTriggering}
                        className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        <Play className={`h-3 w-3 ${isTriggering ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
                        {isTriggering ? 'Running...' : 'Run Pipeline'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Rules with Toggles */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Automated Alert Dispatch Rules
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Routing to Slack, PagerDuty email, and SMS on-call
          </span>
        </div>

        <div className="divide-y divide-slate-200/60 dark:divide-white/5">
          {alertRules.map((rule) => {
            return (
              <div
                key={rule.id}
                className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[10px] font-mono font-medium ${
                        rule.channel === 'Slack'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : rule.channel === 'Email'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {rule.channel === 'Slack' && <MessageSquare className="h-3 w-3" />}
                      {rule.channel === 'Email' && <Mail className="h-3 w-3" />}
                      {rule.channel === 'SMS' && <Smartphone className="h-3 w-3" />}
                      {rule.channel}
                    </span>

                    <span
                      className={`rounded-[6px] px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        rule.severity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : rule.severity === 'Warning'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {rule.severity}
                    </span>

                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {rule.title}
                    </h4>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {rule.description}
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAlertRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rule.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
