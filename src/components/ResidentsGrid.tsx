import React from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Heart,
  Clock
} from 'lucide-react';
import type { Resident } from '../types';

interface ResidentsGridProps {
  residents: Resident[];
  searchQuery: string;
  onSelectResident: (residentId: string) => void;
}

export const ResidentsGrid: React.FC<ResidentsGridProps> = ({
  residents,
  searchQuery,
  onSelectResident,
}) => {
  const filteredResidents = residents.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.neighborhood.toLowerCase().includes(q) ||
      r.mobilityBadge.toLowerCase().includes(q) ||
      r.languages.some((l) => l.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Showing {filteredResidents.length} enrolled residents in Setapak &amp; Taman Melati</span>
        <span className="text-[11px] text-slate-500">Click any profile to view full Care Passport</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResidents.map((resident) => {
          return (
            <div
              key={resident.id}
              onClick={() => onSelectResident(resident.id)}
              className="group bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={resident.avatar}
                        alt={resident.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-sky-400 transition-all shadow-sm"
                      />
                      {resident.isOverdue ? (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 ring-2 ring-slate-900" title="Check-in overdue" />
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" title="Active & checked in" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                        {resident.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-300">{resident.age} years old</span>
                        <span>•</span>
                        <span className="text-slate-400">{resident.gender === 'male' ? 'Male' : 'Female'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>

                {/* Location & Languages */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{resident.address}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-950 text-sky-300 border border-sky-800/80">
                      {resident.mobilityBadge}
                    </span>
                    {resident.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Care Needs Previews */}
                <div className="mt-3 bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>Primary Care Focus:</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {resident.careNeeds[0]?.description || 'Regular wellness checks.'}
                  </p>
                </div>
              </div>

              {/* Footer info: Last check-in & Emergency contact */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Last check-in: {resident.lastCheckIn}
                </span>
                <span className="text-sky-400 font-semibold group-hover:underline">
                  View Passport →
                </span>
              </div>
            </div>
          );
        })}

        {filteredResidents.length === 0 && (
          <div className="col-span-2 bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-sm font-semibold text-slate-300">No residents match your search</p>
            <p className="text-xs text-slate-500 mt-1">Try searching by resident name, language, or neighborhood</p>
          </div>
        )}
      </div>
    </div>
  );
};
