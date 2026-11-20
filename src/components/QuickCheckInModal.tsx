import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2 
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
  const [selectedOutcome, setSelectedOutcome] = useState<string>('Phone check-in confirmed OK');
  const [notes, setNotes] = useState<string>('Spoke with senior directly. Vital signs and mobility reported normal.');

  if (!isOpen || !item) return null;

  const checkInOptions = [
    {
      title: 'Phone check-in confirmed OK',
      desc: 'Spoke with resident directly. Well-being and safety confirmed.'
    },
    {
      title: 'Next-of-kin contacted & verified',
      desc: 'Family member confirmed senior is safe and in their care.'
    },
    {
      title: 'Routine medication & vitals verified',
      desc: 'Checked blood pressure reading and daily medication schedule.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCheckIn(item, selectedOutcome, notes);
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
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Log check-in</h3>
                <p className="text-xs text-slate-500">Resolve overdue check-in status for {item.residentName}</p>
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
            {/* Resident Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.residentAvatar}
                  alt={item.residentName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.residentName}</div>
                  <div className="text-xs text-slate-500">{item.residentNeighborhood}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#db2777] bg-pink-50 border border-pink-200 font-semibold">
                  {item.overdueDuration || '1 day overdue'}
                </span>
              </div>
            </div>

            {/* Check-in Outcome Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Check-in result
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
                        <div className="text-xs font-semibold text-slate-900">{opt.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Call and check-in notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of conversation with senior..."
                className="w-full text-xs text-slate-900 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0284c7] focus:bg-white shadow-inner transition-all"
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
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Mark check-in resolved</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
