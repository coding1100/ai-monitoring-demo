import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';

interface DataScopeBadgeProps {
  tableName: string;
  count?: number;
  className?: string;
}

export const DataScopeBadge: React.FC<DataScopeBadgeProps> = ({
  tableName,
  count,
  className = '',
}) => {
  const showDataScope = useDemoStore((state) => state.showDataScope);
  const currentWorkspaceId = useDemoStore((state) => state.currentWorkspaceId);

  if (!showDataScope) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-mono-numbers animate-fade-in ${className}`}
    >
      <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.5} />
      <span>
        Scope: <strong className="font-semibold">workspace_id = '{currentWorkspaceId}'</strong>
      </span>
      <span className="opacity-40">|</span>
      <span>
        Table: <code className="bg-emerald-500/15 px-1 py-0.5 rounded text-[11px] font-mono">{tableName}</code>
      </span>
      {typeof count === 'number' && (
        <>
          <span className="opacity-40">|</span>
          <span>{count} rows filtered</span>
        </>
      )}
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" strokeWidth={1.5} />
    </div>
  );
};
