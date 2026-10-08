import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Send,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  History,
  Mail,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { PlannedCampaign } from '../../types';

export const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const plans = useDemoStore((state) => state.plans).filter((p) => p.workspace_id === currentWorkspaceId);
  const addPlan = useDemoStore((state) => state.addPlan);

  const defaultPrompt =
    'Find 100 qualified med spa owners in New York, enrich their contact information, create personalized outreach, add them to the CRM, and begin the approved campaign.';

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [activePlan, setActivePlan] = useState<PlannedCampaign | null>(null);
  const [restoredBadge, setRestoredBadge] = useState(false);

  const handleGeneratePlan = async () => {
    // Generate deterministic structured plan based on workspace
    const newPlan: PlannedCampaign = {
      id: `cmp_${currentWorkspaceId}_${Date.now().toString().slice(-4)}`,
      workspace_id: currentWorkspaceId,
      prompt: prompt,
      audience: currentWorkspaceId === 'lakeview' ? 'Local Dental Patients' : currentWorkspaceId === 'ridgeway' ? 'Commercial Property Managers' : 'Med Spa Owners & Medical Directors',
      titles: currentWorkspaceId === 'lakeview' ? ['Inquirer', 'Prospective Patient'] : currentWorkspaceId === 'ridgeway' ? ['Facility Manager', 'Asset Director'] : ['Clinic Owner', 'Medical Director', 'Managing Partner'],
      location: currentWorkspaceId === 'lakeview' ? 'Greater Chicago, IL' : currentWorkspaceId === 'ridgeway' ? 'Denver Metro, CO' : 'New York, NY (Tri-State Area)',
      count: 100,
      channels: ['email', 'linkedin'],
      sequenceSteps: [
        {
          step: 1,
          channel: 'Email',
          delay: 'Immediate',
          description: 'Personalized intro citing clinic qualifications and practitioner schedule optimization.',
        },
        {
          step: 2,
          channel: 'LinkedIn',
          delay: 'Day 2',
          description: 'Connection request note referencing operational benchmarks in their metro.',
        },
        {
          step: 3,
          channel: 'Email',
          delay: 'Day 4',
          description: 'Follow-up teardown on room yield and machine downtime.',
        },
      ],
      estimatedCost: 18.40,
      estimatedTime: '2 hours 15 minutes',
      sampleMessages: [
        {
          channel: 'Email',
          subject: 'Quick question regarding clinical workflow',
          body: 'Hi {{firstName}}, I saw that {{company}} recently expanded your aesthetics roster in {{location}}. Many clinic owners find provider scheduling bottlenecks eat into treatment margin. Open to a 7-minute benchmark comparison this Thursday?',
        },
        {
          channel: 'LinkedIn',
          body: 'Hi {{firstName}}, great work building out {{company}} in {{location}}. Would love to connect and share some aesthetic practice benchmark data we published this month.',
        },
        {
          channel: 'Email',
          subject: 'Benchmark notes for {{company}}',
          body: 'Hi {{firstName}}, following up on my previous note. We put together a short teardown on average treatment margin vs machine downtime for NYC med spas. Would you like me to drop the PDF here?',
        },
      ],
      status: 'pending_approval',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      targetSpendCap: 250,
      dailySendLimit: 120,
    };

    setActivePlan(newPlan);
  };

  const handleSendToApproval = async () => {
    if (!activePlan) return;
    addPlan(activePlan);
    navigate('/control/approval-gate');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">01 CONTROL</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Command Center</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            AI Command Center
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Compile natural language objectives into verified multi-channel execution plans.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="planned_campaigns" count={plans.length} />
          <DiagramChip reference="01 Control / AI command center" type="built" />
        </div>
      </div>

      {/* Large Command Textarea */}
      <div className="glass-dense p-6 space-y-4">
        <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Campaign Instruction Prompt
        </label>
        <div className="relative">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your target audience, geographic criteria, outreach channels, and goal..."
            className="w-full p-4 text-xs font-mono rounded-panel bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent resize-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-slate-500 font-mono">
            Model: OpenAI GPT-4o-mini (Compiler Tier 1) | Seeded determinism enabled
          </div>
          <div className="flex items-center gap-2">
            {restoredBadge && (
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
                Example prompt restored
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setPrompt(defaultPrompt);
                setRestoredBadge(true);
                setTimeout(() => setRestoredBadge(false), 2000);
              }}
              className="px-3 py-2 text-xs font-medium rounded-control text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              Reset to Example
            </button>
            <ActionButton
              rbacAction="create_plan"
              variant="primary"
              onAsyncClick={handleGeneratePlan}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compile Plan</span>
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Structured Plan Card (shows on submit or default) */}
      {(activePlan || plans[0]) && (
        <div className="glass-panel p-6 space-y-6 border border-blue-500/30">
          {(() => {
            const plan = activePlan || plans[0];
            return (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                        STRUCTURED PLAN
                      </span>
                      <span className="text-xs font-mono text-slate-500">ID: {plan.id}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-1">
                      {plan.audience}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <ActionButton
                      rbacAction="create_plan"
                      variant="primary"
                      onAsyncClick={handleSendToApproval}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to Approval Gate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </ActionButton>
                  </div>
                </div>

                {/* Plan Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Target Audience
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {plan.count} Verified Records
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{plan.location}</div>
                  </div>

                  <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <div className="text-[10px] font-mono uppercase text-slate-500">Channels</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {plan.channels.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-200 dark:bg-slate-700 capitalize text-slate-800 dark:text-slate-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">3-Touch Cadence</div>
                  </div>

                  <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Estimated Cost
                    </div>
                    <div className="text-xs font-mono-numbers font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      ${plan.estimatedCost.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Within $250.00 cap</div>
                  </div>

                  <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/40">
                    <div className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Estimated Runtime
                    </div>
                    <div className="text-xs font-mono-numbers font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {plan.estimatedTime}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Rate limited (35/day/box)</div>
                  </div>
                </div>

                {/* Sequence Steps */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                    Orchestrated Sequence Steps
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plan.sequenceSteps.map((step) => (
                      <div
                        key={step.step}
                        className="p-3.5 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/30 dark:bg-slate-900/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-accent">
                            Step 0{step.step}: {step.channel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{step.delay}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Three Sample Messages */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                    Synthesized Copy Samples (Personalization Preview)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plan.sampleMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-control border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                          <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            {msg.channel === 'Email' ? (
                              <Mail className="w-3 h-3 text-amber-500" />
                            ) : (
                              <Share2 className="w-3 h-3 text-blue-500" />
                            )}
                            Sample 0{idx + 1} ({msg.channel})
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            Verified
                          </span>
                        </div>
                        {msg.subject && (
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            Subj: {msg.subject}
                          </div>
                        )}
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-mono text-[11px]">
                          {msg.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* History of Earlier Commands */}
      <div className="glass-dense p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Command Execution History ({plans.length} items)</span>
        </div>

        <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
          {plans.map((p) => (
            <div
              key={p.id}
              className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {p.audience}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] capitalize ${
                      p.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : p.status === 'pending_approval'
                        ? 'bg-amber-500/10 text-amber-600'
                        : p.status === 'changes_requested'
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-xl font-mono">
                  "{p.prompt}"
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-slate-500">
                <span>{p.createdAt}</span>
                <button
                  onClick={() => {
                    setActivePlan(p);
                    setPrompt(p.prompt);
                  }}
                  className={`px-2.5 py-1 rounded-control text-xs transition-colors ${
                    activePlan?.id === p.id
                      ? 'bg-accent text-white font-medium'
                      : 'bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {activePlan?.id === p.id ? 'Active Plan' : 'Load Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
