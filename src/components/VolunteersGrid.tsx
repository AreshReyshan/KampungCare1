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
      <div className="flex items-center justify-between text-xs text-[#809692] font-mono-dose">
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
              className="dose-tray p-6 flex flex-col justify-between space-y-4 hover:border-[#38534f] transition-transform duration-100 ease-out"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name & Proximity */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={vol.avatar}
                        alt={vol.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#2b3f3c]"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#121c1c] ${
                          isOnline
                            ? 'bg-[#10b981]'
                            : isOnVisit
                            ? 'bg-[#f59e0b]'
                            : 'bg-[#556b67]'
                        }`}
                        title={vol.status}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#f0f5f4] font-display">{vol.name}</h3>
                        <span className="text-xs text-[#809692] font-mono-dose">({vol.age} yrs)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#809692] mt-0.5 font-mono-dose">
                        <span className="text-[#a7f3d0] font-semibold">
                          {vol.distanceKm} km away
                        </span>
                        <span>•</span>
                        <span>{vol.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono-dose ${
                      isOnline
                        ? 'bg-[#142e27] text-[#6ee7b7] border border-[#205244]'
                        : isOnVisit
                        ? 'bg-[#2b1d11] text-[#fcd34d] border border-[#78350f]'
                        : 'bg-[#182625] text-[#809692] border border-[#233533]'
                    }`}
                  >
                    {isOnline ? 'Available now' : isOnVisit ? 'On care visit' : 'Off-duty'}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#9eb1ad] font-sans line-clamp-2 leading-relaxed">
                  {vol.bio}
                </p>

                {/* Verified Skills */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-[#738a86] font-sans">
                    Verified competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {vol.verifiedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-dose bg-[#0c1313] text-[#c6d6d2] border border-[#20312f]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-1.5 text-xs text-[#738a86] font-sans">
                  <span>Languages:</span>
                  {vol.languages.map((l) => (
                    <span key={l} className="bg-[#0c1313] text-[#809692] border border-[#1e2d2b] px-2 py-0.5 rounded text-[11px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer stats & Direct Connect Buttons */}
              <div className="pt-3 border-t border-[#20312f] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[#809692] font-mono-dose">
                  <span className="flex items-center gap-1 text-[#fcd34d]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-[#f0f5f4]">{vol.rating}</span>
                  </span>
                  <span>•</span>
                  <span>{vol.completedVisits} visits logged</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onContactVolunteer(vol, 'telegram')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#122227] hover:bg-[#182c33] text-[#38bdf8] border border-[#1e3c45] rounded-lg text-xs font-mono-dose active:translate-y-0.5 transition-transform duration-100 ease-out"
                    title={`Message ${vol.name} via Telegram`}
                  >
                    <Send className="w-3 h-3 text-[#38bdf8]" />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => onContactVolunteer(vol, 'whatsapp')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#12241f] hover:bg-[#172e27] text-[#4ade80] border border-[#1d4137] rounded-lg text-xs font-mono-dose active:translate-y-0.5 transition-transform duration-100 ease-out"
                    title={`Message ${vol.name} via WhatsApp`}
                  >
                    <MessageSquare className="w-3 h-3 text-[#4ade80]" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredVolunteers.length === 0 && (
          <div className="col-span-2 p-12 text-center border border-dashed border-[#20312f] rounded-xl">
            <p className="text-sm font-semibold text-[#f0f5f4] font-display">No volunteers match this query</p>
            <p className="text-xs text-[#809692] font-sans mt-1">Try filtering by skill, neighborhood, or language</p>
          </div>
        )}
      </div>
    </div>
  );
};
