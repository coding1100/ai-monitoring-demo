import React, { useEffect } from 'react';
import { Lock, X, ArrowRight } from 'lucide-react';

interface Phase2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription: string;
}

export const Phase2Modal: React.FC<Phase2ModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-modal max-w-md w-full p-6 relative border border-slate-300/40 dark:border-slate-700/50"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-control text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-control bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-xs font-mono font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Not in phase 1
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {featureTitle}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          {featureDescription}
        </p>

        <div className="p-3 rounded-control bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-400 mb-5">
          <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">Architecture Roadmap Scope</div>
          Phase 1 focuses on core Control, Orchestration, Workflows, Data, and Output reporting layers. Dedicated multi-tenant isolated white-label apps and custom relational data modeling are scheduled for Phase 2.
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-control bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Understood</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
