import React, { useState } from 'react';
import {
  RotateCcw,
  Eye,
  Sun,
  Moon,
  ChevronUp,
  Shield,
  Database,
  Building,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { UserRole } from '../../types';
import { WORKSPACES } from '../../data/mockData';

export const Footer: React.FC = () => {
  const currentRole = useDemoStore((state) => state.currentRole);
  const setRole = useDemoStore((state) => state.setRole);
  const showDataScope = useDemoStore((state) => state.showDataScope);
  const toggleDataScope = useDemoStore((state) => state.toggleDataScope);
  const darkMode = useDemoStore((state) => state.darkMode);
  const toggleDarkMode = useDemoStore((state) => state.toggleDarkMode);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  const roles: { id: UserRole; name: string; desc: string }[] = [
    { id: 'owner', name: 'Owner', desc: 'Full root access, billing, and system configuration' },
    { id: 'admin', name: 'Admin', desc: 'Approve campaigns, manage rules and connections' },
    { id: 'operator', name: 'Operator', desc: 'Execute campaigns and prompts, view runs' },
    { id: 'viewer', name: 'Viewer', desc: 'Read-only access across all screens (actions disabled)' },
  ];

  const handleReset = () => {
    resetDemo();
    setResetConfirmOpen(false);
  };

  return (
    <footer className="h-10 px-6 shrink-0 glass-dense border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 select-none sticky bottom-0 z-20">
      <div className="flex items-center gap-4">
        {/* Workspace indicator */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
          <Building className="w-3.5 h-3.5 opacity-70" strokeWidth={1.5} />
          <span>{currentWs.name}</span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">{currentWs.tier}</span>
        </div>

        {/* Data Scope Toggle */}
        <button
          onClick={toggleDataScope}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-colors border ${
            showDataScope
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium'
              : 'border-slate-300/40 dark:border-slate-700/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
          title="Toggles database scope inspector showing workspace_id and Supabase table name"
        >
          <Database className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Show data scope: {showDataScope ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* View As Menu */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 border border-slate-300/40 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            <span>
              View as: <strong className="font-semibold capitalize">{currentRole}</strong>
            </span>
            <ChevronUp className="w-3.5 h-3.5 opacity-70" />
          </button>

          {roleMenuOpen && (
            <div className="absolute bottom-full right-0 mb-1.5 w-64 p-1 glass-modal border border-slate-300/60 dark:border-slate-700/60 shadow-xl rounded-control z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200/40 dark:border-slate-700/40">
                Simulate Role Permissions
              </div>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-control text-xs flex flex-col transition-colors ${
                    r.id === currentRole
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-semibold flex items-center justify-between">
                    <span>{r.name}</span>
                    {r.id === currentRole && <span className="text-[10px] text-accent">Active</span>}
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1 rounded-[6px] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />}
        </button>

        {/* Reset Demo Link */}
        <div className="relative">
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors underline underline-offset-2 ml-1"
            title="Reset demo data and localStorage state"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            <span>Reset demo</span>
          </button>

          {resetConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="glass-modal max-w-sm w-full p-5 border border-slate-300/40 dark:border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Reset Demo State?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  This will clear all localStorage modifications, revert leads, rules, and campaigns back to the initial seeded state.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setResetConfirmOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-control bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-xs rounded-control bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
