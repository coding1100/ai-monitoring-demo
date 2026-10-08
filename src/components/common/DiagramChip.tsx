import React from 'react';
import { Layers } from 'lucide-react';

interface DiagramChipProps {
  reference: string;
  type?: 'built' | 'bought' | 'database';
  className?: string;
}

export const DiagramChip: React.FC<DiagramChipProps> = ({
  reference,
  type = 'built',
  className = '',
}) => {
  const getStyle = () => {
    switch (type) {
      case 'database':
        return 'box-our-database text-blue-700 dark:text-blue-300';
      case 'bought':
        return 'box-bought-tool bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300';
      case 'built':
      default:
        return 'box-built-by-us bg-blue-50/70 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'database':
        return 'Our database';
      case 'bought':
        return 'Bought tool';
      case 'built':
      default:
        return 'Built by us';
    }
  };

  return (
    <div
      data-testid="diagram-chip"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-mono-numbers font-medium ${getStyle()} ${className}`}
      title={`Architecture layer box: ${reference} (${getLabel()})`}
    >
      <Layers className="w-3.5 h-3.5 opacity-70 shrink-0" strokeWidth={1.5} />
      <span className="tracking-tight">{reference}</span>
    </div>
  );
};
