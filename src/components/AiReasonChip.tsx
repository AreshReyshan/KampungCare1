import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  X,
  Users
} from 'lucide-react';
import type { TriageItem, Volunteer, Resident } from '../types';
import { decide, scoreVolunteers } from '../sim/autonomy';

interface AiReasonChipProps {
  item: TriageItem;
  volunteers: Volunteer[];
  resident?: Resident;
}

export const AiReasonChip: React.FC<AiReasonChipProps> = ({
  item,
  volunteers,
  resident,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const decision = decide(item, resident);
  const rankedHelpers = scoreVolunteers(item, volunteers, resident).slice(0, 3);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  let tierLabel = 'AUTO';
  let tierColor = 'bg-[#064e3b] text-[#6ee7b7] border-[#047857] hover:bg-[#065f46]';
  let TierIcon = CheckCircle2;

  if (decision.tier === 'propose') {
    tierLabel = 'PROPOSE';
    tierColor = 'bg-[#451a03] text-[#fcd34d] border-[#b45309] hover:bg-[#78350f]';
    TierIcon = AlertTriangle;
  } else if (decision.tier === 'human') {
    tierLabel = 'HUMAN ONLY';
    tierColor = 'bg-[#4c0519] text-[#fda4af] border-[#be123c] hover:bg-[#881337]';
    TierIcon = ShieldAlert;
  }

  return (
    <div className="relative inline-flex items-center" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all duration-120 ${tierColor} active:translate-y-px`}
        title="Inspect AI autonomy reasoning & candidate ranking"
      >
        <TierIcon className="w-3 h-3 shrink-0" />
        <span className="font-bold">{tierLabel}</span>
        {decision.tier !== 'human' && (
          <span className="opacity-90 font-mono">{(decision.confidence).toFixed(2)}</span>
        )}
        <HelpCircle className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Drawer / Tooltip */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 md:w-96 bg-[#101717] border border-[#253835] rounded-2xl p-4 shadow-2xl z-40 text-left animate-slide-up">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1c2c2a]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#162423] border border-[#2b3f3c] flex items-center justify-center text-[#10b981]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-white">
                  Autonomy Evaluation
                </span>
                <span className="text-[10px] text-[#809692] font-mono ml-2">
                  Urgency: {decision.urgency}/4
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 rounded-full hover:bg-[#1a2928] flex items-center justify-center text-[#809692] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reasoning bullets */}
          <div className="mt-3 space-y-1.5">
            <div className="text-[11px] font-semibold text-[#809692] font-sans">
              Decision rationale:
            </div>
            <ul className="space-y-1 text-xs text-[#c6d6d2] font-sans">
              {decision.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-[#10b981] mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 3 Volunteer Shortlist */}
          <div className="mt-4 pt-3 border-t border-[#1c2c2a] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#809692]">
              <span className="font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#10b981]" />
                Top volunteer matches:
              </span>
              <span className="font-mono text-[10px] text-[#738a86]">
                Score / Distance
              </span>
            </div>

            <div className="space-y-1.5">
              {rankedHelpers.map((h, idx) => (
                <div
                  key={h.volunteer.id}
                  className="p-2 rounded-xl bg-[#14201f] border border-[#20312f] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-[#738a86]">#{idx + 1}</span>
                      <span className="font-bold text-white truncate">{h.volunteer.name}</span>
                    </div>
                    <div className="text-[11px] text-[#809692] truncate mt-0.5">
                      {h.oneLineReason}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-[#10b981]">
                      {h.score}%
                    </span>
                    <div className="text-[10px] text-[#738a86] font-mono">
                      {h.distanceKm} km
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#697f7b] italic font-sans pt-1">
              * The AI model only ranks candidates based on proximity, skills, and language; policy rules govern actual dispatch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
