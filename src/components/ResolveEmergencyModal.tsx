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
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Resolve Emergency Alert</h3>
                <p className="text-xs text-slate-400">Log coordination and close high-priority banner</p>
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
            {/* Resident Snapshot */}
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-center gap-4">
              <img
                src={item.residentAvatar}
                alt={item.residentName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white">{item.residentName}</span>
                  <span className="text-xs text-slate-400">• {item.residentAge}yo</span>
                </div>
                <p className="text-xs text-rose-200 font-medium truncate mt-0.5">
                  "{item.emergencySummary}"
                </p>
              </div>
            </div>

            {/* Quick Actions Radio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Resolution Action Taken:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                <label
                  onClick={() => setSelectedStatus('999_dispatched')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition-all ${
                    selectedStatus === '999_dispatched'
                      ? 'bg-rose-950/50 border-rose-500 ring-1 ring-rose-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <Ambulance className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white text-sm">
                      999 Ambulance Dispatched &amp; Verified
                    </div>
                    <div className="text-slate-400 mt-0.5">Paramedic team assigned to resident's address.</div>
                  </div>
                </label>

                <label
                  onClick={() => setSelectedStatus('responder_arrived')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition-all ${
                    selectedStatus === 'responder_arrived'
                      ? 'bg-rose-950/50 border-rose-500 ring-1 ring-rose-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white text-sm">
                      Local First Responder / Volunteer on Scene
                    </div>
                    <div className="text-slate-400 mt-0.5">Ahmad Danial arrived, resident is conscious &amp; safe.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Next of Kin Confirmation */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400" />
                <div className="text-xs">
                  <span className="font-bold text-white">Next of Kin Contacted: </span>
                  <span className="text-slate-400">
                    {resident?.emergencyContact.name || 'Zainab (Daughter)'} (
                    {resident?.emergencyContact.phone || '+60 12-345 6789'})
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={nokContacted}
                onChange={(e) => setNokContacted(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 bg-slate-800 border-slate-700"
              />
            </div>

            {/* Call Log Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Coordination Notes (Logged to Care Passport Timeline):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of call with hospital/family..."
                className="w-full text-xs text-white bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500"
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
                className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Log Resolution</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
