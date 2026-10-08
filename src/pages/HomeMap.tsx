import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Sliders,
  Sparkles,
  ShieldCheck,
  GitFork,
  BrainCircuit,
  Cpu,
  Binary,
  Target,
  Magnet,
  Mail,
  MessageSquare,
  Share2,
  GitCompare,
  Database,
  Kanban,
  UserX,
  ScrollText,
  BarChart3,
  Coins,
  ArrowRight,
  Lock,
  ExternalLink,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useDemoStore } from '../store/useDemoStore';
import { Phase2Modal } from '../components/common/Phase2Modal';

export const HomeMap: React.FC = () => {
  const navigate = useNavigate();
  const startTour = useDemoStore((state) => state.startTour);
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter((l) => l.workspace_id === currentWorkspaceId);

  const [phase2Open, setPhase2Open] = useState(false);
  const [phase2Detail, setPhase2Detail] = useState({ title: '', desc: '' });

  const handlePhase2Click = (title: string, desc: string) => {
    setPhase2Detail({ title, desc });
    setPhase2Open(true);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner with Guided Tour Trigger */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
              Interactive System Map
            </span>
            <span className="text-xs text-slate-500">5-Layer Architecture</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Multi-Tenant Marketing Platform
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Every box below is an operational screen powered by client data for{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              workspace '{currentWorkspaceId}'
            </strong>{' '}
            ({leads.length} active leads). Hover over any node for technical specifications or click to inspect its interface.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              navigate('/control/command-center');
              startTour();
            }}
            className="px-4 py-2.5 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-md inline-flex items-center justify-center gap-2 transition-all duration-150 active:translate-y-[1px]"
          >
            <Play className="w-4 h-4 fill-current" strokeWidth={1.5} />
            <span>Play end-to-end flow</span>
          </button>
        </div>
      </div>

      {/* Architecture Visual Diagram Rebuilt in HTML & CSS */}
      <div className="space-y-6">
        {/* Layer 01: Control */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">01</span>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                Control Layer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Human supervision & strategy formulation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Operator */}
            <div
              onClick={() => navigate('/control/operator')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Sliders className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/control/operator</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Operator
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                High-level operational cockpit for manual execution, system health, and safety halts.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* AI Command Center */}
            <div
              onClick={() => navigate('/control/command-center')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/control/command-center</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                AI Command Center
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Natural language campaign compiler translating client objectives into structured plans.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Approval Gate */}
            <div
              onClick={() => navigate('/control/approval-gate')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/control/approval-gate</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Approval Gate
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Human-in-the-loop validation queue inspecting copy samples, spend caps, and risk bounds.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 02: Orchestration */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">02</span>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                Orchestration Layer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Execution graph, model routing & code rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* n8n Orchestrator */}
            <div
              onClick={() => navigate('/orchestration/runs')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <GitFork className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/orchestration/runs</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                n8n Orchestrator
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Workflow execution runs, retry engines, dead-letter quarantine, and step latencies.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* LLM Router */}
            <div
              onClick={() => navigate('/orchestration/llm-router')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <BrainCircuit className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/orchestration/llm-router</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                LLM Router
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Task-to-tier routing table: Tier 1 (extract/score) vs Tier 2 (personalization copy).
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* OpenAI API */}
            <div
              onClick={() => navigate('/orchestration/openai')}
              className="glass-card glass-card-hover box-bought-tool p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300">
                  <Cpu className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/orchestration/openai</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                OpenAI API
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Provider credentials, masked keys, monthly token caps, and upstream inference status.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="text-slate-500">Bought tool</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Rules in Code */}
            <div
              onClick={() => navigate('/orchestration/rules')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-red-500/10 text-red-600 dark:text-red-400">
                  <Binary className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/orchestration/rules</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Rules in Code
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                8 deterministic guardrails: opt-out suppress, send limits, bounce pauses & decision log.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 03: Workflows & Outside Connections */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">03</span>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                Workflows Layer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Channel execution pipelines & external connectors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* B2B Leads */}
            <div
              onClick={() => navigate('/workflows/b2b-leads')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="p-2 rounded-control bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-2">
                <Target className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                B2B Leads
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Apollo criteria & 4-step campaign wizard.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Apollo + Verify</div>
            </div>

            {/* B2C Capture */}
            <div
              onClick={() => navigate('/workflows/b2c-capture')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="p-2 rounded-control bg-pink-500/10 text-pink-600 dark:text-pink-400 w-fit mb-2">
                <Magnet className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                B2C Capture
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Landing pages, webhooks & Meta Lead Ads.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Forms + Meta</div>
            </div>

            {/* Email Sequences */}
            <div
              onClick={() => navigate('/workflows/email-sequences')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="p-2 rounded-control bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-2">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                Email Sequences
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Cadence builder, inboxes & reply inbox.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Instantly API</div>
            </div>

            {/* SMS */}
            <div
              onClick={() => navigate('/workflows/sms')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="p-2 rounded-control bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-2">
                <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                SMS Outreach
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Twilio 10DLC, character counts & consent.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Twilio SMS</div>
            </div>

            {/* Social (Conditional) */}
            <div
              onClick={() => navigate('/workflows/social')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-control bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-semibold">
                  Cond.
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                Social Hub
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Post schedule calendar & AI generator.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Meta / LinkedIn</div>
            </div>

            {/* Follow-up Engine */}
            <div
              onClick={() => navigate('/workflows/follow-up')}
              className="glass-card glass-card-hover box-built-by-us p-3.5 cursor-pointer relative group"
            >
              <div className="p-2 rounded-control bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit mb-2">
                <GitCompare className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent">
                Follow-up Engine
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Event-to-action routing & reply test bed.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400">Conn: Slack Alerts</div>
            </div>
          </div>
        </div>

        {/* Layer 04: Data */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">04</span>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                Data Layer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">State persistence, CRM mapping & compliance ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Supabase */}
            <div
              onClick={() => navigate('/data/leads')}
              className="glass-card glass-card-hover box-our-database p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-blue-600/20 text-blue-700 dark:text-blue-300">
                  <Database className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300">PostgreSQL</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Supabase (PostgreSQL)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Primary tenant database storing {leads.length} leads with workspace_id isolation and audit logs.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-blue-300">
                <span>Our database</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* External CRM */}
            <div
              onClick={() => navigate('/data/crm')}
              className="glass-card glass-card-hover box-bought-tool p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300">
                  <Kanban className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">HubSpot / GHL</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                CRM (HubSpot / GoHighLevel)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                7-stage drag & drop kanban pipeline, deals sync, task backlog, and bidirectional webhooks.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Bought tool</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Suppression List */}
            <div
              onClick={() => navigate('/data/suppression')}
              className="glass-card glass-card-hover box-our-database p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-rose-600/20 text-rose-700 dark:text-rose-300">
                  <UserX className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300">opt_outs</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Suppression List
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Unified opt-out registry, hard-bounce suppression, domain wildcards, and address checker.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-rose-700 dark:text-rose-300">
                <span>Our database</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Logs & Audit */}
            <div
              onClick={() => navigate('/data/logs')}
              className="glass-card glass-card-hover box-our-database p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-blue-600/20 text-blue-700 dark:text-blue-300">
                  <ScrollText className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300">system_logs</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Logs & Audit
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Immutable event stream for AI model calls, workflow errors, and operator audit compliance.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-blue-300">
                <span>Our database</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 05: Output */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">05</span>
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-800 dark:text-slate-200">
                Output Layer
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Executive metrics, conversion funnel & financial ROI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dashboard */}
            <div
              onClick={() => navigate('/output/dashboard')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <BarChart3 className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/output/dashboard</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Dashboard
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Complete conversion analytics: leads generated, delivery rate, positive responses, booked appointments, and pipeline.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Costs */}
            <div
              onClick={() => navigate('/output/costs')}
              className="glass-card glass-card-hover box-built-by-us p-4 cursor-pointer relative group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-control bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Coins className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-mono text-slate-500">/output/costs</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">
                Costs & Unit Economics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                Cost per campaign breakdown, token consumption by tier, spend caps progress, and monthly vendor estimates.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Built by us</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 Roadmap Items (Locked) */}
        <div className="glass-panel p-5 space-y-3 opacity-90">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">
                Phase 2 Roadmap (Planned)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">Not in phase 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() =>
                handlePhase2Click(
                  'Super-Admin App',
                  'Centralized management plane for managing multiple client agencies, global tenant provisioning, and platform-wide billing oversight.'
                )
              }
              className="glass-card p-4 text-left border-dashed border-slate-300 dark:border-slate-700 hover:border-accent transition-colors relative"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Admin App</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">Cross-tenant provisioning & infrastructure telemetry.</p>
            </button>

            <button
              onClick={() =>
                handlePhase2Click(
                  'White-Label Tenant App',
                  'Dedicated standalone portal for client sub-users with custom domain mapping, branded dashboards, and constrained operator privileges.'
                )
              }
              className="glass-card p-4 text-left border-dashed border-slate-300 dark:border-slate-700 hover:border-accent transition-colors relative"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Tenant App</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">Isolated customer-facing client dashboard.</p>
            </button>

            <button
              onClick={() =>
                handlePhase2Click(
                  'Custom Native CRM',
                  'In-house relational contact & opportunity manager with schema flexibility, replacing external HubSpot or GoHighLevel subscriptions.'
                )
              }
              className="glass-card p-4 text-left border-dashed border-slate-300 dark:border-slate-700 hover:border-accent transition-colors relative"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Custom CRM</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500">Proprietary pipeline & custom entity datastore.</p>
            </button>
          </div>
        </div>
      </div>

      <Phase2Modal
        isOpen={phase2Open}
        onClose={() => setPhase2Open(false)}
        featureTitle={phase2Detail.title}
        featureDescription={phase2Detail.desc}
      />
    </div>
  );
};
