import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  X, 
  ShieldAlert, 
  RotateCcw 
} from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  // Max 3 stacked toasts
  const visibleToasts = toasts.slice(-3);

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {visibleToasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        let borderClass = 'border-slate-200';
        let bgClass = 'bg-white/95 text-slate-900 shadow-xl';

        if (toast.type === 'emergency') {
          icon = <ShieldAlert className="w-5 h-5 text-[#ec4899] animate-pulse" />;
          borderClass = 'border-pink-300';
          bgClass = 'bg-pink-50/95 text-pink-950 shadow-xl';
        } else if (toast.type === 'info') {
          icon = <Send className="w-5 h-5 text-[#0284c7]" />;
          borderClass = 'border-sky-200';
          bgClass = 'bg-sky-50/95 text-sky-950 shadow-xl';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
          borderClass = 'border-amber-300';
          bgClass = 'bg-amber-50/95 text-amber-950 shadow-xl';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3.5 transition-all animate-slide-up ${bgClass} ${borderClass}`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>

            <div className="flex-1 min-w-0">
              <div className="font-display text-sm font-semibold leading-tight text-slate-900">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-xs text-slate-600 mt-1 leading-snug">
                  {toast.description}
                </div>
              )}

              {toast.onUndo && (
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      toast.onUndo!();
                      onDismiss(toast.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-[#0284c7] text-[11px] font-mono border border-sky-200 transition-colors active:translate-y-px font-bold shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo Action</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
