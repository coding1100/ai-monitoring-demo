import React from 'react';
import {
  Plug,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { ConnectionConfig } from '../../types';

export const IntegrationsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const connections = useDemoStore((state) => state.connections)[currentWorkspaceId] || [];
  const testConnection = useDemoStore((state) => state.testConnection);

  const handleTest = async (connId: string) => {
    await testConnection(connId);
  };

  const getStatusBadge = (status: ConnectionConfig['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> connected
          </span>
        );
      case 'testing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> pinging
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> pending review
          </span>
        );
      case 'error':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            error
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">WORKSPACE</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Integrations</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Third-Party Connections & API Credentials
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure external service credentials with simulated handshakes, masked secrets, and last tested timestamps.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="workspace_integrations" count={connections.length} />
          <DiagramChip reference="Workspace / Integrations" type="bought" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="glass-panel p-5 space-y-3.5 border border-slate-200/60 dark:border-slate-800/60"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {conn.name}
                </h3>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Provider: {conn.provider}
                </div>
              </div>
              {getStatusBadge(conn.status)}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-slate-500 block">
                API Key / Secret Token (Masked)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={conn.apiKeyMasked}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all"
                />
                <ActionButton
                  rbacAction="test_connection"
                  variant="secondary"
                  size="sm"
                  onAsyncClick={() => handleTest(conn.id)}
                  className="shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test</span>
                </ActionButton>
              </div>
            </div>

            {conn.details && (
              <div className="p-2.5 rounded-control bg-slate-100/50 dark:bg-slate-900/50 text-[11px] text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                {conn.details}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] font-mono text-slate-400">
              <span>Category: {conn.category}</span>
              <span>Last Tested: {conn.lastTested}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
