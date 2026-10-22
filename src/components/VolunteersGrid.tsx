import React from 'react';
import { 
  Send, 
  Star, 
  ShieldCheck, 
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
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{filteredVolunteers.length} verified community volunteers active in Setapak</span>
        <span className="text-xs text-slate-500">All volunteers are identity &amp; background verified</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVolunteers.map((vol) => {
          const isOnline = vol.status === 'available';
          const isOnVisit = vol.status === 'on_visit';

          return (
            <div
              key={vol.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name & Proximity */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={vol.avatar}
                        alt={vol.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-800 shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-slate-900 ${
                          isOnline
                            ? 'bg-emerald-500'
                            : isOnVisit
                            ? 'bg-amber-500'
                            : 'bg-slate-500'
                        }`}
                        title={vol.status}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{vol.name}</h3>
                        <span className="text-sm text-slate-400">({vol.age}yo)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="font-bold text-sky-400 bg-sky-950/80 border border-sky-800/80 px-2.5 py-0.5 rounded-md">
                          {vol.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{vol.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isOnline
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : isOnVisit
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isOnline ? 'Available Now' : isOnVisit ? 'On Visit' : 'Offline'}
                  </span>
                </div>

                {/* Bio */}
                <p className="mt-4 text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {vol.bio}
                </p>

                {/* Verified Skills */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Verified Competencies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vol.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-950/70 text-slate-300 border border-slate-800"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Languages:</span>
                  {vol.languages.map((l) => (
                    <span key={l} className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md text-xs">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer stats & Direct Dispatch Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-white text-sm">{vol.rating}</span>
                  </span>
                  <span>•</span>
                  <span>{vol.completedVisits} visits</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContactVolunteer(vol, 'telegram')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/80 rounded-xl text-xs font-semibold transition-colors"
                    title={`Message ${vol.name} via Telegram`}
                  >
                    <Send className="w-3 h-3 text-sky-400" />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => onContactVolunteer(vol, 'whatsapp')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-semibold transition-colors"
                    title={`Message ${vol.name} via WhatsApp`}
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredVolunteers.length === 0 && (
          <div className="col-span-2 bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-14 text-center">
            <p className="text-base font-bold text-slate-300">No volunteers match your search</p>
            <p className="text-xs text-slate-500 mt-1">Try searching by skill name, language, or neighbourhood</p>
          </div>
        )}
      </div>
    </div>
  );
};
