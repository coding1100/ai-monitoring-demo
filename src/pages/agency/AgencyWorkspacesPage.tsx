import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Building2,
  ExternalLink,
  Pause,
  Play,
  Archive,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  X,
  CreditCard,
  Users,
  Activity,
  ArrowUpDown,
  Send,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { useDemoStore } from '../../store/useDemoStore';
import { ClientWorkspace, PlanTier, WorkspaceStatus } from '../../types';

export const AgencyWorkspacesPage: React.FC = () => {
  const clientWorkspaces = useDemoStore((state) => state.clientWorkspaces);
  const toggleWorkspaceStatus = useDemoStore((state) => state.toggleWorkspaceStatus);
  const archiveWorkspace = useDemoStore((state) => state.archiveWorkspace);
  const createClientWorkspace = useDemoStore((state) => state.createClientWorkspace);
  const startSupportSession = useDemoStore((state) => state.startSupportSession);
  const planDefinitions = useDemoStore((state) => state.planDefinitions);

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'leadsThisMonth' | 'revenue' | 'margin'>('revenue');
  const [sortAsc, setSortAsc] = useState(false);

  // Drawer & Modal State
  const [selectedWorkspace, setSelectedWorkspace] = useState<ClientWorkspace | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsPlan, setNewWsPlan] = useState<PlanTier>('Growth');
  const [newWsGhl, setNewWsGhl] = useState(true);
  const [newWsEmail, setNewWsEmail] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSupportOpen = (ws: ClientWorkspace) => {
    startSupportSession(ws.id);
    showToast(`Support session logged: opening ${ws.name}`);
  };

  const handleTogglePause = (ws: ClientWorkspace) => {
    const nextStatus: WorkspaceStatus = ws.status === 'paused' ? 'active' : 'paused';
    toggleWorkspaceStatus(ws.id, nextStatus);
    showToast(`Workspace ${ws.name} status updated to ${nextStatus}`);
  };

  const handleArchive = (ws: ClientWorkspace) => {
    archiveWorkspace(ws.id);
    showToast(`Workspace ${ws.name} archived`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    createClientWorkspace({
      name: newWsName.trim(),
      plan: newWsPlan,
      industry: 'General Practice',
      type: 'B2B',
    });

    setCreateModalOpen(false);
    showToast(`Workspace "${newWsName}" provisioned with GoHighLevel sub-account`);
    setNewWsName('');
    setNewWsEmail('');
  };

  // Filter and sort
  const filteredWorkspaces = clientWorkspaces
    .filter((w) => {
      if (planFilter !== 'all' && w.plan !== planFilter) return false;
      if (statusFilter !== 'all' && w.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.subAccountName.toLowerCase().includes(q) ||
          w.industry.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });

  const getPlanLimit = (planName: PlanTier) => {
    return planDefinitions.find((p) => p.name === planName) || planDefinitions[0];
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3 rounded-control glass-modal border border-accent bg-blue-600/15 text-xs text-slate-900 dark:text-slate-100 shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-accent">AGENCY CONTROL TOWER</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Workspaces</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Client Tenants & Sub-Account Management
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            12 isolated tenant environments partitioned by workspace_id with dedicated limits, pipelines, and audit lineage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-control bg-accent hover:bg-accent-hover text-white shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create workspace</span>
          </button>
          <DiagramChip reference="Agency / Workspaces Directory" type="built" />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by workspace name, sub-account, or industry..."
              aria-label="Search workspaces"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Plan:</span>
            <select
              value={planFilter}
              aria-label="Filter workspaces by plan"
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All plans</option>
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Scale">Scale</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Status:</span>
            <select
              value={statusFilter}
              aria-label="Filter workspaces by status"
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="past due">Past Due</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspaces Table */}
      <div className="glass-dense rounded-panel overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2.5 font-medium cursor-pointer" onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Workspace Name</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="px-3 py-2.5 font-medium">Plan</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium cursor-pointer" onClick={() => { setSortField('leadsThisMonth'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Leads MTD</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="px-3 py-2.5 font-medium">Outreach Activity</th>
                <th className="px-3 py-2.5 font-medium cursor-pointer" onClick={() => { setSortField('revenue'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>MRR</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="px-3 py-2.5 font-medium cursor-pointer" onClick={() => { setSortField('margin'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Margin</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="px-3 py-2.5 font-medium">CRM Sync</th>
                <th className="px-3 py-2.5 font-medium">Last Active</th>
                <th className="px-3 py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {filteredWorkspaces.map((ws) => (
                <tr
                  key={ws.id}
                  onClick={() => setSelectedWorkspace(ws)}
                  className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[4px] bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[10px] font-bold shrink-0">
                        {ws.name.charAt(0)}
                      </div>
                      <div>
                        <div>{ws.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{ws.subAccountName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      {ws.plan}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                        ws.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : ws.status === 'trial'
                          ? 'bg-blue-500/10 text-blue-600'
                          : ws.status === 'past due'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-slate-500/10 text-slate-500'
                      }`}
                    >
                      {ws.status}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 font-mono">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {ws.leadsThisMonth.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">
                      / {getPlanLimit(ws.plan).leads.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <div>{ws.emailsSent.toLocaleString()} emails</div>
                    <div className="text-[10px] text-slate-500">{ws.smsSent} SMS | {ws.postsPublished} posts</div>
                  </td>

                  <td className="px-3 py-2.5 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    ${ws.revenue}
                  </td>

                  <td className="px-3 py-2.5 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {ws.margin}%
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className={`text-[10px] font-mono capitalize flex items-center gap-1 ${
                        ws.crmStatus === 'connected'
                          ? 'text-emerald-600'
                          : ws.crmStatus === 'syncing'
                          ? 'text-blue-600'
                          : ws.crmStatus === 'error'
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ws.crmStatus === 'connected' ? 'bg-emerald-500' : ws.crmStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <span>{ws.crmStatus}</span>
                    </span>
                  </td>

                  <td className="px-3 py-2.5 font-mono text-[10px] text-slate-500">
                    {ws.lastActivity}
                  </td>

                  <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSupportOpen(ws)}
                        className="px-2 py-1 text-[10px] font-medium rounded bg-blue-600/10 text-blue-700 dark:text-blue-300 hover:bg-blue-600/20 transition-colors"
                        title="Open as support operator session"
                      >
                        Open Support
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePause(ws)}
                        className="p-1 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title={ws.status === 'paused' ? 'Resume workspace' : 'Pause workspace'}
                      >
                        {ws.status === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchive(ws)}
                        className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Archive workspace"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen 3: Workspace Detail Drawer */}
      {selectedWorkspace && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-fade-in flex justify-end">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Workspace Details Drawer"
            className="w-full max-w-xl glass-modal h-full p-6 overflow-y-auto space-y-6 shadow-2xl border-l border-slate-300/40 dark:border-slate-800/60"
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold">
                    TENANT SPECIFICATION
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {selectedWorkspace.id}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedWorkspace.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedWorkspace.industry} | {selectedWorkspace.type} Business Model
                </div>
              </div>

              <button
                onClick={() => setSelectedWorkspace(null)}
                aria-label="Close drawer"
                className="p-1.5 rounded-control text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Status Strip */}
            <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 mr-2">Plan:</span>
                <span className="font-semibold text-blue-600 font-mono">{selectedWorkspace.plan} Tier (${selectedWorkspace.revenue}/mo)</span>
              </div>
              <button
                type="button"
                onClick={() => handleSupportOpen(selectedWorkspace)}
                className="px-2.5 py-1 text-xs rounded bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
              >
                Open Support Session
              </button>
            </div>

            {/* Usage vs Plan Limits (Progress Bars) */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Monthly Resource Consumption vs Tier Quota
              </h4>

              {(() => {
                const lim = getPlanLimit(selectedWorkspace.plan);
                const metrics = [
                  { label: 'Leads Enriched', used: selectedWorkspace.leadsThisMonth, max: lim.leads, unit: 'leads' },
                  { label: 'Email Outreach', used: selectedWorkspace.emailsSent, max: lim.emails, unit: 'emails' },
                  { label: 'SMS Dispatches', used: selectedWorkspace.smsSent, max: lim.sms, unit: 'SMS' },
                  { label: 'Social Posts', used: selectedWorkspace.postsPublished, max: lim.posts, unit: 'posts' },
                ];

                return (
                  <div className="space-y-3">
                    {metrics.map((m) => {
                      const pct = Math.min(100, Math.round((m.used / m.max) * 100));
                      return (
                        <div key={m.label} className="p-3 rounded-control bg-slate-100/30 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{m.label}</span>
                            <span className="text-slate-500">
                              {m.used.toLocaleString()} / {m.max.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                pct > 90 ? 'bg-amber-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Spend & Unit Economics */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Tenant Financial Performance
              </h4>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="text-[10px] text-slate-500 uppercase">Gross Revenue</div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">${selectedWorkspace.revenue}</div>
                </div>
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="text-[10px] text-slate-500 uppercase">AI Token Cost</div>
                  <div className="text-base font-bold text-blue-600 mt-0.5">${selectedWorkspace.aiSpend.toFixed(1)}</div>
                </div>
                <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40">
                  <div className="text-[10px] text-slate-500 uppercase">Net Margin</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">{selectedWorkspace.margin}%</div>
                </div>
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Connected Integration Endpoints
              </h4>
              <div className="p-3 rounded-control bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GoHighLevel Sub-Account</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{selectedWorkspace.subAccountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Synced Contacts</span>
                  <span className="text-slate-900 dark:text-slate-100">{selectedWorkspace.contactsSynced.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mapped Pipelines</span>
                  <span className="text-slate-900 dark:text-slate-100">{selectedWorkspace.pipelinesMapped} active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Daily Spend Cap</span>
                  <span className="text-slate-900 dark:text-slate-100">${selectedWorkspace.dailySpendCap} / day</span>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-semibold">
                Tenant Audit Trail
              </h4>
              <div className="p-3 rounded-control bg-slate-100/40 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 space-y-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <div>[2026-10-08 15:42] GoHighLevel webhook batch completed: 42 contacts synced.</div>
                <div>[2026-10-08 12:10] AI enrichment step approved by operator.</div>
                <div>[2026-10-07 18:24] Monthly invoice generated and processed via Stripe.</div>
                <div>[2026-10-06 09:15] Outbound velocity cap adjusted to tier specifications.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Create Workspace Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-modal max-w-md w-full p-6 border border-slate-300/40 dark:border-slate-700/60 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Provision New Client Workspace
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Workspace / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paramount Wellness Centers"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subscription Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Starter', 'Growth', 'Scale'] as PlanTier[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewWsPlan(p)}
                      className={`p-2.5 rounded-control border text-xs text-center transition-colors ${
                        newWsPlan === p
                          ? 'bg-blue-500/15 border-accent text-accent font-semibold'
                          : 'border-slate-300/40 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div>{p}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ${p === 'Starter' ? 149 : p === 'Growth' ? 349 : 799}/mo
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-control bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    Provision GoHighLevel Sub-Account
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Automatically initializes dedicated location and mapping.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newWsGhl}
                  onChange={(e) => setNewWsGhl(e.target.checked)}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Client Admin Email (Optional Invite)
                </label>
                <input
                  type="email"
                  placeholder="admin@clientpractice.com"
                  value={newWsEmail}
                  onChange={(e) => setNewWsEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded-control bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium rounded-control bg-accent hover:bg-accent-hover text-white shadow-sm"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
