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
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-lg text-white">Select Community Helper</h3>
              <p className="text-xs text-slate-400">
                Assign a volunteer for {triageItem.residentName}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-800 shadow-xs"
                    />

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-base text-white">{vol.name}</span>
                        <span className="text-xs text-sky-400 font-bold bg-sky-950/80 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
                          {vol.distanceKm} km away
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-slate-200 font-semibold">{vol.rating}</span>
                        </span>
                        <span>•</span>
                        <span>{vol.neighborhood}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {vol.verifiedSkills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-500 hover:text-sky-400">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
