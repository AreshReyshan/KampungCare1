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
        className="absolute inset-0 bg-[#060a0a]/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-[#0c1414] text-[#ecf4f2] shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-[#20312f]">
        {/* Drawer Header */}
        <div className="p-6 bg-[#101919] border-b border-[#1c2c2a] shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#162524] border border-[#2b3f3c] flex items-center justify-center text-[#10b981]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Autonomy Audit Log
                </h3>
                <p className="text-xs text-[#809692] font-mono">
                  Deterministic audit trail of all AI &amp; human actions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#162222] hover:bg-[#1f2f2e] border border-[#263836] flex items-center justify-center text-[#809692] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Header Counter Pill Strip */}
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#064e3b]/40 border border-[#047857] text-[#6ee7b7] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>Auto {autoCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#451a03]/40 border border-[#b45309] text-[#fcd34d] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span>Proposed {proposeCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#4c0519]/40 border border-[#be123c] text-[#fda4af] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
              <span>Human {humanCount}</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pt-1">
            {(['all', 'auto', 'propose', 'human'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#10b981] text-[#042f2e] font-bold'
                    : 'bg-[#121c1c] text-[#809692] hover:text-white border border-[#20312f]'
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
            <div className="py-16 text-center text-[#809692] space-y-2 border border-dashed border-[#1c2c2a] rounded-2xl">
              <FileText className="w-8 h-8 text-[#738a86] mx-auto" />
              <div className="text-sm font-bold text-white font-display">
                No audit records in this view
              </div>
              <p className="text-xs font-sans max-w-xs mx-auto">
                Actions executed by the autonomous engine or coordinator will appear here in chronological order.
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              let TierIcon = CheckCircle2;
              let tierBadge = 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]';

              if (entry.tier === 'propose') {
                TierIcon = AlertTriangle;
                tierBadge = 'bg-[#451a03] text-[#fcd34d] border-[#b45309]';
              } else if (entry.tier === 'human') {
                TierIcon = ShieldAlert;
                tierBadge = 'bg-[#4c0519] text-[#fda4af] border-[#be123c]';
              } else if (entry.tier === 'system') {
                TierIcon = Clock;
                tierBadge = 'bg-[#182625] text-[#a7f3d0] border-[#2b3f3c]';
              }

              const isAi = entry.actor === 'AI';

              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl border transition-all duration-120 ${
                    entry.undone
                      ? 'bg-[#0f1414] border-[#1c2625] opacity-60'
                      : 'bg-[#121c1c] border-[#20312f] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1c2c2a]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#809692] text-[11px]">
                        [{entry.timestampLabel}]
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#c6d6d2]">
                        {isAi ? (
                          <>
                            <Bot className="w-3.5 h-3.5 text-[#10b981]" />
                            <span className="font-bold">AI Agent</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5 text-[#38bdf8]" />
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

                    <span className="text-[10px] text-[#738a86] font-mono">
                      {entry.realTime}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <h4 className="text-sm font-bold text-white font-display">
                      {entry.title}
                    </h4>

                    {entry.reasoning && entry.reasoning.length > 0 && (
                      <div className="p-3 rounded-xl bg-[#0c1313] border border-[#1a2826] space-y-1 text-xs text-[#c6d6d2] font-sans">
                        <div className="text-[10px] font-mono text-[#809692] uppercase">
                          Reasoning &amp; Policy:
                        </div>
                        {entry.reasoning.map((r, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-[#10b981]">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reversible Action Handler */}
                  {entry.tier === 'auto' && entry.undo && !entry.undone && (
                    <div className="mt-3 pt-2.5 border-t border-[#1c2c2a] flex items-center justify-between">
                      <span className="text-[11px] text-[#809692] font-sans">
                        Reversible automated action:
                      </span>
                      <button
                        onClick={() => onUndo(entry.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182625] hover:bg-[#20312f] text-[#6ee7b7] text-xs font-mono font-bold border border-[#2b3f3c] transition-colors active:translate-y-px"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo Action</span>
                      </button>
                    </div>
                  )}

                  {entry.undone && (
                    <div className="mt-2 text-xs font-mono text-[#f87171]">
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
