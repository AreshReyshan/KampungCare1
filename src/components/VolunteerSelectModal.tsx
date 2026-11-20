import React from 'react';
import { 
  X, 
  UserCheck, 
  Check, 
  Star 
} from 'lucide-react';
import type { TriageItem, Volunteer } from '../types';

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
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-2xl p-7 overflow-hidden animate-slide-up border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#0284c7]" />
                Select alternate volunteer
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign a volunteer for {triageItem.residentName}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 shadow-2xs"
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={vol.avatar}
                      alt={vol.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-slate-900">{vol.name}</span>
                        <span className="font-mono text-xs text-[#0284c7] bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full font-semibold">
                          {vol.distanceKm} km away
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-mono text-slate-800 text-xs font-bold">{vol.rating}</span>
                        </span>
                        <span>•</span>
                        <span>{vol.neighborhood}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {vol.verifiedSkills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="font-mono text-[11px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 hover:text-[#0284c7]">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
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
