import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Users,
  Shield,
  UserPlus,
  Mail,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';
import { UserRole } from '../../types';

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Invited';
}

const DEFAULT_WORKSPACE_MEMBERS: WorkspaceMember[] = [
  { id: 'wm-1', name: 'Dr. Evelyn Reed', email: 'evelyn@practice.com', role: 'owner', status: 'Active' },
  { id: 'wm-2', name: 'Tyler Higgins', email: 'tyler@practice.com', role: 'admin', status: 'Active' },
  { id: 'wm-3', name: 'Samantha Wu', email: 'samantha@practice.com', role: 'operator', status: 'Active' },
  { id: 'wm-4', name: 'Finance Reviewer', email: 'audit@practice.com', role: 'viewer', status: 'Active' },
];

export const ClientTeamPage: React.FC = () => {
  const { currentRole, setRole } = useDemoStore();
  const [members, setMembers] = useState<WorkspaceMember[]>(DEFAULT_WORKSPACE_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite modal form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('operator');
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
      const newMember: WorkspaceMember = {
        id: `wm-${Date.now().toString().slice(-4)}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        status: 'Invited',
      };
      setMembers([...members, newMember]);
      setIsSubmitting(false);
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('operator');
      showToast(`Invitation sent to ${inviteEmail}`);
    }, 500);
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast('Updated member workspace permissions');
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
            <span className="text-xs text-slate-400 dark:text-slate-500">Workspace Collaboration</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Team & Access
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Control member invitations and assign role-based permissions (owner, admin, operator, viewer).
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-[10px] bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Invite Team Member
        </button>
      </div>

      {/* Role Descriptions Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[12px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Owner</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Full workspace administration, billing subscription management, and workspace destruction.
          </p>
        </div>

        <div className="rounded-[12px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Admin</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Campaign approval gateway, integration API credentials, team invitations, and guardrail rules.
          </p>
        </div>

        <div className="rounded-[12px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Operator</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            AI command center prompt submission, CRM contact triage, email review, and manual SMS replies.
          </p>
        </div>

        <div className="rounded-[12px] border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Viewer</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Read-only access to campaign analytics, contact tables, and monthly performance reports.
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-[14px] border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Workspace Members ({members.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Current active view role: <strong className="font-mono capitalize">{currentRole}</strong>
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {member.name}
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                    className="rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm focus:outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 capitalize"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      member.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setRole(member.role);
                      showToast(`Switched active preview role to ${member.role}`);
                    }}
                    className="rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    View as {member.role}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-[14px] border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Invite Workspace Colleague
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
                  placeholder="e.g. Alex Morgan"
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
                  placeholder="e.g. alex@practice.com"
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
                  <option value="admin">Admin (Full settings & approvals)</option>
                  <option value="operator">Operator (Campaign execution & triage)</option>
                  <option value="viewer">Viewer (Read-only reports)</option>
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
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
