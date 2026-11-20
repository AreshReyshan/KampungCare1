import React from 'react';
import { 
  Bot, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import type { AutonomyRailEvent } from '../sim/types';

interface AutonomyRailProps {
  events: AutonomyRailEvent[];
  onUndoEvent?: (eventId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AutonomyRail: React.FC<AutonomyRailProps> = ({
  events,
  onUndoEvent,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Floating Toggle Tab when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-white text-[#0284c7] border-l border-y border-slate-200 px-2 py-4 rounded-l-2xl shadow-md flex flex-col items-center gap-2 hover:bg-sky-50 transition-colors"
          title="Open AI Autonomy Stream"
        >
          <Bot className="w-4 h-4 animate-pulse text-[#0284c7]" />
          <span className="[writing-mode:vertical-rl] text-[10px] font-mono tracking-wider text-[#0284c7] font-bold">
            AI STREAM ({events.length})
          </span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* Persistent Rail Panel */}
      {isOpen && (
        <aside
          aria-label="AI Autonomy Stream"
          className="w-80 md:w-88 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full z-20 transition-all duration-200 shadow-md"
        >
          {/* Rail Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7]">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0284c7] animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0284c7]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-xs text-slate-900">
                    AI Autonomy Rail
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-sky-100 text-[#0284c7] border border-sky-200 font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Supervised execution stream
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Collapse Autonomy Rail"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-header status ticker */}
          <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Latency: ~1.2s triage • ~0.8s dispatch</span>
            <span className="text-[#0284c7] flex items-center gap-1 font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              Supervised
            </span>
          </div>

          {/* Event Stream List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {events.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <Clock className="w-6 h-6 text-slate-400" />
                <div className="text-xs font-semibold text-slate-800 font-display">
                  Awaiting Intake Stream
                </div>
                <p className="text-[11px] font-sans text-slate-500">
                  Inbound Telegram, WhatsApp, or IoT sensor events will stream live decisions here.
                </p>
              </div>
            ) : (
              events.map((ev) => {
                let TierIcon = CheckCircle2;
                let tierBadge = 'bg-sky-100 text-[#0284c7] border-sky-200';

                if (ev.tier === 'propose') {
                  TierIcon = AlertTriangle;
                  tierBadge = 'bg-amber-100 text-amber-800 border-amber-200';
                } else if (ev.tier === 'human') {
                  TierIcon = ShieldAlert;
                  tierBadge = 'bg-pink-100 text-[#db2777] border-pink-200 font-bold';
                }

                return (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 transition-all duration-150 animate-slide-up shadow-2xs"
                  >
                    {/* Timestamp & Tier Badge */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-400 text-[10px]">
                          [{ev.timestampLabel}]
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${tierBadge}`}
                        >
                          <TierIcon className="w-2.5 h-2.5" />
                          {ev.tier.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">
                        {(ev.confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-display">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-slate-600 font-sans mt-0.5">
                        {ev.subtitle}
                      </div>
                    </div>

                    {/* Staged details */}
                    {ev.details && ev.details.length > 0 && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1 text-[11px] font-sans text-slate-700 shadow-2xs">
                        {ev.details.map((d, i) => (
                          <div key={i} className="flex items-start gap-1 leading-snug">
                            <span className="text-[#0284c7]">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 8-second Undo Affordance for Auto actions */}
                    {ev.tier === 'auto' && ev.undoActionId && onUndoEvent && !ev.undone && (
                      <div className="pt-1 flex items-center justify-between border-t border-slate-200">
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#0284c7]" />
                          Reversible (8s window)
                        </span>

                        <button
                          onClick={() => onUndoEvent(ev.undoActionId!)}
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-[10px] font-mono border border-sky-200 transition-colors active:translate-y-px font-semibold shadow-2xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      </div>
                    )}

                    {ev.undone && (
                      <div className="text-[10px] font-mono text-pink-600 pt-1 border-t border-slate-200 font-semibold">
                        Action successfully undone
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}
    </>
  );
};
