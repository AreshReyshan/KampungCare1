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
        className="fixed inset-0 bg-[#0c1313]/80 backdrop-blur-sm transition-opacity duration-150 ease-out"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#0e1717] text-[#f0f5f4] rounded-2xl shadow-2xl p-6 overflow-hidden border border-[#20312f] space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1c2c2a]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2b1016] border border-[#881337] flex items-center justify-center text-[#fda4af]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">Resolve emergency record</h3>
                <p className="text-xs text-[#809692] font-sans">Confirm 999 paramedic coordination and notify next-of-kin</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#182625] hover:bg-[#20312f] border border-[#2b3f3c] flex items-center justify-center text-[#9eb1ad] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resident Summary */}
            <div className="p-3.5 bg-[#1f1015] border border-[#881337]/60 rounded-xl flex items-center gap-3.5">
              <img
                src={item.residentAvatar}
                alt={item.residentName}
                className="w-12 h-12 rounded-lg object-cover border border-[#be123c]/50 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white font-display">{item.residentName}</span>
                  <span className="text-xs text-[#fda4af] font-mono-dose">{item.residentAge} yrs</span>
                </div>
                <p className="text-xs text-[#fecdd3] truncate mt-0.5 font-sans">
                  "{item.emergencySummary}"
                </p>
              </div>
            </div>

            {/* Action options */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#c6d6d2] font-sans">
                Resolution verification:
              </label>

              <div className="grid grid-cols-1 gap-2">
                <label
                  onClick={() => setSelectedStatus('999_dispatched')}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${
                    selectedStatus === '999_dispatched'
                      ? 'bg-[#2b1016] border-[#be123c]'
                      : 'bg-[#121c1c] border-[#20312f] hover:bg-[#182625]'
                  }`}
                >
                  <Ambulance className="w-4 h-4 text-[#f43f5e] shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white font-display">
                      999 Ambulance dispatched &amp; verified
                    </div>
                    <div className="text-[#809692] font-sans mt-0.5">Paramedic team assigned to resident's address.</div>
                  </div>
                </label>

                <label
                  onClick={() => setSelectedStatus('responder_arrived')}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${
                    selectedStatus === 'responder_arrived'
                      ? 'bg-[#142e27] border-[#059669]'
                      : 'bg-[#121c1c] border-[#20312f] hover:bg-[#182625]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#10b981] shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white font-display">
                      Local first responder on scene
                    </div>
                    <div className="text-[#809692] font-sans mt-0.5">Community volunteer arrived, resident conscious and stable.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Next of Kin Check */}
            <div className="p-3 bg-[#121c1c] border border-[#20312f] rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-sans">
                <Phone className="w-3.5 h-3.5 text-[#10b981]" />
                <div>
                  <span className="text-[#809692]">Next-of-kin contacted: </span>
                  <span className="text-[#f0f5f4] font-medium font-mono-dose">
                    {resident?.emergencyContact.name || 'Zainab (Daughter)'} ({resident?.emergencyContact.phone || '+60 12-345 6789'})
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={nokContacted}
                onChange={(e) => setNokContacted(e.target.checked)}
                className="w-4 h-4 rounded text-[#10b981] focus:ring-[#10b981] bg-[#0c1313] border-[#2b3f3c]"
              />
            </div>

            {/* Coordination notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#c6d6d2] font-sans">
                Coordination notes (recorded in passport):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of call with hospital or family..."
                className="w-full text-xs text-[#f0f5f4] bg-[#0c1313] p-3 rounded-lg border border-[#20312f] focus:outline-none focus:border-[#10b981] font-sans leading-relaxed"
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
