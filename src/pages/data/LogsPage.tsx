import React, { useState } from 'react';
import {
  ScrollText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BrainCircuit,
  GitFork,
  Shield,
  Search,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { useDemoStore } from '../../store/useDemoStore';
import { SystemLogEntry } from '../../types';

export const LogsPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const logs = useDemoStore((state) => state.systemLogs).filter((l) => l.workspace_id === currentWorkspaceId);

  const [typeFilter, setTypeFilter] = useState<'all' | 'ai_action' | 'workflow' | 'audit'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((l) => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTypeBadge = (type: SystemLogEntry['type']) => {
    switch (type) {
      case 'ai_action':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            <BrainCircuit className="w-3 h-3" /> ai_action
          </span>
        );
      case 'workflow':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <GitFork className="w-3 h-3" /> workflow
          </span>
        );
      case 'audit':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Shield className="w-3 h-3" /> audit
          </span>
        );
    }
  };

  const getStatusIcon = (status: SystemLogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'error':
      default:
        return <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">04 DATA</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Logs & Audit</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            System Event Stream & Compliance Logs
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Immutable log stream recording AI inference calls, n8n orchestration events, and operator audit trials.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="system_event_stream" count={filteredLogs.length} />
          <DiagramChip reference="04 Data / Logs & Audit" type="database" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            All Logs ({logs.length})
          </button>
          <button
            onClick={() => setTypeFilter('ai_action')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
              typeFilter === 'ai_action'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            AI Actions ({logs.filter((l) => l.type === 'ai_action').length})
          </button>
          <button
            onClick={() => setTypeFilter('workflow')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
              typeFilter === 'workflow'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            Workflow Engine ({logs.filter((l) => l.type === 'workflow').length})
          </button>
          <button
            onClick={() => setTypeFilter('audit')}
            className={`px-3 py-1.5 rounded-control text-xs font-medium transition-colors ${
              typeFilter === 'audit'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            Audit Trail ({logs.filter((l) => l.type === 'audit').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        <table className="w-full text-left text-xs table-compact border-collapse">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
              <th className="px-3 py-2 font-medium">Timestamp</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Actor</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Execution Payload / Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                <td className="px-3 py-2 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-3 py-2">{getTypeBadge(log.type)}</td>
                <td className="px-3 py-2 font-mono font-medium text-slate-800 dark:text-slate-200">
                  {log.actor}
                </td>
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(log.status)}
                    <span>{log.action}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-[11px] font-mono leading-relaxed">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
