import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  ShieldCheck,
  Database,
  Lock,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Layers,
  Code2,
} from 'lucide-react';

interface SchemaTableItem {
  tableName: string;
  isolationKey: string;
  policyName: string;
  description: string;
  rowsTotal: string;
}

const DATABASE_TABLES: SchemaTableItem[] = [
  {
    tableName: 'public.leads',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_leads',
    description: 'B2B and B2C contact records, enrichment telemetry, and scoring.',
    rowsTotal: '24,890',
  },
  {
    tableName: 'public.campaigns',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_campaigns',
    description: 'Active outreach schedules, sequences, and AI prompt configs.',
    rowsTotal: '112',
  },
  {
    tableName: 'public.messages',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_messages',
    description: 'Sent emails, inbound replies, and SMS thread conversations.',
    rowsTotal: '142,300',
  },
  {
    tableName: 'public.integrations',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_integrations',
    description: 'API credentials encrypted via envelope KMS per tenant.',
    rowsTotal: '98',
  },
  {
    tableName: 'public.crm_sync',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_crm',
    description: 'GoHighLevel and HubSpot location mappings and cursor sync state.',
    rowsTotal: '12',
  },
  {
    tableName: 'public.audit_logs',
    isolationKey: 'workspace_id (UUID)',
    policyName: 'tenant_isolation_audit',
    description: 'Immutable ledger of operator approvals, actions, and overrides.',
    rowsTotal: '84,150',
  },
  {
    tableName: 'storage.objects',
    isolationKey: 'workspace_id (prefix)',
    policyName: 'tenant_isolation_storage',
    description: 'Media uploads, PDF reports, and exported campaign files.',
    rowsTotal: '1,240',
  },
  {
    tableName: 'vault.decrypted_secrets',
    isolationKey: 'workspace_id (KMS)',
    policyName: 'tenant_isolation_vault',
    description: 'Ephemeral decrypted secrets available only in session scope.',
    rowsTotal: '12',
  },
];

export const AgencyIsolationPage: React.FC = () => {
  const {
    isolationChecks,
    isolationAuditRunning,
    runIsolationAudit,
  } = useDemoStore();
  const [auditTimestamp, setAuditTimestamp] = React.useState<string>('Just now');

  const handleRunAudit = async () => {
    await runIsolationAudit();
    setAuditTimestamp('Just now');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-600 dark:text-blue-400">
              04 Data / Security
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Multi-Tenant Boundary Proof</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Isolation & RLS Security
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cryptographic tenant partitioning in PostgreSQL. Every query is filtered at the database engine via Row-Level Security (RLS) bound to workspace_id.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isolationAuditRunning}
          className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
        >
          <Play className={`h-3.5 w-3.5 ${isolationAuditRunning ? 'animate-spin' : ''}`} />
          {isolationAuditRunning ? 'Simulating Probes (1.5s)...' : 'Run Cross-Workspace Audit'}
        </button>
      </div>

      {/* Architecture Diagram: workspace_id on every table */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Database Architecture: Mandatory workspace_id Scope
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Solid border: Built by us
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Filled: Supabase PostgreSQL
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Central DB Authority Node */}
          <div className="md:col-span-4 rounded-[12px] border border-blue-500/40 bg-blue-500/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    PostgreSQL Session Context: current_setting('app.current_workspace_id')
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Injected via authenticated JWT on every connection. Zero rows are returned if header token is missing or forged.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 self-start sm:self-auto">
                ENFORCEMENT: KERNEL LEVEL
              </span>
            </div>
          </div>

          {/* 4 Representative Architecture Cards */}
          <div className="rounded-[10px] border border-slate-200/80 bg-white/50 p-3 shadow-xs dark:border-white/10 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">public.leads</span>
              <Lock className="h-3 w-3 text-emerald-500" />
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">workspace_id (UUID) [FK]</div>
              <div>id (UUID) [PK]</div>
              <div>email, lead_score, stage</div>
            </div>
          </div>

          <div className="rounded-[10px] border border-slate-200/80 bg-white/50 p-3 shadow-xs dark:border-white/10 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">public.campaigns</span>
              <Lock className="h-3 w-3 text-emerald-500" />
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">workspace_id (UUID) [FK]</div>
              <div>id (UUID) [PK]</div>
              <div>audience_json, budget, state</div>
            </div>
          </div>

          <div className="rounded-[10px] border border-slate-200/80 bg-white/50 p-3 shadow-xs dark:border-white/10 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">public.messages</span>
              <Lock className="h-3 w-3 text-emerald-500" />
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">workspace_id (UUID) [FK]</div>
              <div>id (UUID) [PK]</div>
              <div>lead_id, channel, transcript</div>
            </div>
          </div>

          <div className="rounded-[10px] border border-slate-200/80 bg-white/50 p-3 shadow-xs dark:border-white/10 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">vault.secrets</span>
              <Lock className="h-3 w-3 text-emerald-500" />
            </div>
            <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">workspace_id (UUID) [FK]</div>
              <div>encrypted_key (AES-256)</div>
              <div>kms_keyring_version</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Workspace Access Test Panel */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Cross-Workspace Access Test (Penetration Suite)
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Executes 8 hostile test queries attempting to pierce tenant perimeter without workspace authorizations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {auditTimestamp && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock className="h-3 w-3" />
                Tested: {auditTimestamp}
              </span>
            )}
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              0 Rows Leaked (8/8 Passed)
            </span>
          </div>
        </div>

        {/* Audit Test Results */}
        <div className="divide-y divide-slate-200/60 dark:divide-white/5">
          {isolationChecks.map((chk) => (
            <div
              key={chk.id}
              className="p-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-[6px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                    Check #{chk.id}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                    {chk.name}
                  </span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    [{chk.targetTable}]
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span data-testid="isolation-check-rows" className="rounded-[6px] bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {chk.rowsReturned} rows
                  </span>
                  <span data-testid="isolation-check-status" className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {chk.status}
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-[8px] bg-slate-50 p-2.5 font-mono text-[11px] text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                <span className="text-slate-400 select-none">$ </span>
                {chk.attemptedAction}
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                <span>Enforcement: {chk.enforcementRule}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database Tables with RLS Policy Badges */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Database Table Schemas & Row-Level Security Policies
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            All 8 core tables have RLS enabled (ALTER TABLE ... ENABLE ROW LEVEL SECURITY)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Database Table</th>
                <th className="px-4 py-3">Isolation Foreign Key</th>
                <th className="px-4 py-3">RLS Security Policy</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">RLS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {DATABASE_TABLES.map((tbl, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {tbl.tableName}
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                    {tbl.isolationKey}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {tbl.policyName}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {tbl.description}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Lock className="h-2.5 w-2.5" />
                      RLS Enforced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
