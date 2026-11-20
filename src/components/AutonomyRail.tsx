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
          className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-[#121c1c] text-[#10b981] border-l border-y border-[#20312f] px-2 py-4 rounded-l-xl shadow-xl flex flex-col items-center gap-2 hover:bg-[#182625] transition-colors"
          title="Open AI Autonomy Stream"
        >
          <Bot className="w-4 h-4 animate-pulse text-[#10b981]" />
          <span className="[writing-mode:vertical-rl] text-[10px] font-mono tracking-wider text-[#a7f3d0]">
            AI STREAM ({events.length})
          </span>
          <ChevronLeft className="w-3.5 h-3.5 text-[#809692]" />
        </button>
      )}

      {/* Persistent Rail Panel */}
      {isOpen && (
        <aside
          aria-label="AI Autonomy Stream"
          className="w-80 md:w-88 shrink-0 bg-[#0e1616] border-l border-[#1c2c2a] flex flex-col h-full z-20 transition-all duration-200"
        >
          {/* Rail Header */}
          <div className="p-4 bg-[#101919] border-b border-[#1c2c2a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-[#162524] border border-[#2b3f3c] flex items-center justify-center text-[#10b981]">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10b981]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-xs text-white">
                    AI Autonomy Rail
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#064e3b] text-[#6ee7b7] border border-[#047857]">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#809692] font-mono">
                  Supervised execution stream
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg hover:bg-[#1a2928] flex items-center justify-center text-[#809692] hover:text-white transition-colors"
              title="Collapse Autonomy Rail"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-header status ticker */}
          <div className="px-4 py-2 bg-[#121c1c] border-b border-[#1c2c2a] flex items-center justify-between text-[10px] text-[#809692] font-mono">
            <span>Latency: ~1.2s triage • ~0.8s dispatch</span>
            <span className="text-[#a7f3d0] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Supervised
            </span>
          </div>

          {/* Event Stream List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {events.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-[#809692] space-y-2 border border-dashed border-[#1c2c2a] rounded-xl">
                <Clock className="w-6 h-6 text-[#738a86]" />
                <div className="text-xs font-semibold text-[#f0f5f4] font-display">
                  Awaiting Intake Stream
                </div>
                <p className="text-[11px] font-sans">
                  Inbound Telegram, WhatsApp, or IoT sensor events will stream live decisions here.
                </p>
              </div>
            ) : (
              events.map((ev) => {
                let TierIcon = CheckCircle2;
                let tierBadge = 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]';

                if (ev.tier === 'propose') {
                  TierIcon = AlertTriangle;
                  tierBadge = 'bg-[#451a03] text-[#fcd34d] border-[#b45309]';
                } else if (ev.tier === 'human') {
                  TierIcon = ShieldAlert;
                  tierBadge = 'bg-[#4c0519] text-[#fda4af] border-[#be123c]';
                }

                return (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-[#121c1c] border border-[#20312f] space-y-2 transition-all duration-150 animate-slide-up shadow-sm"
                  >
                    {/* Timestamp & Tier Badge */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[#738a86] text-[10px]">
                          [{ev.timestampLabel}]
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${tierBadge}`}
                        >
                          <TierIcon className="w-2.5 h-2.5" />
                          {ev.tier.toUpperCase()}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#809692] font-mono">
                        {(ev.confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <div className="text-xs font-bold text-white font-display">
                        {ev.title}
                      </div>
                      <div className="text-[11px] text-[#9eb1ad] font-sans mt-0.5">
                        {ev.subtitle}
                      </div>
                    </div>

                    {/* Staged details */}
                    {ev.details && ev.details.length > 0 && (
                      <div className="p-2 rounded-lg bg-[#0c1313] border border-[#1a2826] space-y-1 text-[11px] font-sans text-[#c6d6d2]">
                        {ev.details.map((d, i) => (
                          <div key={i} className="flex items-start gap-1 leading-snug">
                            <span className="text-[#10b981]">•</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 8-second Undo Affordance for Auto actions */}
                    {ev.tier === 'auto' && ev.undoActionId && onUndoEvent && !ev.undone && (
                      <div className="pt-1 flex items-center justify-between border-t border-[#1c2c2a]">
                        <span className="text-[10px] text-[#809692] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#10b981]" />
                          Reversible (8s window)
                        </span>

                        <button
                          onClick={() => onUndoEvent(ev.undoActionId!)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-[#182625] hover:bg-[#20312f] text-[#6ee7b7] text-[10px] font-mono border border-[#2b3f3c] transition-colors active:translate-y-px"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      </div>
                    )}

                    {ev.undone && (
                      <div className="text-[10px] font-mono text-[#f87171] pt-1 border-t border-[#1c2c2a]">
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
