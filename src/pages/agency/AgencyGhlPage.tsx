import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Search,
  ExternalLink,
  Layers,
  Database,
  Sliders,
} from 'lucide-react';
import { GhlSubAccount } from '../../types';

interface FieldMappingItem {
  sourceField: string;
  sourceDesc: string;
  ghlField: string;
  direction: 'Two-way' | 'Export only' | 'Import only';
  status: 'Active' | 'Pending';
}

const DEFAULT_FIELD_MAPPINGS: FieldMappingItem[] = [
  { sourceField: 'lead_score', sourceDesc: 'Calculated AI intent score (0-100)', ghlField: 'contact.ai_intent_score', direction: 'Two-way', status: 'Active' },
  { sourceField: 'target_vertical', sourceDesc: 'Primary industry classification', ghlField: 'contact.niche_vertical', direction: 'Two-way', status: 'Active' },
  { sourceField: 'intent_signal', sourceDesc: 'Apollo hiring / tech stack tag', ghlField: 'contact.buying_signal', direction: 'Export only', status: 'Active' },
  { sourceField: 'stage', sourceDesc: 'Current outreach pipeline stage', ghlField: 'opportunity.stage_id', direction: 'Two-way', status: 'Active' },
  { sourceField: 'verified_email', sourceDesc: 'Deliverability verification outcome', ghlField: 'contact.email_deliverability', direction: 'Export only', status: 'Active' },
  { sourceField: 'last_ai_reply', sourceDesc: 'Inbound message summary transcript', ghlField: 'contact.last_agent_transcript', direction: 'Export only', status: 'Active' },
];

export const AgencyGhlPage: React.FC = () => {
  const { ghlSubAccounts, ghlErrors } = useDemoStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Connected' | 'Syncing' | 'Error'>('all');
  const [activeTab, setActiveTab] = useState<'subaccounts' | 'mappings' | 'errors'>('subaccounts');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncAccount = (sub: GhlSubAccount) => {
    setSyncingId(sub.id);
    setTimeout(() => {
      setSyncingId(null);
      showToast(`Triggered GoHighLevel delta sync for ${sub.subAccountName}`);
    }, 600);
  };

  const filteredAccounts = ghlSubAccounts.filter((sub) => {
    const matchesSearch =
      sub.subAccountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.locationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.workspaceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.syncStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalContacts = ghlSubAccounts.reduce((acc, curr) => acc + curr.contactsSynced, 0);
  const errorCount = ghlErrors.length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
              04 Data / Integration
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Agency CRM Gateway</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            GoHighLevel Sub-Accounts
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Multi-location GoHighLevel synchronization, pipeline field mappings, and webhook telemetry across all 12 client workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showToast('Refreshed GoHighLevel OAuth connection pool');
            }}
            className="flex items-center gap-2 rounded-[10px] border border-slate-200 bg-white/70 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800/80"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            Refresh All Connections
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Mapped Sub-Accounts</span>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {ghlSubAccounts.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">12 of 12 tenants mapped to GHL Location IDs</p>
        </div>

        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Contacts Synchronized</span>
            <Database className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {totalContacts.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Total verified CRM contact records</p>
        </div>

        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Field Mappings</span>
            <Sliders className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {DEFAULT_FIELD_MAPPINGS.length} Global
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Two-way custom opportunity and contact sync</p>
        </div>

        <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Sync Exceptions</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {errorCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">1 rate limit, 1 phone, 1 pipeline stage</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('subaccounts')}
          className={`rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all ${
            activeTab === 'subaccounts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Sub-Accounts ({ghlSubAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('mappings')}
          className={`rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all ${
            activeTab === 'mappings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Custom Field Mappings ({DEFAULT_FIELD_MAPPINGS.length})
        </button>
        <button
          onClick={() => setActiveTab('errors')}
          className={`relative rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all ${
            activeTab === 'errors'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <span>Error Log</span>
          {errorCount > 0 && (
            <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              {errorCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Sub-Accounts Table */}
      {activeTab === 'subaccounts' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search sub-account, location ID, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-slate-200 bg-white/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-[10px] border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-700 focus:outline-none dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
              >
                <option value="all">All Sync Statuses</option>
                <option value="Connected">Connected</option>
                <option value="Syncing">Syncing</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Sub-Account & Location ID</th>
                  <th className="px-4 py-3">Workspace</th>
                  <th className="px-4 py-3">Sync Status</th>
                  <th className="px-4 py-3 text-right">Contacts Synced</th>
                  <th className="px-4 py-3 text-center">Pipelines Mapped</th>
                  <th className="px-4 py-3">Last Sync</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                {filteredAccounts.map((account) => {
                  const isSyncing = syncingId === account.id;

                  return (
                    <tr key={account.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {account.subAccountName}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {account.locationId}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          {account.workspaceId}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            account.syncStatus === 'Connected'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : account.syncStatus === 'Syncing'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              account.syncStatus === 'Connected'
                                ? 'bg-emerald-500'
                                : account.syncStatus === 'Syncing'
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-rose-500'
                            }`}
                          />
                          {account.syncStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                        {account.contactsSynced.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="rounded-[8px] bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {account.pipelinesMapped} pipelines
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {account.lastSync}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSyncAccount(account)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-blue-500' : 'text-slate-500'}`} />
                          {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Field Mappings View */}
      {activeTab === 'mappings' && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Global GoHighLevel Schema Alignment
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Defines how platform lead properties synchronize with GoHighLevel custom contact and opportunity fields.
                </p>
              </div>
              <button
                onClick={() => showToast('Field mapping schema verified across all locations')}
                className="rounded-[10px] bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 shadow-sm"
              >
                Verify Schema
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-[10px] border border-slate-200/80 dark:border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Platform Attribute</th>
                    <th className="px-4 py-2.5">Direction</th>
                    <th className="px-4 py-2.5">GoHighLevel Target Field</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                  {DEFAULT_FIELD_MAPPINGS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {item.sourceField}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.sourceDesc}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-[8px] bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <ArrowRightLeft className="h-3 w-3 text-blue-500" />
                          {item.direction}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-blue-600 dark:text-blue-400">
                          {item.ghlField}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Error Log */}
      {activeTab === 'errors' && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  Automated Retry Engine Active
                </h4>
                <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-400/80">
                  Webhook payload failures trigger exponential backoff retry at 1m, 5m, and 15m intervals. Failed payloads remain buffered in local persistent storage.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
            <div className="p-4 border-b border-slate-200/60 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                GoHighLevel Synchronization Exceptions ({ghlErrors.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-white/5">
              {ghlErrors.map((err) => (
                <div key={err.id} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-[8px] bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        {err.errorCode}
                      </span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                        {err.workspaceName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {err.timestamp}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {err.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => showToast(`Dispatched test event to resolve ${err.errorCode}`)}
                      className="rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Retry Sync
                    </button>
                    <button
                      onClick={() => showToast(`Exception ${err.id} marked as inspected`)}
                      className="rounded-[10px] border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
