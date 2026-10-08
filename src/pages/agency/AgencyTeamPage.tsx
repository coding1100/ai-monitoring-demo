import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Users,
  Shield,
  UserPlus,
  Check,
  X,
  Mail,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { AgencyTeamMember } from '../../types';

interface PermissionRow {
  category: string;
  action: string;
  superAdmin: boolean;
  support: boolean;
  billing: boolean;
}

const PERMISSION_MATRIX: PermissionRow[] = [
  { category: 'Billing & Tiers', action: 'Modify pricing tiers & unit cost assumptions', superAdmin: true, support: false, billing: true },
  { category: 'Billing & Tiers', action: 'Retry failed dunning payments & issue credits', superAdmin: true, support: false, billing: true },
  { category: 'Workspaces', action: 'Create and provision new client workspaces', superAdmin: true, support: true, billing: false },
  { category: 'Workspaces', action: 'Archive or pause customer workspaces', superAdmin: true, support: false, billing: false },
  { category: 'Workspaces', action: 'Launch support session into client workspace', superAdmin: true, support: true, billing: false },
  { category: 'Infrastructure', action: 'Re-trigger n8n workflows & view payload queues', superAdmin: true, support: true, billing: false },
  { category: 'Infrastructure', action: 'Execute database RLS isolation verification audit', superAdmin: true, support: false, billing: false },
  { category: 'Team & Security', action: 'Invite agency staff & modify permission roles', superAdmin: true, support: false, billing: false },
  { category: 'Analytics', action: 'View aggregate MRR, gross margin, & telemetry', superAdmin: true, support: false, billing: true },
];

export const AgencyTeamPage: React.FC = () => {
  const { agencyTeam } = useDemoStore();
  const [members, setMembers] = useState<AgencyTeamMember[]>(agencyTeam);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite modal form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'super_admin' | 'support' | 'billing'>('support');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newMember: AgencyTeamMember = {
        id: `ag-${Date.now().toString().slice(-4)}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        lastActive: 'Invitation pending',
      };
      setMembers((prev) => [newMember, ...prev]);
      setIsSubmitting(false);
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('support');
      showToast(`Invitation dispatched to ${inviteEmail}`);
    }, 500);
  };

  const handleRoleChange = (memberId: string, newRole: 'super_admin' | 'support' | 'billing') => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast('Updated member permission role');
  };

  const getRoleLabel = (role: AgencyTeamMember['role']) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'support':
        return 'Support Specialist';
      case 'billing':
        return 'Billing Manager';
    }
  };

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
              01 Control / Team
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Agency Access Governance</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Agency Team & Roles
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage agency operators, support agents, billing managers, and RBAC permission matrices.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Invite Agency Member
        </button>
      </div>

      {/* Agency Members Table */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Agency Staff ({members.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Single sign-on enforced with hardware security keys
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {member.name}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      className="rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="support">Support Specialist</option>
                      <option value="billing">Billing Manager</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{member.lastActive}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => showToast(`Sent credentials reset prompt to ${member.email}`)}
                      className="rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Reset Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Role Permission Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Role-based capability assignments across tenant boundaries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Category & Capability</th>
                <th className="px-4 py-3 text-center">Super Admin</th>
                <th className="px-4 py-3 text-center">Support Specialist</th>
                <th className="px-4 py-3 text-center">Billing Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {PERMISSION_MATRIX.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <span className="rounded-[6px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400 mr-2">
                      {perm.category}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {perm.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {perm.superAdmin ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {perm.support ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {perm.billing ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Invite Agency Member
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Price"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan@northstarmarketing.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  Role Permission
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="mt-1 w-full rounded-[10px] border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-white"
                >
                  <option value="super_admin">Super Admin (Unrestricted governance & infrastructure)</option>
                  <option value="support">Support Specialist (Workspace support sessions & logs)</option>
                  <option value="billing">Billing Manager (Invoices, dunning & tiers)</option>
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-[10px] border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[10px] bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
