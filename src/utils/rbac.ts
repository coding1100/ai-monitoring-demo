import { UserRole } from '../types';

export interface ActionPermission {
  allowed: boolean;
  reason?: string;
}

export const checkPermission = (
  role: UserRole,
  action: 'create_plan' | 'approve_plan' | 'manage_rules' | 'test_connection' | 'trigger_run' | 'edit_lead' | 'send_outreach' | 'manage_team' | 'manage_billing'
): ActionPermission => {
  if (role === 'owner') {
    return { allowed: true };
  }

  if (role === 'admin') {
    return { allowed: true };
  }

  if (role === 'operator') {
    if (action === 'manage_billing') {
      return {
        allowed: false,
        reason: "Role 'operator' cannot modify billing plans. Requires owner or admin.",
      };
    }
    if (action === 'manage_team') {
      return {
        allowed: false,
        reason: "Role 'operator' cannot modify team permissions. Requires owner or admin.",
      };
    }
    return { allowed: true };
  }

  // Viewer role is read-only
  return {
    allowed: false,
    reason: `Role 'viewer' has read-only access. Switch to operator, admin, or owner in the footer to perform this action.`,
  };
};
