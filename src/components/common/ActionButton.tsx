import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { checkPermission } from '../../utils/rbac';
import { fakeDelay } from '../../utils/seededRandom';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rbacAction?: 'create_plan' | 'approve_plan' | 'manage_rules' | 'test_connection' | 'trigger_run' | 'edit_lead' | 'send_outreach' | 'manage_team' | 'manage_billing';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  simulateLatency?: boolean;
  onAsyncClick?: () => Promise<void> | void;
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  rbacAction,
  variant = 'primary',
  size = 'md',
  simulateLatency = true,
  onAsyncClick,
  onClick,
  disabled,
  className = '',
  children,
  ...rest
}) => {
  const currentRole = useDemoStore((state) => state.currentRole);
  const [loading, setLoading] = useState(false);

  const permission = rbacAction ? checkPermission(currentRole, rbacAction) : { allowed: true };
  const isDenied = !permission.allowed;
  const isDisabled = disabled || isDenied || loading;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (onClick) onClick(e);

    if (onAsyncClick) {
      setLoading(true);
      if (simulateLatency) {
        await fakeDelay();
      }
      try {
        await onAsyncClick();
      } finally {
        setLoading(false);
      }
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-control transition-all duration-150 select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  }[size];

  const variantStyles = {
    primary:
      'bg-accent hover:bg-accent-hover text-white shadow-sm disabled:bg-blue-400/40 dark:disabled:bg-blue-900/40 disabled:text-slate-400 disabled:cursor-not-allowed active:translate-y-[1px]',
    secondary:
      'bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-300/60 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100 border border-slate-300/40 dark:border-slate-700/40 disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed',
    ghost:
      'hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed',
  }[variant];

  const tooltipText = isDenied ? permission.reason : (rest.title || (disabled ? 'Action not available' : undefined));

  return (
    <span
      className="inline-block relative group"
      title={tooltipText}
    >
      <button
        {...rest}
        disabled={isDisabled}
        title={tooltipText}
        onClick={handleClick}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />}
        {children}
      </button>

      {/* Tooltip on denied action */}
      {isDenied && (
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[260px] p-2 bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 text-center font-normal">
          {permission.reason}
        </span>
      )}
    </span>
  );
};
