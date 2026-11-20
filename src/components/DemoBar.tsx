import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Clock, 
  AlertTriangle, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import type { SimulationSpeed } from '../sim/types';
import { DEMO_BEATS } from '../sim/scenarios';

interface DemoBarProps {
  virtualSeconds: number;
  formattedTime: string;
  isPlaying: boolean;
  speed: SimulationSpeed;
  onPlayPause: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: SimulationSpeed) => void;
  onOpenAuditDrawer: () => void;
  auditCounts: { auto: number; propose: number; human: number };
}

export const DemoBar: React.FC<DemoBarProps> = ({
  virtualSeconds,
  formattedTime,
  isPlaying,
  speed,
  onPlayPause,
  onRestart,
  onSetSpeed,
  onOpenAuditDrawer,
  auditCounts,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Keyboard shortcuts: Space for play/pause, R for restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowResetConfirm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause]);

  // Determine current beat
  const totalDuration = 180; // 3 minutes demo
  let currentBeat = DEMO_BEATS[0];
  for (const b of DEMO_BEATS) {
    if (virtualSeconds >= b.atSeconds) {
      currentBeat = b;
    }
  }

  const progressPercent = Math.min(100, (virtualSeconds / totalDuration) * 100);

  return (
    <>
      {/* Bottom Fixed Control Strip */}
      <footer className="sticky bottom-0 z-40 bg-[#0a1111]/95 backdrop-blur-md border-t border-[#1c2c2a] px-6 py-3 text-white shadow-2xl">
        {/* Progress Bar with Beat Ticks */}
        <div className="relative w-full h-1 bg-[#162423] rounded-full mb-3 overflow-visible">
          <div
            className="h-full bg-gradient-to-r from-[#10b981] via-[#059669] to-[#34d399] rounded-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Beat Markers */}
          {DEMO_BEATS.map((beat) => {
            const markerPos = (beat.atSeconds / totalDuration) * 100;
            const isPassed = virtualSeconds >= beat.atSeconds;
            return (
              <div
                key={beat.number}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                style={{ left: `${markerPos}%` }}
                title={`Beat ${beat.number}: ${beat.label} (${beat.timeLabel})`}
              >
                <div
                  className={`w-2 h-2 rounded-full border transition-all duration-150 ${
                    isPassed
                      ? 'bg-[#10b981] border-white scale-125'
                      : 'bg-[#1e302e] border-[#314a46]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Play / Pause, Restart, Virtual Clock */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayPause}
              className={`dose-btn-primary h-9 px-3.5 text-xs font-mono flex items-center gap-2 ${
                isPlaying ? 'bg-[#065f46]' : ''
              }`}
              title="Toggle Live Demo (Space)"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE DEMO</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN DEMO</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="dose-btn-secondary h-9 px-3 text-xs font-mono text-[#809692] hover:text-white flex items-center gap-1.5"
              title="Restart Simulation (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>

            {/* Virtual Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121c1c] border border-[#20312f] rounded-lg">
              <Clock className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="font-mono text-xs font-bold text-[#f0f5f4]">
                {formattedTime}
              </span>
              <span className="text-[10px] text-[#738a86] font-mono">/ 3:00</span>
            </div>

            {/* Current Beat Info Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#121c1c] border border-[#20312f] rounded-lg text-xs">
              <span className="font-mono text-[#10b981] font-bold">
                Beat {currentBeat.number} of {DEMO_BEATS.length}
              </span>
              <span className="text-[#809692]">•</span>
              <span className="text-[#f0f5f4] font-medium truncate max-w-xs">
                {currentBeat.label}
              </span>
            </div>
          </div>

          {/* Right: Speed Selector & Audit Drawer Trigger */}
          <div className="flex items-center gap-3">
            {/* Speed Multiplier */}
            <div className="flex items-center bg-[#121c1c] border border-[#20312f] rounded-lg p-0.5">
              <span className="text-[10px] font-mono text-[#809692] px-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#10b981]" />
                Speed:
              </span>
              {([1, 4, 12] as SimulationSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onSetSpeed(s)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold transition-colors ${
                    speed === s
                      ? 'bg-[#10b981] text-[#042f2e]'
                      : 'text-[#809692] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Audit Log Drawer Quick Trigger */}
            <button
              onClick={onOpenAuditDrawer}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#121c1c] hover:bg-[#182625] text-xs border border-[#20312f] hover:border-[#10b981]/50 rounded-lg transition-colors font-mono"
              title="Open Autonomous Governance Audit Log"
            >
              <FileText className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-white font-bold">Audit</span>
              <span className="text-[#a7f3d0]">
                Auto {auditCounts.auto} • Propose {auditCounts.propose} • Human {auditCounts.human}
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Restart Warning Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#060a0a]/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowResetConfirm(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#101717] text-[#ecf4f2] rounded-3xl shadow-2xl p-6 border border-[#203030] animate-slide-up">
              <div className="flex items-center gap-3 pb-3 border-b border-[#1d2a2a]">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Restart Demo Run?
                  </h3>
                  <p className="text-xs text-[#87a09c]">
                    Resets clock to 0:00 and restores initial state
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#c6d6d2] mt-4 font-sans leading-relaxed">
                This will reset the virtual clock, reset the seeded PRNG, cancel all in-flight dispatches, and restore initial seed data byte-for-byte.
              </p>

              <div className="mt-5 pt-3 border-t border-[#1d2a2a] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="dose-btn-secondary text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowResetConfirm(false);
                    onRestart();
                  }}
                  className="dose-btn-primary text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Restart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
