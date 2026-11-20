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
    { label: 'Visit went smoothly', desc: 'No complications, senior is comfortable and stable' },
    { label: 'Medication updated — schedule 48h check-in', desc: 'New prescription recorded, follow-up scheduled' },
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
    } catch {
      // ignore
    }
    onComplete(dispatch, selectedOutcome, notes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7] shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Complete visit</h3>
                <p className="text-xs text-slate-500">Record visit outcome to Care Passport timeline</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Visit Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3.5">
                <img
                  src={dispatch.residentAvatar}
                  alt={dispatch.residentName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{dispatch.residentName}</div>
                  <div className="text-xs text-slate-500">{dispatch.serviceType}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-slate-900">{dispatch.volunteerName}</div>
                <div className="font-mono text-[11px] text-[#0284c7] font-semibold">Assigned helper</div>
              </div>
            </div>

            {/* Quick-Select Outcome Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Select visit outcome
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
                          ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#0284c7] bg-[#0284c7] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-900">{pill.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{pill.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Volunteer field notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Senior took morning medication, appetite good..."
                className="w-full text-xs text-slate-900 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="dose-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="dose-btn-primary flex items-center gap-2 text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; complete visit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
