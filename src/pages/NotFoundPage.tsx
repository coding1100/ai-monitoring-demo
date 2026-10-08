import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { DiagramChip } from '../components/common/DiagramChip';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="glass-modal p-8 max-w-md w-full space-y-5 border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold">
            Status Code 404
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested route does not match any operational layer in this architecture demo.
          </p>
        </div>

        <div className="flex justify-center pt-1">
          <DiagramChip reference="00 Overview / Not Found" type="built" />
        </div>

        <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-control bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to System Map</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
