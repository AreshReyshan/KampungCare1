import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Send, 
  Heart, 
  Activity, 
  Pill, 
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import type { Resident } from '../types';

interface CarePassportDrawerProps {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
  onTriggerCallNOK: (resident: Resident, channel: 'telegram' | 'whatsapp' | 'phone') => void;
}

export const CarePassportDrawer: React.FC<CarePassportDrawerProps> = ({
  resident,
  isOpen,
  onClose,
  onTriggerCallNOK,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !resident) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col z-10 animate-slide-in-right">
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resident Care Passport
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-7 py-7 space-y-7">
          {/* Senior Profile Summary */}
          <div className="flex items-start gap-5">
            <img
              src={resident.avatar}
              alt={resident.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-800 shadow-lg"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white leading-tight">
                {resident.name}
              </h2>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="font-bold text-slate-200">{resident.age} years old</span>
                <span>•</span>
                <span>{resident.gender === 'male' ? 'Male' : 'Female'}</span>
                <span>•</span>
                <span>{resident.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400 pt-0.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{resident.address}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {resident.languages.map((l) => (
                  <span
                    key={l}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wide">
                <PhoneCall className="w-4 h-4 text-sky-400" />
                <span>Next of Kin &amp; Primary Guardian</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 gap-3">
              <div>
                <div className="text-base font-bold text-white">
                  {resident.emergencyContact.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {resident.emergencyContact.relationship} • {resident.emergencyContact.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerCallNOK(resident, 'telegram')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/80 rounded-xl text-xs font-bold transition-all active:scale-95"
                  title="Alert via Telegram"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'whatsapp')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-all active:scale-95"
                  title="Alert via WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'phone')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
                  title="Phone Call"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-300" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobility & Care Needs */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mobility &amp; Health Profile
              </h3>
              <span className="px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800/80 rounded-full text-xs font-bold">
                {resident.mobilityBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {resident.careNeeds.map((need, idx) => {
                let badgeColor = 'bg-slate-950/70 border-slate-800 text-slate-200';
                let icon = <Activity className="w-5 h-5 text-sky-400" />;

                if (need.type === 'mobility') {
                  badgeColor = 'bg-blue-950/40 border-blue-800/60 text-blue-200';
                  icon = <Activity className="w-5 h-5 text-blue-400" />;
                } else if (need.type === 'medication') {
                  badgeColor = 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200';
                  icon = <Pill className="w-5 h-5 text-emerald-400" />;
                } else if (need.type === 'diet') {
                  badgeColor = 'bg-amber-950/40 border-amber-800/60 text-amber-200';
                  icon = <Heart className="w-5 h-5 text-amber-400" />;
                }

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start gap-3.5 ${badgeColor}`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xs shrink-0">{icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{need.title}</div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {need.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Care Timeline */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Care History &amp; Timeline
            </h3>

            <div className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {resident.timeline.map((event) => {
                return (
                  <div key={event.id} className="relative group">
                    <span className="absolute -left-7 top-1.5 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-slate-900" />
                    <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-slate-200 text-sm">{event.title}</span>
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {event.description}
                      </p>
                      {event.volunteerName && (
                        <div className="text-xs text-sky-400 font-semibold pt-1">
                          Helper: {event.volunteerName}
                          {event.outcome && ` • Outcome: ${event.outcome}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Enrolled in KampungCare Setapak Care Network
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
