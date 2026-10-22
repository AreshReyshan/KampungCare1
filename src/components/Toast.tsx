import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  X, 
  ShieldAlert, 
  MessageSquare 
} from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        let borderClass = 'border-slate-800';
        let bgClass = 'bg-slate-900/95';

        if (toast.type === 'emergency') {
          icon = <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />;
          borderClass = 'border-rose-800';
          bgClass = 'bg-rose-950/95 text-rose-100';
        } else if (toast.type === 'info') {
          icon = <Send className="w-5 h-5 text-sky-400" />;
          borderClass = 'border-sky-800/80';
          bgClass = 'bg-slate-900/95 text-sky-200';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
          borderClass = 'border-amber-800/80';
          bgClass = 'bg-amber-950/95 text-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3.5 transition-all animate-slide-up ${bgClass} ${borderClass}`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white leading-tight">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-xs text-slate-300 mt-1 leading-snug">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
