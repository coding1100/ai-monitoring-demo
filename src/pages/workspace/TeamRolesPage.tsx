import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Check,
  X,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { DiagramChip } from '../../components/common/DiagramChip';
import { DataScopeBadge } from '../../components/common/DataScopeBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { useDemoStore } from '../../store/useDemoStore';
import { UserRole } from '../../types';

export const TeamRolesPage: React.FC = () => {
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);
  const teamMembers = useDemoStore((state) => state.teamMembers).filter((m) => m.workspace_id === currentWorkspaceId);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('operator');

  const matrix = [
    { action: 'Execute AI Campaigns & Prompts', owner: true, admin: true, operator: true, viewer: false },
    { action: 'Approve Campaign Plans in Gate', owner: true, admin: true, operator: false, viewer: false },
    { action: 'Edit Rules in Code & Caps', owner: true, admin: true, operator: true, viewer: false },
    { action: 'Test Integrations & Masked Keys', owner: true, admin: true, operator: true, viewer: false },
    { action: 'Invite Team & Assign Roles', owner: true, admin: true, operator: false, viewer: false },
    { action: 'Billing, Tier Upgrades & Invoices', owner: true, admin: false, operator: false, viewer: false },
    { action: 'View Real-Time Dashboard & Telemetry', owner: true, admin: true, operator: true, viewer: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-400">WORKSPACE</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Team & Roles</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Team Members & RBAC Permission Matrix
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Role-based access control governing campaign approval, rule modifications, and billing actions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <DataScopeBadge tableName="workspace_memberships" count={teamMembers.length} />
          <DiagramChip reference="Workspace / Team and roles" type="built" />
        </div>
      </div>

      {/* Team Members List */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            Active Workspace Seats ({teamMembers.length})
          </h3>
          <ActionButton
            rbacAction="manage_team"
            variant="primary"
            size="sm"
            onClick={() => setInviteModalOpen(true)}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </ActionButton>
        </div>

        <div className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
          {teamMembers.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent font-semibold flex items-center justify-center font-mono text-xs">
                  {member.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-medium bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                  {member.role}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">{member.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permission Capability Matrix */}
      <div className="glass-dense p-5 rounded-panel space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
            RBAC Capability Matrix
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            Enforced across all button tooltips
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono uppercase text-slate-500 bg-slate-100/40 dark:bg-slate-900/40">
                <th className="px-3 py-2 font-medium">Platform Operation</th>
                <th className="px-3 py-2 font-medium text-center">Owner</th>
                <th className="px-3 py-2 font-medium text-center">Admin</th>
                <th className="px-3 py-2 font-medium text-center">Operator</th>
                <th className="px-3 py-2 font-medium text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-200/40 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{row.action}</td>
                  <td className="px-3 py-2 text-center">{row.owner ? <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />}</td>
                  <td className="px-3 py-2 text-center">{row.admin ? <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />}</td>
                  <td className="px-3 py-2 text-center">{row.operator ? <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />}</td>
                  <td className="px-3 py-2 text-center">{row.viewer ? <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-modal max-w-sm w-full p-6 space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Invite Team Member
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Assigned Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-2.5 py-1.5 rounded-control bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 capitalize"
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-3 py-1.5 text-xs rounded-control bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <ActionButton
                variant="primary"
                size="sm"
                onClick={() => setInviteModalOpen(false)}
              >
                Send Invite
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
