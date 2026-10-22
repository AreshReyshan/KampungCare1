import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import type { TriageItem, Resident } from '../types';

interface QuickCheckInModalProps {
  isOpen: boolean;
  item: TriageItem | null;
  resident: Resident | null;
  onClose: () => void;
  onConfirmCheckIn: (item: TriageItem, outcome: string, notes: string) => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirmCheckIn,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string>(
    'Phone check-in completed — senior in good health & spirits'
  );
  const [notes, setNotes] = useState<string>(
    'Spoke directly with senior. BP medication taken on schedule, no complaints of dizziness.'
  );

  if (!isOpen || !item) return null;

  const checkInOptions = [
    {
      title: 'Phone check-in completed — senior in good health & spirits',
      desc: 'Direct call to resident. Confirmed well-being and safe at home.'
    },
    {
      title: 'Next of Kin contacted — family confirmed senior is well',
      desc: 'Spoke with son/daughter. Verified care routine is maintained.'
    },
    {
      title: 'Routine medication & vitals verified',
      desc: 'Checked blood pressure reading and medication schedule.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCheckIn(item, selectedOutcome, notes);
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
              <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Log Quick Check-In</h3>
                <p className="text-xs text-slate-400">Resolve overdue check-in status for {item.residentName}</p>
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
            {/* Resident Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.residentAvatar}
                  alt={item.residentName}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-800 shadow-xs"
                />
                <div>
                  <div className="text-base font-bold text-white">{item.residentName}</div>
                  <div className="text-xs text-slate-400">{item.residentNeighborhood}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  {item.overdueDuration || '1 day overdue'}
                </span>
              </div>
            </div>

            {/* Check-in Outcome Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Check-in Result:
              </label>

              <div className="space-y-2.5">
                {checkInOptions.map((opt) => {
                  const isSelected = selectedOutcome === opt.title;

                  return (
                    <button
                      type="button"
                      key={opt.title}
                      onClick={() => setSelectedOutcome(opt.title)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-sky-400 bg-sky-500 text-white'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">{opt.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Call / Check-in Notes:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of conversation with senior..."
                className="w-full text-xs text-white bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
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
                className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Mark Check-In Resolved</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
