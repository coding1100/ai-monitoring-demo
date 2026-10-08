import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Inbox,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserX,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { EmailSequence, ReplyItem } from '../../types';

export const EmailSequencesPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const sequences = useDemoStore((state) => state.sequences).filter((s) => s.workspace_id === currentWorkspaceId);
  const inboxes = useDemoStore((state) => state.inboxes).filter((i) => i.workspace_id === currentWorkspaceId);
  const replies = useDemoStore((state) => state.replies).filter((r) => r.workspace_id === currentWorkspaceId);

  const [activeTab, setActiveTab] = useState<'builder' | 'senders' | 'replies' | 'deliverability'>('builder');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [showPersonalizationSample, setShowPersonalizationSample] = useState(true);

  const currentSequence = sequences[0];

  const filteredReplies = replies.filter((r) => {
    if (selectedSentiment === 'all') return true;
    return r.sentiment === selectedSentiment;
  });

  const getSentimentBadge = (sentiment: ReplyItem['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            positive
          </span>
        );
      case 'neutral':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            neutral
          </span>
        );
      case 'not now':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            not now
          </span>
        );
      case 'unsubscribe':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            unsubscribe
          </span>
        );
      case 'out of office':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            out of office
          </span>
        );
      case 'bounce':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30">
            bounce
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">03 WORKFLOWS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Sequences</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Email Sequences, Senders & Reply Parsing
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Build multi-step AI cadences, inspect mailbox warmup progress, and classify inbound prospect sentiment.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="email_campaign_steps" count={currentSequence?.steps.length || 0} />
          <DiagramChip reference="03 Workflows / Email sequences / Instantly" type="built" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-2">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'builder' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Step Builder
        </button>
        <button
          onClick={() => setActiveTab('senders')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'senders' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Sender Inboxes & Warmup ({inboxes.length})
        </button>
        <button
          onClick={() => setActiveTab('replies')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'replies' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Reply Inbox ({replies.length})
        </button>
        <button
          onClick={() => setActiveTab('deliverability')}
          className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
            activeTab === 'deliverability' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
          }`}
        >
          Deliverability & SPF/DKIM
        </button>
      </div>

      {/* Tab 1: Step Builder */}
      {activeTab === 'builder' && currentSequence && (
        <div className="space-y-4">
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {currentSequence.name}
              </h3>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Sent: {currentSequence.sentCount} | Open Rate: {currentSequence.openRate}% | Reply Rate: {currentSequence.replyRate}% | Bounce: {currentSequence.bounceRate}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPersonalizationSample}
                  onChange={(e) => setShowPersonalizationSample(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
                <span>Show AI Personalization Samples</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {currentSequence.steps.map((step) => (
              <div key={step.step} className="glass-dense p-5 rounded-panel border border-slate-200/60 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[10px] font-bold">
                      {step.step}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Step 0{step.step}: {step.dayOffset === 0 ? 'Send Immediately' : `Wait ${step.dayOffset} Days`}
                    </span>
                  </div>

                  {step.aiPersonalization && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Tier 2 Hook</span>
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Subject: {step.subject}
                  </div>
                  <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {step.body}
                  </div>
                </div>

                {showPersonalizationSample && step.samplePersonalized && (
                  <div className="p-3 rounded-control bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                    <div className="font-mono text-[10px] uppercase text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Synthesized Live Personalization Output:
                    </div>
                    <p className="font-mono text-[11px] text-purple-900 dark:text-purple-200 italic">
                      "{step.samplePersonalized}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sender Inboxes & Warmup */}
      {activeTab === 'senders' && (
        <div className="glass-dense p-5 rounded-panel space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Connected Sending Inboxes ({inboxes.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              Rotated by n8n orchestrator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inboxes.map((ib) => (
              <div key={ib.id} className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono">
                      {ib.email}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Domain: {ib.domain}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${ib.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {ib.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Warmup Progress:</span>
                    <span className="font-semibold text-accent">{ib.warmupProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${ib.warmupProgress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] font-mono text-center">
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/40">SPF: <span className="text-emerald-600">{ib.spf}</span></div>
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/40">DKIM: <span className="text-emerald-600">{ib.dkim}</span></div>
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/40">DMARC: <span className="text-emerald-600">{ib.dmarc}</span></div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Sent Today: {ib.sentToday} / {ib.dailyLimit} cap</span>
                  <span>Safety limit active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reply Inbox with 6 Sentiment Labels */}
      {activeTab === 'replies' && (
        <div className="glass-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                Inbound Prospect Reply Classifier ({replies.length} Items)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every reply is classified by LLM Tier 1 into one of 6 operational categories.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Sentiment:</span>
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                className="px-2 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">All labels</option>
                <option value="positive">positive</option>
                <option value="neutral">neutral</option>
                <option value="not now">not now</option>
                <option value="unsubscribe">unsubscribe</option>
                <option value="out of office">out of office</option>
                <option value="bounce">bounce</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReplies.map((rep) => (
              <div key={rep.id} className="glass-dense p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {rep.leadName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">&lt;{rep.fromEmail}&gt;</span>
                      {getSentimentBadge(rep.sentiment)}
                    </div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
                      {rep.subject}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{rep.receivedAt}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-control leading-relaxed">
                  "{rep.body}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                  <span>Campaign: {rep.campaignName}</span>
                  <span>Handled: {rep.handled ? 'Yes (Automation updated CRM)' : 'Pending rep review'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Deliverability Panel */}
      {activeTab === 'deliverability' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Domain Health & Inbox Deliverability Ledger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="font-mono text-emerald-800 dark:text-emerald-300 font-semibold">Overall Deliverability</div>
              <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-400">98.2%</div>
              <p className="text-[11px] text-slate-500">Above industry standard threshold (95%)</p>
            </div>
            <div className="p-4 rounded-control bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
              <div className="font-mono text-blue-800 dark:text-blue-300 font-semibold">Rolling Bounce Rate</div>
              <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-400">1.8%</div>
              <p className="text-[11px] text-slate-500">Safe below 4.5% auto-pause guardrail</p>
            </div>
            <div className="p-4 rounded-control bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
              <div className="font-mono text-purple-800 dark:text-purple-300 font-semibold">Active Sending Mailboxes</div>
              <div className="text-2xl font-mono font-bold text-purple-700 dark:text-purple-400">{inboxes.length}</div>
              <p className="text-[11px] text-slate-500">SPF, DKIM, and DMARC 100% aligned</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
