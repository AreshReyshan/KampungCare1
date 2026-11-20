import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Bot, 
  User, 
  Clock 
} from 'lucide-react';
import type { AuditEntry } from '../sim/types';

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AuditEntry[];
  onUndo: (id: string) => void;
}

type FilterType = 'all' | 'auto' | 'propose' | 'human';

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
  entries,
  onUndo,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  let autoCount = 0;
  let proposeCount = 0;
  let humanCount = 0;

  for (const e of entries) {
    if (e.undone) continue;
    if (e.tier === 'auto') autoCount++;
    else if (e.tier === 'propose') proposeCount++;
    else if (e.tier === 'human') humanCount++;
  }

  const filteredEntries = entries.filter((e) => {
    if (filter === 'all') return true;
    return e.tier === filter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white text-slate-900 shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Autonomy Audit Log
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Deterministic audit trail of all AI &amp; human actions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Header Counter Pill Strip */}
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
              <span>Auto {autoCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Proposed {proposeCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-[#db2777] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
              <span>Human {humanCount}</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-1">
            {(['all', 'auto', 'propose', 'human'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-[#0284c7] text-white font-bold shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f === 'all' ? `All (${entries.length})` : f}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800 font-display">
                No audit records in this view
              </div>
              <p className="text-xs font-sans max-w-xs mx-auto text-slate-500">
                Actions executed by the autonomous engine or coordinator will appear here in chronological order.
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              let TierIcon = CheckCircle2;
              let tierBadge = 'bg-sky-100 text-[#0284c7] border-sky-200';

              if (entry.tier === 'propose') {
                TierIcon = AlertTriangle;
                tierBadge = 'bg-amber-100 text-amber-800 border-amber-200';
              } else if (entry.tier === 'human') {
                TierIcon = ShieldAlert;
                tierBadge = 'bg-pink-100 text-[#db2777] border-pink-200 font-bold';
              } else if (entry.tier === 'system') {
                TierIcon = Clock;
                tierBadge = 'bg-slate-100 text-slate-700 border-slate-200';
              }

              const isAi = entry.actor === 'AI';

              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl border transition-all duration-120 ${
                    entry.undone
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">
                        [{entry.timestampLabel}]
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700">
                        {isAi ? (
                          <>
                            <Bot className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span className="font-bold">AI Agent</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-bold">Human Coordinator</span>
                          </>
                        )}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border uppercase ${tierBadge}`}
                      >
                        <TierIcon className="w-2.5 h-2.5" />
                        {entry.tier}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {entry.realTime}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 font-display">
                      {entry.title}
                    </h4>

                    {entry.reasoning && entry.reasoning.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700 font-sans shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                          Reasoning &amp; Policy:
                        </div>
                        {entry.reasoning.map((r, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-[#0284c7]">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reversible Action Handler */}
                  {entry.tier === 'auto' && entry.undo && !entry.undone && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-sans">
                        Reversible automated action:
                      </span>
                      <button
                        onClick={() => onUndo(entry.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-xs font-mono font-bold border border-sky-200 transition-colors active:translate-y-px shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo Action</span>
                      </button>
                    </div>
                  )}

                  {entry.undone && (
                    <div className="mt-2 text-xs font-mono text-pink-600 font-semibold">
                      ✓ Action reverted by coordinator
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
