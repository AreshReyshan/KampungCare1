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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-150 ease-out"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col z-10 transition-transform duration-200 ease-out">
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
            <span className="text-xs font-mono-dose text-slate-500 font-semibold">
              Resident care passport · {resident.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-7 py-7 space-y-6">
          {/* Senior Profile Summary */}
          <div className="flex items-start gap-5">
            <img
              src={resident.avatar}
              alt={resident.name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight font-display">
                {resident.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-dose">
                <span>{resident.age} yrs</span>
                <span>•</span>
                <span>{resident.gender === 'male' ? 'Male' : 'Female'}</span>
                <span>•</span>
                <span>{resident.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5 font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span className="truncate">{resident.address}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resident.languages.map((l) => (
                  <span
                    key={l}
                    className="px-2 py-0.5 rounded text-[11px] font-sans bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next of Kin Contact Stub */}
          <div className="dose-tray p-4 space-y-3 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 font-sans">
              <PhoneCall className="w-4 h-4 text-[#0284c7]" />
              <span>Next-of-kin &amp; family emergency contact</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900 font-display">
                  {resident.emergencyContact.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono-dose">
                  {resident.emergencyContact.relationship} • {resident.emergencyContact.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerCallNOK(resident, 'telegram')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 rounded-xl text-xs font-mono-dose font-semibold active:translate-y-0.5 transition-all shadow-2xs"
                  title="Alert via Telegram"
                >
                  <Send className="w-3 h-3 text-[#0284c7]" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'whatsapp')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-mono-dose font-semibold active:translate-y-0.5 transition-all shadow-2xs"
                  title="Alert via WhatsApp"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'phone')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-mono-dose border border-slate-200 active:translate-y-0.5 transition-all shadow-2xs font-semibold"
                  title="Phone Call"
                >
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobility & Health Profile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 font-sans uppercase tracking-wider">
                Health requirements &amp; mobility profile
              </h3>
              <span className="px-2.5 py-0.5 bg-sky-50 text-[#0284c7] border border-sky-200 rounded-full text-xs font-mono-dose font-semibold">
                {resident.mobilityBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {resident.careNeeds.map((need, idx) => {
                let icon = <Activity className="w-4 h-4 text-[#0284c7]" />;
                if (need.type === 'medication') {
                  icon = <Pill className="w-4 h-4 text-emerald-600" />;
                } else if (need.type === 'diet') {
                  icon = <Heart className="w-4 h-4 text-amber-500" />;
                }

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 shadow-2xs"
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 shadow-2xs">{icon}</div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-display">{need.title}</div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-sans">
                        {need.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Care Record */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 font-sans uppercase tracking-wider">
              Chronological care timeline
            </h3>

            <div className="space-y-3">
              {resident.timeline.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1 font-sans shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-900 font-display">{event.title}</span>
                      <span className="font-mono-dose">{event.date} • {event.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                    {event.volunteerName && (
                      <div className="text-xs text-[#0284c7] font-mono-dose pt-0.5 font-semibold">
                        Volunteer: {event.volunteerName}
                        {event.outcome && ` • ${event.outcome}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono-dose">
            Setapak Township Care Network
          </span>
          <button
            onClick={onClose}
            className="dose-btn-secondary"
          >
            Close passport
          </button>
        </div>
      </div>
    </div>
  );
};
