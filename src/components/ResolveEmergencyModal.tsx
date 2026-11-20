import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Ambulance, 
  UserCheck, 
  Phone
} from 'lucide-react';
import type { TriageItem, Resident } from '../types';

interface ResolveEmergencyModalProps {
  isOpen: boolean;
  item: TriageItem | null;
  resident: Resident | null;
  onClose: () => void;
  onResolve: (item: TriageItem, resolutionNotes: string) => void;
}

export const ResolveEmergencyModal: React.FC<ResolveEmergencyModalProps> = ({
  isOpen,
  item,
  resident,
  onClose,
  onResolve,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('999_dispatched');
  const [nokContacted, setNokContacted] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>(
    'Coordinated with 999 MERS ambulance (Hospital Selayang dispatch). Contacted daughter Zainab; she is en route to PPR Sri Melati.'
  );

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(item, notes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-150 ease-out"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden border border-slate-200 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#ec4899] shadow-2xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 font-display">Resolve emergency record</h3>
                <p className="text-xs text-slate-500 font-sans">Confirm 999 paramedic coordination and notify next-of-kin</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resident Summary (Bubblegum Pink) */}
            <div className="p-3.5 bg-pink-50/80 border border-pink-200 rounded-2xl flex items-center gap-3.5 shadow-2xs">
              <img
                src={item.residentAvatar}
                alt={item.residentName}
                className="w-12 h-12 rounded-xl object-cover border border-pink-300 shrink-0 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 font-display">{item.residentName}</span>
                  <span className="text-xs text-pink-700 font-mono-dose font-semibold">{item.residentAge} yrs</span>
                </div>
                <p className="text-xs text-slate-800 truncate mt-0.5 font-sans font-medium">
                  "{item.emergencySummary}"
                </p>
              </div>
            </div>

            {/* Action options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 font-sans">
                Resolution verification:
              </label>

              <div className="grid grid-cols-1 gap-2">
                <label
                  onClick={() => setSelectedStatus('999_dispatched')}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    selectedStatus === '999_dispatched'
                      ? 'bg-pink-50 border-pink-300 text-pink-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Ambulance className="w-5 h-5 text-[#ec4899] shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 font-display">
                      999 Ambulance dispatched &amp; verified
                    </div>
                    <div className="text-slate-500 font-sans mt-0.5">Paramedic team assigned to resident's address.</div>
                  </div>
                </label>

                <label
                  onClick={() => setSelectedStatus('responder_arrived')}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    selectedStatus === 'responder_arrived'
                      ? 'bg-sky-50 border-sky-300 text-sky-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-[#0284c7] shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 font-display">
                      Local first responder on scene
                    </div>
                    <div className="text-slate-500 font-sans mt-0.5">Community volunteer arrived, resident conscious and stable.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Next of Kin Check */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-sans">
                <Phone className="w-3.5 h-3.5 text-[#0284c7]" />
                <div>
                  <span className="text-slate-500">Next-of-kin contacted: </span>
                  <span className="text-slate-900 font-medium font-mono-dose">
                    {resident?.emergencyContact.name || 'Zainab (Daughter)'} ({resident?.emergencyContact.phone || '+60 12-345 6789'})
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={nokContacted}
                onChange={(e) => setNokContacted(e.target.checked)}
                className="w-4 h-4 rounded text-[#0284c7] focus:ring-[#0284c7] border-slate-300 cursor-pointer"
              />
            </div>

            {/* Coordination notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 font-sans">
                Coordination notes (recorded in passport):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of call with hospital or family..."
                className="w-full text-xs text-slate-900 bg-slate-50 p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0284c7] focus:bg-white font-sans leading-relaxed transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="dose-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="dose-btn-emergency"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm resolution</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
