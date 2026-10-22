import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ActiveDispatch } from '../types';

interface CompleteVisitModalProps {
  isOpen: boolean;
  dispatch: ActiveDispatch | null;
  onClose: () => void;
  onComplete: (dispatch: ActiveDispatch, outcome: string, notes: string) => void;
}

export const CompleteVisitModal: React.FC<CompleteVisitModalProps> = ({
  isOpen,
  dispatch,
  onClose,
  onComplete,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string>('Visit went smoothly');
  const [notes, setNotes] = useState<string>('All care requirements met. Senior was in good spirits.');

  if (!isOpen || !dispatch) return null;

  const outcomePills = [
    { label: 'Visit went smoothly', desc: 'No complications, senior is comfortable' },
    { label: 'Medication updated — schedule 48h check-in', desc: 'New prescription recorded, follow-up queued' },
    { label: 'Needs follow-up visit', desc: 'Flag for next community visit within 3 days' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
    onComplete(dispatch, selectedOutcome, notes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Complete Visit</h3>
                <p className="text-xs text-slate-400">Record visit outcome to Care Passport timeline</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Visit Details */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={dispatch.residentAvatar}
                  alt={dispatch.residentName}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-800 shadow-xs"
                />
                <div>
                  <div className="text-base font-bold text-white">{dispatch.residentName}</div>
                  <div className="text-xs text-slate-400">{dispatch.serviceType}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-slate-200">{dispatch.volunteerName}</div>
                <div className="text-xs text-emerald-400 font-medium">Assigned Helper</div>
              </div>
            </div>

            {/* Quick-Select Outcome Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Select Visit Outcome:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {outcomePills.map((pill) => {
                  const isSelected = selectedOutcome === pill.label;

                  return (
                    <button
                      type="button"
                      key={pill.label}
                      onClick={() => setSelectedOutcome(pill.label)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-white'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">{pill.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{pill.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Volunteer Field Notes:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Senior took morning medication, appetite good..."
                className="w-full text-xs text-white bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Complete Visit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
