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
      desc: 'Spoke with son or daughter. Verified daily care routine is maintained.'
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
        className="fixed inset-0 bg-[#060a0a]/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-[#101717] text-[#ecf4f2] rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-[#203030]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1d2a2a]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Log check-in</h3>
                <p className="text-xs text-[#87a09c]">Resolve overdue check-in status for {item.residentName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#182323] hover:bg-[#203030] flex items-center justify-center text-[#87a09c] hover:text-white transition-colors border border-[#243535]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Resident Card */}
            <div className="p-4 bg-[#141f1f] border border-[#223333] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.residentAvatar}
                  alt={item.residentName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#2c4040]"
                />
                <div>
                  <div className="text-sm font-semibold text-white">{item.residentName}</div>
                  <div className="text-xs text-[#87a09c]">{item.residentNeighborhood}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-amber-300 bg-amber-950/60 border border-amber-800/70">
                  {item.overdueDuration || '1 day overdue'}
                </span>
              </div>
            </div>

            {/* Check-in Outcome Options */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#87a09c]">
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
                      className={`w-full text-left p-3.5 rounded-2xl border transition-[background-color,border-color] flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/40'
                          : 'bg-[#141f1f] border-[#223333] hover:bg-[#182525]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 text-white'
                            : 'border-[#384e4e]'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-white">{opt.title}</div>
                        <div className="text-[11px] text-[#87a09c] mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#87a09c]">
                Call and check-in notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of conversation with senior..."
                className="w-full text-xs text-white bg-[#0c1313] p-3.5 rounded-xl border border-[#243535] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
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
