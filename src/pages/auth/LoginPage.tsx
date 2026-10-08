import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { ActionButton } from '../../components/common/ActionButton';
import { WORKSPACES } from '../../data/mockData';
import { WorkspaceId } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const setWorkspace = useDemoStore((state) => state.setWorkspace);

  const [email, setEmail] = useState('marcus@haldenpartners.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = async () => {
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="glass-dense max-w-md w-full p-8 rounded-panel border border-slate-300/50 dark:border-slate-800/60 shadow-xl space-y-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
            Internal Operations Tool
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight m-0">
            Marketing Platform Architecture
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Sign in to access your tenant marketing orchestration plane.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Select Demo Workspace
            </label>
            <div className="grid grid-cols-1 gap-2">
              {WORKSPACES.map((w) => (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => setWorkspace(w.id as WorkspaceId)}
                  className={`text-left p-2.5 rounded-control border text-xs transition-colors flex items-center justify-between ${
                    w.id === currentWorkspaceId
                      ? 'bg-blue-500/15 border-accent text-slate-900 dark:text-slate-100 font-medium'
                      : 'border-slate-300/40 dark:border-slate-700/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 opacity-70" />
                    <div>
                      <div>{w.name}</div>
                      <div className="text-[10px] text-slate-500">{w.industry}</div>
                    </div>
                  </div>
                  {w.id === currentWorkspaceId && (
                    <span className="text-[10px] font-mono text-accent">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="pt-2">
            <ActionButton
              variant="primary"
              className="w-full"
              onAsyncClick={handleLogin}
            >
              <span>Sign in to workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </ActionButton>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <Link to="/auth/register" className="hover:text-accent transition-colors">
            Create account & workspace
          </Link>
          <Link to="/onboarding" className="hover:text-accent transition-colors">
            Onboarding checklist
          </Link>
        </div>
      </div>
    </div>
  );
};
