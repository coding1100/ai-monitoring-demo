import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Map,
  Sliders,
  Sparkles,
  ShieldCheck,
  GitFork,
  Cpu,
  BrainCircuit,
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
  Plug,
  Users,
  CreditCard,
  Settings,
  Lock,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { WORKSPACES } from '../../data/mockData';
import { Phase2Modal } from '../common/Phase2Modal';
import { WorkspaceId } from '../../types';

export const Sidebar: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const setWorkspace = useDemoStore((state) => state.setWorkspace);
  const [phase2Open, setPhase2Open] = useState(false);
  const [phase2Detail, setPhase2Detail] = useState({ title: '', desc: '' });
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  const handlePhase2Click = (title: string, desc: string) => {
    setPhase2Detail({ title, desc });
    setPhase2Open(true);
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-1.5 rounded-control text-xs font-medium transition-colors select-none ${
      isActive
        ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300 font-semibold border-l-2 border-accent'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
    }`;

  return (
    <>
      <aside className="w-[248px] shrink-0 h-screen sticky top-0 flex flex-col glass-dense border-r border-slate-200/60 dark:border-slate-800/60 z-30 overflow-y-auto custom-scrollbar">
        {/* Top Workspace Switcher */}
        <div className="p-3 border-b border-slate-200/50 dark:border-slate-800/50 relative">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium block mb-1">
            Workspace
          </label>
          <button
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-control bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 border border-slate-300/40 dark:border-slate-700/40 text-left transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded-[4px] bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[11px] font-bold shrink-0">
                {currentWs.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {currentWs.name}
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                  {currentWs.focus.split('&')[0]}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Switcher dropdown */}
          {wsDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1.5 p-1 glass-modal border border-slate-300/60 dark:border-slate-700/60 shadow-xl z-50 rounded-control">
              {WORKSPACES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setWorkspace(w.id as WorkspaceId);
                    setWsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-control text-xs flex items-center justify-between transition-colors ${
                    w.id === currentWorkspaceId
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{w.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {w.industry}
                    </div>
                  </div>
                  {w.id === currentWorkspaceId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Layers */}
        <div className="flex-1 py-3 px-2 space-y-4">
          {/* 00 Map */}
          <div>
            <NavLink to="/" end className={navItemClass}>
              <Map className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.5} />
              <span>System Map</span>
            </NavLink>
          </div>

          {/* 01 Control */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              01 Control
            </div>
            <NavLink to="/control/operator" className={navItemClass}>
              <Sliders className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Operator</span>
            </NavLink>
            <NavLink to="/control/command-center" className={navItemClass}>
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" strokeWidth={1.5} />
              <span>AI Command Center</span>
            </NavLink>
            <NavLink to="/control/approval-gate" className={navItemClass}>
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Approval Gate</span>
            </NavLink>
          </div>

          {/* 02 Orchestration */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              02 Orchestration
            </div>
            <NavLink to="/orchestration/runs" className={navItemClass}>
              <GitFork className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>n8n Orchestrator</span>
            </NavLink>
            <NavLink to="/orchestration/llm-router" className={navItemClass}>
              <BrainCircuit className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>LLM Router</span>
            </NavLink>
            <NavLink to="/orchestration/openai" className={navItemClass}>
              <Cpu className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>OpenAI API</span>
            </NavLink>
            <NavLink to="/orchestration/rules" className={navItemClass}>
              <Binary className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Rules in Code</span>
            </NavLink>
          </div>

          {/* 03 Workflows */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              03 Workflows
            </div>
            <NavLink to="/workflows/b2b-leads" className={navItemClass}>
              <Target className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>B2B Leads</span>
            </NavLink>
            <NavLink to="/workflows/b2c-capture" className={navItemClass}>
              <Magnet className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>B2C Capture</span>
            </NavLink>
            <NavLink to="/workflows/email-sequences" className={navItemClass}>
              <Mail className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Email Sequences</span>
            </NavLink>
            <NavLink to="/workflows/sms" className={navItemClass}>
              <MessageSquare className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>SMS</span>
            </NavLink>
            <NavLink to="/workflows/social" className={navItemClass}>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2.5">
                  <Share2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                  <span>Social</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 font-semibold">
                  Cond.
                </span>
              </div>
            </NavLink>
            <NavLink to="/workflows/follow-up" className={navItemClass}>
              <GitCompare className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Follow-up Engine</span>
            </NavLink>
          </div>

          {/* 04 Data */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              04 Data
            </div>
            <NavLink to="/data/leads" className={navItemClass}>
              <Database className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Supabase / Leads</span>
            </NavLink>
            <NavLink to="/data/crm" className={navItemClass}>
              <Kanban className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>CRM (HubSpot/GHL)</span>
            </NavLink>
            <NavLink to="/data/suppression" className={navItemClass}>
              <UserX className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Suppression List</span>
            </NavLink>
            <NavLink to="/data/logs" className={navItemClass}>
              <ScrollText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Logs & Audit</span>
            </NavLink>
          </div>

          {/* 05 Output */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              05 Output
            </div>
            <NavLink to="/output/dashboard" className={navItemClass}>
              <BarChart3 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/output/costs" className={navItemClass}>
              <Coins className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Costs & Economics</span>
            </NavLink>
          </div>

          {/* Workspace Settings */}
          <div className="space-y-0.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              Workspace
            </div>
            <NavLink to="/workspace/integrations" className={navItemClass}>
              <Plug className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Integrations</span>
            </NavLink>
            <NavLink to="/workspace/team" className={navItemClass}>
              <Users className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Team & Roles</span>
            </NavLink>
            <NavLink to="/workspace/usage" className={navItemClass}>
              <CreditCard className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Plan & Usage</span>
            </NavLink>
            <NavLink to="/workspace/settings" className={navItemClass}>
              <Settings className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/onboarding" className={navItemClass}>
              <Building2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Onboarding</span>
            </NavLink>
          </div>

          {/* Phase 2 Locked Items */}
          <div className="space-y-0.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium flex items-center justify-between">
              <span>Phase 2 (Locked)</span>
              <Lock className="w-3 h-3 text-slate-600" />
            </div>
            <button
              onClick={() =>
                handlePhase2Click(
                  'Super-Admin App',
                  'Centralized management plane for managing multiple client agencies, global tenant provisioning, and platform-wide billing oversight.'
                )
              }
              className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded-control text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>Admin App</span>
              <Lock className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
            </button>
            <button
              onClick={() =>
                handlePhase2Click(
                  'White-Label Tenant App',
                  'Dedicated standalone portal for client sub-users with custom domain mapping, branded dashboards, and constrained operator privileges.'
                )
              }
              className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded-control text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>Tenant App</span>
              <Lock className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
            </button>
            <button
              onClick={() =>
                handlePhase2Click(
                  'Custom Native CRM',
                  'In-house relational contact & opportunity manager with schema flexibility, replacing external HubSpot or GoHighLevel subscriptions.'
                )
              }
              className="w-full text-left flex items-center justify-between px-3 py-1.5 rounded-control text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>Custom CRM</span>
              <Lock className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Legend in Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="font-mono text-[9px] uppercase tracking-wider font-semibold">Diagram Legend</div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-[2px] box-built-by-us bg-blue-500/10"></span>
            <span>Solid border: Built by us</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-[2px] box-bought-tool bg-slate-500/10"></span>
            <span>Dashed: Bought tool</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-[2px] box-our-database"></span>
            <span>Filled: Our database</span>
          </div>
        </div>
      </aside>

      <Phase2Modal
        isOpen={phase2Open}
        onClose={() => setPhase2Open(false)}
        featureTitle={phase2Detail.title}
        featureDescription={phase2Detail.desc}
      />
    </>
  );
};
