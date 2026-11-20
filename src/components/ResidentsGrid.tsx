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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono-dose">
        <span>Enrolled residents: {filteredResidents.length} in Setapak &amp; Taman Melati</span>
        <span>Tap any passport to inspect health records</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResidents.map((resident) => {
          return (
            <article
              key={resident.id}
              onClick={() => onSelectResident(resident.id)}
              className="dose-tray p-6 hover:border-sky-300 transition-all duration-150 cursor-pointer flex flex-col justify-between bg-white border border-slate-200 shadow-xs hover:shadow-md group rounded-2xl"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={resident.avatar}
                        alt={resident.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                      {resident.isOverdue ? (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ec4899] border-2 border-white" title="Check-in overdue" />
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0284c7] border-2 border-white" title="Active check-in" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors font-display">
                        {resident.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono-dose">
                        <span>{resident.age} yrs</span>
                        <span>•</span>
                        <span>{resident.gender === 'male' ? 'Male' : 'Female'}</span>
                        <span>•</span>
                        <span>{resident.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-slate-400 group-hover:text-[#0284c7] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>

                {/* Location & Languages */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                    <span className="truncate">{resident.address}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono-dose bg-sky-50 text-[#0284c7] border border-sky-200 font-semibold">
                      {resident.mobilityBadge}
                    </span>
                    {resident.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 rounded text-[11px] font-sans bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Care Focus */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5 font-sans">
                    <Heart className="w-3.5 h-3.5 text-[#ec4899] fill-[#ec4899]/20" />
                    <span>Primary care priority</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                    {resident.careNeeds[0]?.description || 'Regular wellness checks.'}
                  </p>
                </div>
              </div>

              {/* Footer info: Last check-in & Emergency contact */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono-dose text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Last check-in: {resident.lastCheckIn}
                </span>
                <span className="text-[#0284c7] font-semibold hover:underline">
                  Care passport →
                </span>
              </div>
            </article>
          );
        })}

        {filteredResidents.length === 0 && (
          <div className="col-span-2 p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm font-semibold text-slate-900 font-display">No residents match this search query</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Try searching by resident name, language, or street</p>
          </div>
        )}
      </div>
    </div>
  );
};
