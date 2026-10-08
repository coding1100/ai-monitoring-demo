import React, { useState } from 'react';
import {
  Settings,
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  Building,
  Shield,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { WORKSPACES } from '../../data/mockData';
import { fakeDelay } from '../../utils/seededRandom';

export const WorkspaceSettingsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const currentWs = WORKSPACES.find((w) => w.id === currentWorkspaceId) || WORKSPACES[0];

  const [wsName, setWsName] = useState(currentWs.name);
  const [timezone, setTimezone] = useState(currentWs.timezone);
  const [sendingHours, setSendingHours] = useState(currentWs.sendingHours);
  const [retentionDays, setRetentionDays] = useState(currentWs.retentionDays);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = async () => {
    await fakeDelay(500);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">WORKSPACE</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Settings</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Workspace Operational Parameters
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Tenant timezone, automated sending windows, default rate limits, and audit data retention.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="workspace_profiles" />
          <DiagramChip reference="Workspace / Settings" type="built" />
        </div>
      </div>

      <div className="glass-dense p-6 rounded-panel space-y-5 max-w-2xl border border-slate-200/60 dark:border-slate-800/60">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Organization Profile
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Workspace Legal Display Name
            </label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary Operating Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              >
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                <option value="America/Denver (MST)">America/Denver (MST)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Active Sending Hours Window
              </label>
              <input
                type="text"
                value={sendingHours}
                onChange={(e) => setSendingHours(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Audit & Ingestion Retention Policy
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-24 px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center"
              />
              <span className="text-xs text-slate-500">Days of raw telemetry and webhook payloads retained</span>
            </div>
          </div>

          <div className="p-3.5 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Deterministic Scope Guarantee
            </div>
            All actions executed in this tenant persist under workspace_id = '{currentWorkspaceId}'. Changes take effect immediately in the localStorage cache.
          </div>

          {savedNotification && (
            <div className="p-3 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Workspace operational parameters saved successfully.</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <ActionButton
              rbacAction="manage_rules"
              variant="primary"
              onAsyncClick={handleSave}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Workspace Parameters</span>
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
