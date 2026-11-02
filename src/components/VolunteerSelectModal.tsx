import React from 'react';
import { 
  X, 
  Check, 
  Star 
} from 'lucide-react';
import type { Volunteer, TriageItem } from '../types';

interface VolunteerSelectModalProps {
  isOpen: boolean;
  triageItem: TriageItem | null;
  volunteers: Volunteer[];
  onClose: () => void;
  onSelectVolunteer: (triageItemId: string, volunteerId: string) => void;
}

export const VolunteerSelectModal: React.FC<VolunteerSelectModalProps> = ({
  isOpen,
  triageItem,
  volunteers,
  onClose,
  onSelectVolunteer,
}) => {
  if (!isOpen || !triageItem) return null;

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
            <div>
              <h3 className="font-display font-bold text-lg text-white">Select community helper</h3>
              <p className="text-xs text-[#87a09c]">
                Assign a volunteer for {triageItem.residentName}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#182323] hover:bg-[#203030] flex items-center justify-center text-[#87a09c] hover:text-white transition-colors border border-[#243535]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Volunteer List */}
          <div className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {volunteers.map((vol) => {
              const isSelected = triageItem.matchedVolunteerId === vol.id;

              return (
                <div
                  key={vol.id}
                  onClick={() => {
                    onSelectVolunteer(triageItem.id, vol.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-[background-color,border-color] cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/40'
                      : 'bg-[#141f1f] border-[#223333] hover:bg-[#182525] hover:border-[#2a3c3c]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#2c4040]"
                    />

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-white">{vol.name}</span>
                        <span className="font-mono text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                          {vol.distanceKm} km away
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#87a09c] mt-1">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-mono text-[#ecf4f2] text-xs">{vol.rating}</span>
                        </span>
                        <span>•</span>
                        <span>{vol.neighborhood}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {vol.verifiedSkills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-[11px] bg-[#1a2626] text-[#a8bfbc] border border-[#2b3d3d] px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#87a09c] hover:text-emerald-400">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#1d2a2a] flex justify-end">
            <button
              onClick={onClose}
              className="dose-btn-secondary text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
