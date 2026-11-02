import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  ArrowRight, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  MapPin, 
  ExternalLink,
  ShieldAlert,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import type { TriageItem, Volunteer, Resident } from '../types';

interface TriageInboxProps {
  items: TriageItem[];
  volunteers: Volunteer[];
  residents: Resident[];
  onAssignVolunteer: (triageItem: TriageItem, volunteer: Volunteer) => void;
  onOpenResolveEmergency: (triageItem: TriageItem) => void;
  onOpenQuickCheckIn: (triageItem: TriageItem) => void;
  onOpenResidentPassport: (residentId: string) => void;
  onChangeHelper: (triageItem: TriageItem) => void;
}

type FilterType = 'all' | 'emergency' | 'telegram_request' | 'whatsapp_request' | 'overdue_checkin';

export const TriageInbox: React.FC<TriageInboxProps> = ({
  items,
  volunteers,
  onAssignVolunteer,
  onOpenResolveEmergency,
  onOpenQuickCheckIn,
  onOpenResidentPassport,
  onChangeHelper,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const emergencyCount = items.filter((i) => i.type === 'emergency').length;
  const telegramCount = items.filter((i) => i.type === 'telegram_request').length;
  const whatsAppCount = items.filter((i) => i.type === 'whatsapp_request').length;
  const overdueCount = items.filter((i) => i.type === 'overdue_checkin').length;

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const emergencyItems = filteredItems.filter((i) => i.type === 'emergency');
  const otherItems = filteredItems.filter((i) => i.type !== 'emergency');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
            filter === 'all'
              ? 'bg-[#10b981] text-[#042f2e] font-semibold'
              : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
          }`}
        >
          All action items ({items.length})
        </button>

        <button
          onClick={() => setFilter('emergency')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
            filter === 'emergency'
              ? 'bg-[#f43f5e] text-white font-semibold'
              : emergencyCount > 0
              ? 'bg-[#2b1016] text-[#fda4af] border border-[#881337]'
              : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
          }`}
        >
          <span>Emergencies</span>
          <span className="font-mono-dose">({emergencyCount})</span>
        </button>

        <button
          onClick={() => setFilter('telegram_request')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
            filter === 'telegram_request'
              ? 'bg-[#0284c7] text-white font-semibold'
              : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
          }`}
        >
          <Send className="w-3 h-3 text-[#38bdf8]" />
          <span>Telegram</span>
          <span className="font-mono-dose">({telegramCount})</span>
        </button>

        <button
          onClick={() => setFilter('whatsapp_request')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
            filter === 'whatsapp_request'
              ? 'bg-[#059669] text-white font-semibold'
              : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
          }`}
        >
          <MessageSquare className="w-3 h-3 text-[#4ade80]" />
          <span>WhatsApp</span>
          <span className="font-mono-dose">({whatsAppCount})</span>
        </button>

        <button
          onClick={() => setFilter('overdue_checkin')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
            filter === 'overdue_checkin'
              ? 'bg-[#d97706] text-white font-semibold'
              : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
          }`}
        >
          <Clock className="w-3 h-3 text-[#fbbf24]" />
          <span>Overdue check-ins</span>
          <span className="font-mono-dose">({overdueCount})</span>
        </button>
      </div>

      {/* 1. Emergency Banner (Hallmark Dose Clinical Emergency Tray) */}
      {emergencyItems.map((item) => (
        <section
          key={item.id}
          aria-label="High priority emergency alert"
          className="dose-tray-emergency p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <img
                src={item.residentAvatar}
                alt={item.residentName}
                className="w-14 h-14 rounded-xl object-cover border border-[#f43f5e]/40 shrink-0"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenResidentPassport(item.residentId)}
                    className="text-lg font-bold text-white hover:text-[#a7f3d0] transition-colors flex items-center gap-1.5 font-display"
                  >
                    <span>{item.residentName}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#fda4af]" />
                  </button>
                  <span className="text-xs text-[#fda4af] font-mono-dose">{item.residentAge} yrs</span>
                  <span className="text-xs text-[#fda4af] font-mono-dose">• {item.timeAgo}</span>
                </div>

                <p className="text-base font-semibold text-[#ffe4e6] leading-snug font-sans">
                  "{item.emergencySummary}"
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#fda4af] pt-0.5 font-sans">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#3b1219] text-[#fecdd3] border border-[#881337] font-mono-dose">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                    {item.emergencyActionTag || 'Auto-replied 999 instructions & alerted daughter (Zainab)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                onClick={() => onOpenResolveEmergency(item)}
                className="dose-btn-emergency w-full md:w-auto"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Resolve &amp; log call</span>
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* Main Action Feed: Compartment Trays */}
      <div className="space-y-4">
        {otherItems.map((item) => {
          if (item.type === 'telegram_request' || item.type === 'whatsapp_request') {
            const isWhatsApp = item.type === 'whatsapp_request';
            const matchedVol =
              volunteers.find((v) => v.id === item.matchedVolunteerId) ||
              volunteers[0];

            const isExpanded = expandedQuotes[item.id];
            const originalMsg = item.originalWhatsAppMessage || item.originalTelegramMessage;

            return (
              <article
                key={item.id}
                className="dose-tray p-5 transition-transform duration-100 ease-out hover:border-[#334c48]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left Side: Senior & Request Details */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => onOpenResidentPassport(item.residentId)}
                        className="relative shrink-0 group"
                      >
                        <img
                          src={item.residentAvatar}
                          alt={item.residentName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#2b3f3c]"
                        />
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenResidentPassport(item.residentId)}
                            className="text-base font-bold text-[#f0f5f4] hover:text-[#10b981] transition-colors font-display"
                          >
                            {item.residentName}
                          </button>
                          <span className="text-xs text-[#809692] font-mono-dose">{item.residentAge} yrs</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#809692] font-mono-dose">
                          <span className="flex items-center gap-1 text-[#9eb1ad]">
                            <MapPin className="w-3 h-3 text-[#738a86]" />
                            {item.residentNeighborhood}
                          </span>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Channel line & AI synthesis */}
                    <div className="space-y-1.5 pl-0.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {isWhatsApp ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#12241f] text-[#4ade80] border border-[#1d4137] font-mono-dose">
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp intake
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#122227] text-[#38bdf8] border border-[#1e3c45] font-mono-dose">
                            <Send className="w-3 h-3" />
                            Telegram intake
                          </span>
                        )}

                        {item.requiredCareTag && (
                          <span className="px-2 py-0.5 rounded bg-[#182625] text-[#c6d6d2] border border-[#273d39] font-mono-dose text-[11px]">
                            {item.requiredCareTag}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-[#f0f5f4] leading-snug font-sans">
                        {item.aiSummary || 'Community care assistance requested'}
                      </p>

                      {/* Original verbatim quote (collapsible) */}
                      {originalMsg && (
                        <div className="pt-0.5">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="inline-flex items-center gap-1 text-xs text-[#809692] hover:text-[#c6d6d2] transition-colors"
                          >
                            <span>{isExpanded ? 'Hide verbatim text' : 'Inspect verbatim text'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-3 bg-[#0c1313] rounded-lg border border-[#20312f] text-xs text-[#9eb1ad] italic font-sans leading-relaxed">
                              "{originalMsg}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Matched Helper Compartment (Divided by subtle vertical border) */}
                  <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#20312f] pt-4 lg:pt-0 lg:pl-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#809692] font-sans">Matched volunteer</span>
                      <button
                        onClick={() => onChangeHelper(item)}
                        className="text-xs text-[#10b981] hover:underline font-mono-dose"
                      >
                        Change helper
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={matchedVol.avatar}
                        alt={matchedVol.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#2b3f3c]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[#f0f5f4] truncate font-display">
                          {matchedVol.name}
                        </div>
                        <div className="text-xs text-[#809692] truncate font-mono-dose">
                          <span className="text-[#a7f3d0]">{matchedVol.distanceKm} km away</span>
                          {' • '}
                          <span>{matchedVol.verifiedSkills[0] || 'Verified'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onAssignVolunteer(item, matchedVol)}
                      className="dose-btn-primary w-full"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Dispatch {matchedVol.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          if (item.type === 'overdue_checkin') {
            return (
              <article
                key={item.id}
                className="dose-tray p-5 transition-transform duration-100 ease-out hover:border-[#334c48]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => onOpenResidentPassport(item.residentId)}
                      className="shrink-0"
                    >
                      <img
                        src={item.residentAvatar}
                        alt={item.residentName}
                        className="w-12 h-12 rounded-xl object-cover border border-[#2b3f3c]"
                      />
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenResidentPassport(item.residentId)}
                          className="text-base font-bold text-[#f0f5f4] hover:text-[#10b981] transition-colors font-display"
                        >
                          {item.residentName}
                        </button>
                        <span className="text-xs text-[#809692] font-mono-dose">{item.residentAge} yrs</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono-dose bg-[#2c1d11] text-[#fcd34d] border border-[#78350f]">
                          <Clock className="w-3 h-3 text-[#f59e0b]" />
                          {item.overdueDuration}
                        </span>
                      </div>

                      <p className="text-xs text-[#9eb1ad] font-sans">
                        {item.lastNotes || 'Check-in overdue. Routine vitals and well-being check.'}
                      </p>

                      {item.nokContact && (
                        <div className="text-xs text-[#738a86] font-mono-dose">
                          Next of kin: <span className="text-[#c6d6d2]">{item.nokContact.name} ({item.nokContact.phone})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => onOpenQuickCheckIn(item)}
                      className="dose-btn-secondary w-full md:w-auto"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#10b981]" />
                      <span>Log quick check-in</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          }

          return null;
        })}

        {filteredItems.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[#20312f] rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto" />
            <h3 className="text-base font-bold text-[#f0f5f4] font-display">
              All items addressed in this filter
            </h3>
            <p className="text-xs text-[#809692] font-sans max-w-sm mx-auto">
              No tasks currently pending review. Test incoming requests using the Telegram or WhatsApp simulation buttons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
