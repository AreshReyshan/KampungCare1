import React from 'react';
import { 
  Send, 
  ShieldCheck, 
  Star, 
  MessageSquare 
} from 'lucide-react';
import type { Volunteer } from '../types';

interface VolunteersGridProps {
  volunteers: Volunteer[];
  searchQuery: string;
  onContactVolunteer: (volunteer: Volunteer, channel: 'telegram' | 'whatsapp') => void;
}

export const VolunteersGrid: React.FC<VolunteersGridProps> = ({
  volunteers,
  searchQuery,
  onContactVolunteer,
}) => {
  const filteredVolunteers = volunteers.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.neighborhood.toLowerCase().includes(q) ||
      v.verifiedSkills.some((s) => s.toLowerCase().includes(q)) ||
      v.languages.some((l) => l.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono-dose">
        <span>Verified community helpers: {filteredVolunteers.length} registered in Setapak</span>
        <span>Identity &amp; background clearance verified</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVolunteers.map((vol) => {
          const isOnline = vol.status === 'available';
          const isOnVisit = vol.status === 'on_visit';

          return (
            <article
              key={vol.id}
              className="dose-tray p-6 flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all duration-150 bg-white border border-slate-200 shadow-xs hover:shadow-md rounded-2xl"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name & Proximity */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={vol.avatar}
                        alt={vol.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isOnline
                            ? 'bg-[#0284c7]'
                            : isOnVisit
                            ? 'bg-[#ec4899]'
                            : 'bg-slate-400'
                        }`}
                        title={vol.status}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 font-display">{vol.name}</h3>
                        <span className="text-xs text-slate-500 font-mono-dose">({vol.age} yrs)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono-dose">
                        <span className="text-[#0284c7] font-semibold">
                          {vol.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span>{vol.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono-dose font-semibold ${
                      isOnline
                        ? 'bg-sky-50 text-[#0284c7] border border-sky-200'
                        : isOnVisit
                        ? 'bg-pink-50 text-[#db2777] border border-pink-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isOnline ? 'Available now' : isOnVisit ? 'On care visit' : 'Off-duty'}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                  {vol.bio}
                </p>

                {/* Verified Skills */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 font-sans uppercase tracking-wider">
                    Verified competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {vol.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono-dose bg-slate-50 text-slate-800 border border-slate-200/80 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
                  <span>Languages:</span>
                  {vol.languages.map((l) => (
                    <span key={l} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer stats & Direct Connect Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-500 font-mono-dose">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-900">{vol.rating}</span>
                  </span>
                  <span>•</span>
                  <span>{vol.completedVisits} visits logged</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContactVolunteer(vol, 'telegram')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 rounded-xl text-xs font-mono-dose font-semibold active:translate-y-0.5 transition-all shadow-2xs"
                    title={`Message ${vol.name} via Telegram`}
                  >
                    <Send className="w-3 h-3 text-[#0284c7]" />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => onContactVolunteer(vol, 'whatsapp')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono-dose font-semibold active:translate-y-0.5 transition-all shadow-2xs"
                    title={`Message ${vol.name} via WhatsApp`}
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredVolunteers.length === 0 && (
          <div className="col-span-2 p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-sm font-semibold text-slate-900 font-display">No volunteers match this query</p>
            <p className="text-xs text-slate-500 font-sans mt-1">Try filtering by skill, neighborhood, or language</p>
          </div>
        )}
      </div>
    </div>
  );
};
