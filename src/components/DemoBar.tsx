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
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 text-slate-900 shadow-xl">
        {/* Progress Bar with Beat Ticks */}
        <div className="relative w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-visible">
          <div
            className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] rounded-full transition-all duration-200 shadow-2xs"
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
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-150 ${
                    isPassed
                      ? 'bg-[#0284c7] border-white scale-125 shadow-xs'
                      : 'bg-slate-200 border-slate-300'
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
              className={`dose-btn-primary h-9 px-3.5 text-xs font-mono flex items-center gap-2 shadow-sm ${
                isPlaying ? 'bg-[#0369a1]' : ''
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
              className="dose-btn-secondary h-9 px-3 text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1.5 shadow-2xs"
              title="Restart Simulation (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>

            {/* Virtual Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="font-mono text-xs font-bold text-slate-900">
                {formattedTime}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 3:00</span>
            </div>

            {/* Current Beat Info Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs shadow-2xs">
              <span className="font-mono text-[#0284c7] font-bold">
                Beat {currentBeat.number} of {DEMO_BEATS.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-medium truncate max-w-xs">
                {currentBeat.label}
              </span>
            </div>
          </div>

          {/* Right: Speed Selector & Audit Drawer Trigger */}
          <div className="flex items-center gap-3">
            {/* Speed Multiplier */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-500 px-2 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3 text-[#0284c7]" />
                Speed:
              </span>
              {([1, 4, 12] as SimulationSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onSetSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    speed === s
                      ? 'bg-[#0284c7] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Audit Log Drawer Quick Trigger (Bubblegum Pink accented) */}
            <button
              onClick={onOpenAuditDrawer}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-xs border border-pink-200 rounded-xl transition-all font-mono shadow-2xs"
              title="Open Autonomous Governance Audit Log"
            >
              <FileText className="w-3.5 h-3.5 text-[#ec4899]" />
              <span className="text-slate-900 font-bold">Audit</span>
              <span className="text-[#db2777] font-semibold font-mono text-[11px]">
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowResetConfirm(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 animate-slide-up">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Restart Demo Run?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Resets clock to 0:00 and restores initial state
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-4 font-sans leading-relaxed">
                This will reset the virtual clock, reset the seeded PRNG, cancel all in-flight dispatches, and restore initial seed data byte-for-byte.
              </p>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
