import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActionButton } from '../../components/common/ActionButton';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState('Metro Aesthetics Partners');
  const [industry, setIndustry] = useState('Medical Aesthetics');
  const [adminEmail, setAdminEmail] = useState('admin@metroaesthetics.demo');

  const handleRegister = async () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="glass-dense max-w-md w-full p-8 rounded-panel border border-slate-300/50 dark:border-slate-800/60 shadow-xl space-y-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
            New Organization
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight m-0">
            Create Account & Workspace
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Provision an isolated tenant environment with dedicated Supabase scope.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Workspace Organization Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Industry Vertical
            </label>
            <select
              aria-label="Industry Vertical"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="Medical Aesthetics">Medical Aesthetics</option>
              <option value="Dental Healthcare">Dental Healthcare</option>
              <option value="Commercial Roofing">Commercial Roofing</option>
              <option value="Legal & Advisory">Legal & Advisory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Administrator Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="p-3 rounded-control bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
            <span>Includes 14-day Growth tier trial: 500 leads, 10k emails, and $250 AI token quota.</span>
          </div>

          <div className="pt-2">
            <ActionButton
              variant="primary"
              className="w-full"
              onAsyncClick={handleRegister}
            >
              <span>Provision workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </ActionButton>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/auth/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
