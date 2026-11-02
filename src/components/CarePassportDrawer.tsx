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
        className="absolute inset-0 bg-[#0c1313]/80 backdrop-blur-sm transition-opacity duration-150 ease-out"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-[#0e1717] border-l border-[#20312f] text-[#f0f5f4] shadow-2xl flex flex-col z-10 transition-transform duration-200 ease-out">
        {/* Header */}
        <div className="px-7 py-5 border-b border-[#1c2c2a] flex items-center justify-between bg-[#121c1c]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
            <span className="text-xs font-mono-dose text-[#809692]">
              Resident care passport · {resident.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#182625] hover:bg-[#20312f] border border-[#2b3f3c] flex items-center justify-center text-[#9eb1ad] hover:text-white transition-colors"
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
              className="w-20 h-20 rounded-xl object-cover border border-[#2b3f3c] shadow-sm shrink-0"
            />
            <div className="space-y-1 flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-[#f0f5f4] leading-tight font-display">
                {resident.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#809692] font-mono-dose">
                <span>{resident.age} yrs</span>
                <span>•</span>
                <span>{resident.gender === 'male' ? 'Male' : 'Female'}</span>
                <span>•</span>
                <span>{resident.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#9eb1ad] pt-0.5 font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#738a86] shrink-0" />
                <span className="truncate">{resident.address}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resident.languages.map((l) => (
                  <span
                    key={l}
                    className="px-2 py-0.5 rounded text-[11px] font-sans bg-[#121c1c] text-[#809692] border border-[#20312f]"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Next of Kin Contact Stub */}
          <div className="dose-tray p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c6d6d2] font-sans">
              <PhoneCall className="w-4 h-4 text-[#10b981]" />
              <span>Next-of-kin &amp; family emergency contact</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0c1313] p-3.5 rounded-lg border border-[#20312f] gap-3">
              <div>
                <div className="text-sm font-bold text-[#f0f5f4] font-display">
                  {resident.emergencyContact.name}
                </div>
                <div className="text-xs text-[#809692] mt-0.5 font-mono-dose">
                  {resident.emergencyContact.relationship} • {resident.emergencyContact.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerCallNOK(resident, 'telegram')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#122227] hover:bg-[#182c33] text-[#38bdf8] border border-[#1e3c45] rounded-lg text-xs font-mono-dose active:translate-y-0.5 transition-transform duration-100 ease-out"
                  title="Alert via Telegram"
                >
                  <Send className="w-3 h-3 text-[#38bdf8]" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'whatsapp')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#12241f] hover:bg-[#172e27] text-[#4ade80] border border-[#1d4137] rounded-lg text-xs font-mono-dose active:translate-y-0.5 transition-transform duration-100 ease-out"
                  title="Alert via WhatsApp"
                >
                  <MessageSquare className="w-3 h-3 text-[#4ade80]" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => onTriggerCallNOK(resident, 'phone')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#182625] hover:bg-[#20312f] text-white rounded-lg text-xs font-mono-dose border border-[#2b3f3c] active:translate-y-0.5 transition-transform duration-100 ease-out"
                  title="Phone Call"
                >
                  <Phone className="w-3 h-3 text-[#c6d6d2]" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobility & Health Profile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-[#809692] font-sans">
                Health requirements &amp; mobility profile
              </h3>
              <span className="px-2.5 py-0.5 bg-[#182625] text-[#a7f3d0] border border-[#2b423f] rounded text-xs font-mono-dose">
                {resident.mobilityBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {resident.careNeeds.map((need, idx) => {
                let icon = <Activity className="w-4 h-4 text-[#38bdf8]" />;
                if (need.type === 'medication') {
                  icon = <Pill className="w-4 h-4 text-[#10b981]" />;
                } else if (need.type === 'diet') {
                  icon = <Heart className="w-4 h-4 text-[#f59e0b]" />;
                }

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-[#20312f] bg-[#121c1c] flex items-start gap-3"
                  >
                    <div className="p-2 rounded bg-[#0c1313] border border-[#20312f] shrink-0">{icon}</div>
                    <div>
                      <div className="text-xs font-bold text-[#f0f5f4] font-display">{need.title}</div>
                      <p className="text-xs text-[#809692] mt-0.5 leading-relaxed font-sans">
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
            <h3 className="text-xs font-medium text-[#809692] font-sans">
              Chronological care timeline
            </h3>

            <div className="space-y-3">
              {resident.timeline.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="bg-[#121c1c] rounded-lg p-3.5 border border-[#20312f] space-y-1 font-sans"
                  >
                    <div className="flex items-center justify-between text-xs text-[#809692]">
                      <span className="font-bold text-[#f0f5f4] font-display">{event.title}</span>
                      <span className="font-mono-dose">{event.date} • {event.time}</span>
                    </div>
                    <p className="text-xs text-[#9eb1ad] leading-relaxed">
                      {event.description}
                    </p>
                    {event.volunteerName && (
                      <div className="text-xs text-[#a7f3d0] font-mono-dose pt-0.5">
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
        <div className="p-5 border-t border-[#1c2c2a] bg-[#121c1c] flex items-center justify-between">
          <span className="text-xs text-[#738a86] font-mono-dose">
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
