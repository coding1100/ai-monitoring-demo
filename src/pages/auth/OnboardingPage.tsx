import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Cpu,
  Mail,
  Kanban,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);

  const [stepsState, setStepsState] = useState([
    {
      id: 'llm',
      title: 'Connect LLM Provider',
      description: 'Configure OpenAI API key for intent classification and personalization copy generation.',
      route: '/orchestration/openai',
      icon: Cpu,
      completed: true,
      badge: 'sk-proj-•••• connected',
    },
    {
      id: 'email',
      title: 'Configure Email Infrastructure',
      description: 'Connect Instantly API or Custom SMTP with SPF/DKIM/DMARC authentication records.',
      route: '/workflows/email-sequences',
      icon: Mail,
      completed: true,
      badge: '3 sender domains active',
    },
    {
      id: 'crm',
      title: 'Connect CRM Integration',
      description: 'Establish OAuth sync to HubSpot or GoHighLevel to mirror deal pipeline stages.',
      route: '/data/crm',
      icon: Kanban,
      completed: true,
      badge: 'HubSpot connected',
    },
    {
      id: 'campaign',
      title: 'Formulate First Campaign Plan',
      description: 'Generate your first structured audience instruction in the AI Command Center.',
      route: '/control/command-center',
      icon: Sparkles,
      completed: false,
      badge: 'Action required',
    },
  ]);

  const toggleStep = (id: string) => {
    setStepsState((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const completedCount = stepsState.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Workspace Onboarding Checklist
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Complete the 4 core infrastructure connections to enable automated multi-tenant campaign execution.
          </p>
        </div>
        <DiagramChip reference="Auth / Onboarding Checklist" type="built" />
      </div>

      {/* Progress Card */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Setup Progress ({completedCount} of 4 Complete)
          </span>
          <span className="text-xs font-mono font-medium text-accent">
            {Math.round((completedCount / 4) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300 rounded-full"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {stepsState.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                step.completed ? 'border-emerald-500/20' : 'border-slate-300/40 dark:border-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="mt-0.5 text-slate-400 hover:text-accent transition-colors"
                  title="Toggle completed state"
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="p-2.5 rounded-control bg-slate-200/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 shrink-0 hidden sm:block">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">0{index + 1}</span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] ${
                        step.completed
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => navigate(step.route)}
                  className="px-3 py-1.5 text-xs font-medium rounded-control bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Configure</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA */}
      <div className="p-4 rounded-panel glass-dense flex items-center justify-between">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Ready to formulate an outbound campaign? The AI Command Center compiles natural language commands into verified operations.
        </div>
        <ActionButton
          variant="primary"
          onAsyncClick={() => navigate('/control/command-center')}
        >
          <span>Open AI Command Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </ActionButton>
      </div>
    </div>
  );
};
