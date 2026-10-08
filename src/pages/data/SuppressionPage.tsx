import React, { useState } from 'react';
import {
  UserX,
  Search,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertOctagon,
  Trash2,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { SuppressionRecord } from '../../types';
import { fakeDelay } from '../../utils/seededRandom';

export const SuppressionPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const suppressionList = useDemoStore((state) => state.suppressionList).filter(
    (s) => s.workspace_id === currentWorkspaceId
  );
  const addSuppression = useDemoStore((state) => state.addSuppression);

  // Address checker state
  const [checkQuery, setCheckQuery] = useState('');
  const [checkResult, setCheckResult] = useState<{
    found: boolean;
    record?: SuppressionRecord;
    message: string;
  } | null>(null);

  // Add new suppression modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newType, setNewType] = useState<'email' | 'phone' | 'domain'>('email');
  const [newValue, setNewValue] = useState('');
  const [newReason, setNewReason] = useState<SuppressionRecord['reason']>('manual_suppression');

  const handleCheckAddress = async () => {
    if (!checkQuery.trim()) return;
    await fakeDelay(350);

    const q = checkQuery.trim().toLowerCase();
    const found = suppressionList.find((s) => s.value.toLowerCase() === q || (s.type === 'domain' && q.endsWith(s.value.toLowerCase())));

    if (found) {
      setCheckResult({
        found: true,
        record: found,
        message: `SUPPRESSED: Address/Domain "${found.value}" is blocked in code (${found.reason}). Dispatches will be rejected.`,
      });
    } else {
      setCheckResult({
        found: false,
        message: `CLEAN: "${checkQuery}" is not on the suppression list and is eligible for outreach.`,
      });
    }
  };

  const handleAddSuppression = async () => {
    if (!newValue.trim()) return;
    addSuppression({
      id: `sup_manual_${Date.now()}`,
      workspace_id: currentWorkspaceId,
      type: newType,
      value: newValue.trim(),
      reason: newReason,
      source: 'Operator Manual Add',
      addedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
    setNewValue('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">04 DATA</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Suppression List</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Global Suppression & Compliance Registry
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Deterministic blacklist of opted-out recipients, hard bounces, and excluded competitor domains.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="suppression_registry" count={suppressionList.length} />
          <DiagramChip reference="04 Data / Suppression list" type="database" />
        </div>
      </div>

      {/* Check an Address Box */}
      <div className="glass-dense p-5 rounded-panel space-y-3 border-l-4 border-l-rose-500">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
          Check an Address or Domain Status
        </h3>
        <p className="text-xs text-slate-500">
          Verify whether an email, phone number, or corporate domain is blocked before launching a batch.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckAddress();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1"
        >
          <input
            type="text"
            placeholder="e.g. g.sinclair@auracosmetic.com or competitoraesthetics.com..."
            value={checkQuery}
            onChange={(e) => setCheckQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCheckAddress();
              }
            }}
            aria-label="Address or domain to check for suppression"
            className="flex-1 px-3 py-2 text-xs font-mono rounded-control bg-slate-100/70 dark:bg-slate-900/60 border border-slate-300/60 dark:border-slate-800 text-slate-900 dark:text-slate-100"
          />
          <ActionButton
            variant="primary"
            size="md"
            onAsyncClick={handleCheckAddress}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check Address</span>
          </ActionButton>
        </form>

        {checkResult && (
          <div
            className={`p-3 rounded-control text-xs font-mono flex items-center gap-2 animate-fade-in ${
              checkResult.found
                ? 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {checkResult.found ? (
              <AlertOctagon className="w-4 h-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{checkResult.message}</span>
          </div>
        )}
      </div>

      {/* Suppression Records Table & Actions */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
              Suppressed Records ({suppressionList.length})
            </h3>
            <span className="text-xs text-slate-500">Evaluated on every dispatch tick</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-control bg-accent hover:bg-accent-hover text-white shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Target Value</th>
                <th className="px-3 py-2 font-medium">Reason</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium text-right">Added Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {suppressionList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40 font-mono">
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                    {s.value}
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[11px] text-red-600 dark:text-red-400 capitalize">
                      {s.reason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-[11px] font-sans">
                    {s.source}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-400 text-[11px]">
                    {s.addedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-modal max-w-md w-full p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Add Address to Suppression List
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono"
                >
                  <option value="email">Email Address</option>
                  <option value="phone">Phone Number</option>
                  <option value="domain">Corporate Domain</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Value (e.g. john@company.com or competitor.com)
                </label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Suppression Reason
                </label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800"
                >
                  <option value="manual_suppression">Manual Suppression</option>
                  <option value="user_opt_out">User Opt-Out</option>
                  <option value="hard_bounce">Hard Bounce</option>
                  <option value="complaint">Spam Complaint</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-3 py-1.5 text-xs rounded-control bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <ActionButton
                variant="primary"
                size="sm"
                onAsyncClick={handleAddSuppression}
              >
                Save Suppression
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
