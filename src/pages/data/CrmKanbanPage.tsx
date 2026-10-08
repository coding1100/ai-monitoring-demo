import React, { useState } from 'react';
import {
  Kanban,
  CheckSquare,
  RefreshCw,
  ArrowRightLeft,
  Calendar,
  Building,
  User,
  ExternalLink,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { CrmStage, Lead, CrmTask } from '../../types';

export const CrmKanbanPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const leads = useDemoStore((state) => state.leads).filter((l) => l.workspace_id === currentWorkspaceId);
  const updateLeadStage = useDemoStore((state) => state.updateLeadStage);
  const tasks = useDemoStore((state) => state.tasks).filter((t) => t.workspace_id === currentWorkspaceId);
  const toggleCrmTask = useDemoStore((state) => state.toggleCrmTask);

  // CRM switch: HubSpot vs GoHighLevel
  const [activeCrm, setActiveCrm] = useState<'hubspot' | 'ghl'>(
    currentWorkspaceId === 'lakeview' ? 'ghl' : 'hubspot'
  );
  const [syncDirection, setSyncDirection] = useState<'bidirectional' | 'push_only' | 'pull_only'>('bidirectional');
  const [lastSyncTime, setLastSyncTime] = useState('2026-03-28 10:14:22');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const stages: CrmStage[] = [
    'Lead',
    'Contacted',
    'Engaged',
    'Qualified',
    'Appointment',
    'Opportunity',
    'Customer',
  ];

  // Drag and drop handlers
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: CrmStage) => {
    if (draggedLeadId) {
      updateLeadStage(draggedLeadId, stage);
      setDraggedLeadId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, leadId: string, currentStage: CrmStage) => {
    const currentIndex = stages.indexOf(currentStage);
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      if (currentIndex < stages.length - 1) {
        updateLeadStage(leadId, stages[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) {
        updateLeadStage(leadId, stages[currentIndex - 1]);
      }
    }
  };

  const handleManualSync = async () => {
    setLastSyncTime(new Date().toISOString().replace('T', ' ').slice(0, 19));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">04 DATA</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">CRM Kanban</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            CRM Pipeline & Bidirectional Sync
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            7-stage Kanban board mirroring deals and contacts across external HubSpot and GoHighLevel workspaces.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="crm_deals_mirror" count={leads.length} />
          <DiagramChip reference="04 Data / CRM (HubSpot / GoHighLevel)" type="bought" />
        </div>
      </div>

      {/* Sync Control & Switcher Panel */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Connected CRM:</span>
            <div className="flex rounded-control border border-slate-300/60 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-900 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveCrm('hubspot')}
                className={`px-3 py-1 rounded-[6px] transition-colors ${
                  activeCrm === 'hubspot' ? 'bg-accent text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                HubSpot CRM
              </button>
              <button
                type="button"
                onClick={() => setActiveCrm('ghl')}
                className={`px-3 py-1 rounded-[6px] transition-colors ${
                  activeCrm === 'ghl' ? 'bg-accent text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                GoHighLevel
              </button>
            </div>
          </div>

          <div className="hidden sm:block text-xs font-mono text-slate-500">
            Direction: <span className="text-slate-800 dark:text-slate-200 capitalize">{syncDirection}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-[11px] font-mono text-slate-500">
            Last Synced: <span className="text-slate-800 dark:text-slate-200">{lastSyncTime}</span>
          </div>
          <ActionButton
            rbacAction="trigger_run"
            variant="secondary"
            size="sm"
            onAsyncClick={handleManualSync}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Sync</span>
          </ActionButton>
        </div>
      </div>

      {/* 7-Stage Interactive Drag & Drop Kanban */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Pipeline Stages (Drag cards to change stage)
          </span>
          <span className="text-xs text-slate-500 font-mono">{leads.length} Total Pipeline Records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 overflow-x-auto min-w-[1000px] pb-4">
          {stages.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage)}
                className="glass-dense rounded-panel p-2.5 flex flex-col min-h-[380px] border border-slate-200/60 dark:border-slate-800/60"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {stage}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 flex items-center justify-center text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold shrink-0">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-2">
                  {stageLeads.slice(0, 5).map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      tabIndex={0}
                      role="button"
                      aria-label={`${lead.fullName}, ${stage}. Press Right Arrow to advance, Left Arrow to regress.`}
                      onDragStart={() => handleDragStart(lead.id)}
                      onKeyDown={(e) => handleKeyDown(e, lead.id, stage)}
                      className="p-2.5 rounded-control bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800/80 shadow-xs cursor-grab active:cursor-grabbing text-xs hover:border-accent focus-visible:ring-2 focus-visible:ring-accent transition-all space-y-1 select-none"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {lead.fullName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{lead.company}</div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] font-mono text-slate-400">
                        <span>Score: {lead.score}</span>
                        <span className="capitalize">{lead.source.split('_')[0]}</span>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length > 5 && (
                    <div className="text-center text-[10px] font-mono text-slate-400 pt-1">
                      + {stageLeads.length - 5} more records
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRM Tasks List */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Assigned Follow-Up Tasks ({tasks.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Automated CRM sync</span>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleCrmTask(task.id)}
              className="p-3 rounded-control border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-200/30 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  aria-label={`Task: ${task.title}`}
                  className="rounded text-accent focus:ring-accent"
                />
                <div className={task.completed ? 'line-through text-slate-400' : ''}>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Lead: {task.leadName} ({task.leadCompany})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                <span>Due: {task.dueDate}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] capitalize font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-500/10 text-red-600'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-slate-200/60 dark:bg-slate-800/60'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
