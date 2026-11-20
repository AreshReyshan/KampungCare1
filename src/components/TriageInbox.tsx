import React, { useState, useEffect } from 'react';
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
  UserCheck, 
  MessageSquare,
  AlertTriangle,
  Check,
  Zap
} from 'lucide-react';
import type { TriageItem, Volunteer, Resident } from '../types';
import { AiReasonChip } from './AiReasonChip';
import { decide } from '../sim/autonomy';

interface TriageInboxProps {
  items: TriageItem[];
  volunteers: Volunteer[];
  residents: Resident[];
  onAssignVolunteer: (triageItem: TriageItem, volunteer: Volunteer) => void;
  onOpenResolveEmergency: (triageItem: TriageItem) => void;
  onOpenQuickCheckIn: (triageItem: TriageItem) => void;
  onOpenResidentPassport: (residentId: string) => void;
  onChangeHelper: (triageItem: TriageItem) => void;
  onDismissItem?: (triageItemId: string) => void;
}

type FilterType = 'all' | 'emergency' | 'telegram_request' | 'whatsapp_request' | 'overdue_checkin';

export const TriageInbox: React.FC<TriageInboxProps> = ({
  items,
  volunteers,
  residents,
  onAssignVolunteer,
  onOpenResolveEmergency,
  onOpenQuickCheckIn,
  onOpenResidentPassport,
  onChangeHelper,
  onDismissItem,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  // Live ticking wait counter for emergency banner (seconds elapsed)
  const [liveSeconds, setLiveSeconds] = useState(142); // Seeded default 2m 22s

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatWaitTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const emergencyItems = filteredItems.filter((i) => i.type === 'emergency');
  const otherItems = filteredItems.filter((i) => i.type !== 'emergency');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
            filter === 'all'
              ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          All action items ({items.length})
        </button>

        <button
          onClick={() => setFilter('emergency')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
            filter === 'emergency'
              ? 'bg-[#ec4899] text-white font-semibold shadow-xs'
              : emergencyCount > 0
              ? 'bg-pink-50 text-[#db2777] border border-pink-200 font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <span>Emergencies</span>
          <span className="font-mono-dose">({emergencyCount})</span>
        </button>

        <button
          onClick={() => setFilter('telegram_request')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
            filter === 'telegram_request'
              ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-sky-200'
          }`}
        >
          <Send className="w-3 h-3 text-[#0284c7]" />
          <span>Telegram</span>
          <span className="font-mono-dose">({telegramCount})</span>
        </button>

        <button
          onClick={() => setFilter('whatsapp_request')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
            filter === 'whatsapp_request'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-200'
          }`}
        >
          <MessageSquare className="w-3 h-3 text-emerald-600" />
          <span>WhatsApp</span>
          <span className="font-mono-dose">({whatsAppCount})</span>
        </button>

        <button
          onClick={() => setFilter('overdue_checkin')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
            filter === 'overdue_checkin'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-amber-200'
          }`}
        >
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Overdue check-ins</span>
          <span className="font-mono-dose">({overdueCount})</span>
        </button>
      </div>

      {/* 1. Emergency Banner (Bubblegum Pink Emergency Tray with Live Wait Clock) */}
      {emergencyItems.map((item) => {
        const resident = residents.find((r) => r.id === item.residentId);

        return (
          <section
            key={item.id}
            aria-label="High priority emergency alert"
            className="dose-tray-emergency p-6 border-2 border-pink-400 bg-pink-50/90 shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <img
                  src={item.residentAvatar}
                  alt={item.residentName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-pink-300 shrink-0 shadow-xs"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onOpenResidentPassport(item.residentId)}
                      className="text-lg font-bold text-slate-900 hover:text-[#0284c7] transition-colors flex items-center gap-1.5 font-display"
                    >
                      <span>{item.residentName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                    </button>
                    <span className="text-xs text-pink-700 font-mono-dose font-semibold">{item.residentAge} yrs</span>
                    
                    {/* Live Ticking Wait Clock */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-xs bg-pink-100 text-[#db2777] border border-pink-300 animate-pulse font-bold">
                      <Clock className="w-3 h-3 text-[#ec4899]" />
                      <span>Wait: {formatWaitTime(liveSeconds)}</span>
                    </span>

                    {/* AI Autonomy Reason Chip */}
                    <AiReasonChip
                      item={item}
                      volunteers={volunteers}
                      resident={resident}
                    />
                  </div>

                  <p className="text-base font-semibold text-slate-900 leading-snug font-sans">
                    "{item.emergencySummary}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-pink-800 pt-0.5 font-sans">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white text-pink-700 border border-pink-200 font-mono-dose shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {item.emergencyActionTag || 'Drafted 999 response script & alerted daughter (Zainab)'}
                    </span>
                    <span className="text-[11px] font-mono text-pink-700 font-medium">
                      • Strict Policy: AI blocked from auto-dialing 999
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => onOpenResolveEmergency(item)}
                  className="dose-btn-emergency w-full md:w-auto h-12 px-6 shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Confirm 999 &amp; Log Call</span>
                </button>
              </div>
            </div>
          </section>
        );
      })}

      {/* Main Action Feed: Compartment Trays */}
      <div className="space-y-4">
        {otherItems.map((item) => {
          const resident = residents.find((r) => r.id === item.residentId);
          const decision = decide(item, resident);

          if (item.type === 'telegram_request' || item.type === 'whatsapp_request') {
            const isWhatsApp = item.type === 'whatsapp_request';
            const matchedVol =
              volunteers.find((v) => v.id === item.matchedVolunteerId) ||
              volunteers[0];

            const isExpanded = expandedQuotes[item.id];
            const originalMsg = item.originalWhatsAppMessage || item.originalTelegramMessage;
            const isProposed = decision.tier === 'propose';

            return (
              <article
                key={item.id}
                className={`dose-tray p-5 transition-all duration-150 hover:border-sky-300 hover:shadow-md bg-white ${
                  isProposed ? 'border-amber-300 bg-amber-50/30' : ''
                }`}
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
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenResidentPassport(item.residentId)}
                            className="text-base font-bold text-slate-900 hover:text-[#0284c7] transition-colors font-display"
                          >
                            {item.residentName}
                          </button>
                          <span className="text-xs text-slate-500 font-mono-dose">{item.residentAge} yrs</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-dose">
                          <span className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-3 h-3 text-[#0284c7]" />
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
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono-dose font-semibold">
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            WhatsApp intake
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-[#0284c7] border border-sky-200 font-mono-dose font-semibold">
                            <Send className="w-3 h-3 text-[#0284c7]" />
                            Telegram intake
                          </span>
                        )}

                        {item.requiredCareTag && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono-dose text-[11px]">
                            {item.requiredCareTag}
                          </span>
                        )}

                        {/* AI Reason Chip */}
                        <AiReasonChip
                          item={item}
                          volunteers={volunteers}
                          resident={resident}
                        />
                      </div>

                      <p className="text-sm font-semibold text-slate-900 leading-snug font-sans">
                        {item.aiSummary || 'Community care assistance requested'}
                      </p>

                      {/* Original verbatim quote (collapsible) */}
                      {originalMsg && (
                        <div className="pt-0.5">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                          >
                            <span>{isExpanded ? 'Hide verbatim text' : 'Inspect verbatim text'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic font-sans leading-relaxed">
                              "{originalMsg}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Matched Helper Compartment or Proposed Approval Card */}
                  <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-5 space-y-3">
                    {isProposed ? (
                      /* Proposed Approval Card */
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold font-mono text-amber-800 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            PROPOSED APPROVAL
                          </span>
                          <span className="font-mono text-[10px] text-amber-800 font-semibold">
                            Urgency 3 • {(decision.confidence * 100).toFixed(0)}% conf
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={matchedVol.avatar}
                            alt={matchedVol.name}
                            className="w-10 h-10 rounded-lg object-cover border border-amber-200 shadow-2xs"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate font-display">
                              Recommended: {matchedVol.name}
                            </div>
                            <div className="text-[11px] text-amber-700 truncate font-mono">
                              {matchedVol.distanceKm} km away • {matchedVol.verifiedSkills[0]}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onAssignVolunteer(item, matchedVol)}
                            className="dose-btn-primary h-9 flex-1 text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Dispatch</span>
                          </button>

                          <button
                            onClick={() => onChangeHelper(item)}
                            className="dose-btn-secondary h-9 px-3 text-xs font-mono"
                            title="Choose another candidate"
                          >
                            Alternate
                          </button>

                          {onDismissItem && (
                            <button
                              onClick={() => onDismissItem(item.id)}
                              className="h-9 px-2 text-[10px] font-mono text-slate-400 hover:text-pink-600 transition-colors"
                              title="Reject proposal"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Low-Risk Routine Action / Auto-Dispatch */
                      <>
                        {decision.tier === 'auto' ? (
                          <div className="flex items-center justify-between text-xs pb-0.5">
                            <span className="font-bold font-mono text-[#0284c7] flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-[#0284c7] fill-[#0284c7]" />
                              ⚡ LOW-RISK • AI AUTO-DISPATCH
                            </span>
                            <span className="font-mono text-[10px] text-[#0284c7] bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200 font-bold">
                              {(decision.confidence * 100).toFixed(0)}% conf
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-500 font-sans">Matched volunteer</span>
                            <button
                              onClick={() => onChangeHelper(item)}
                              className="text-xs text-[#0284c7] hover:underline font-mono-dose font-semibold"
                            >
                              Change helper
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <img
                            src={matchedVol.avatar}
                            alt={matchedVol.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 truncate font-display">
                              {matchedVol.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate font-mono-dose">
                              <span className="text-[#0284c7] font-semibold">{matchedVol.distanceKm} km away</span>
                              {' • '}
                              <span>{matchedVol.verifiedSkills[0] || 'Verified'}</span>
                            </div>
                          </div>
                          {decision.tier === 'auto' && (
                            <button
                              onClick={() => onChangeHelper(item)}
                              className="text-[10px] text-slate-400 hover:text-[#0284c7] underline font-mono-dose shrink-0"
                              title="Override matched helper"
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        {decision.tier === 'auto' ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => onAssignVolunteer(item, matchedVol)}
                              className="w-full h-10 px-4 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-sky-500/25 hover:from-[#0284c7] hover:to-[#0369a1] transition-all border border-sky-400/40"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                              <span>⚡ Auto-Dispatch {matchedVol.name.split(' ')[0]}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <p className="text-[10px] text-center text-slate-400 font-mono">
                              Low-risk policy: Auto-sends in demo simulation (or click to trigger)
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAssignVolunteer(item, matchedVol)}
                            className="dose-btn-primary w-full"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Dispatch {matchedVol.name.split(' ')[0]}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          }

          if (item.type === 'overdue_checkin') {
            const isProposed = decision.tier === 'propose';

            return (
              <article
                key={item.id}
                className={`dose-tray p-5 transition-all duration-150 hover:border-sky-300 hover:shadow-md bg-white ${
                  isProposed ? 'border-amber-300' : ''
                }`}
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
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onOpenResidentPassport(item.residentId)}
                          className="text-base font-bold text-slate-900 hover:text-[#0284c7] transition-colors font-display"
                        >
                          {item.residentName}
                        </button>
                        <span className="text-xs text-slate-500 font-mono-dose">{item.residentAge} yrs</span>
                        
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-dose bg-pink-50 text-[#db2777] border border-pink-200 font-semibold">
                          <Clock className="w-3 h-3 text-[#ec4899]" />
                          {item.overdueDuration}
                        </span>

                        {/* AI Reason Chip */}
                        <AiReasonChip
                          item={item}
                          volunteers={volunteers}
                          resident={resident}
                        />
                      </div>

                      <p className="text-xs text-slate-600 font-sans">
                        {item.lastNotes || 'Check-in overdue. Routine vitals and well-being check.'}
                      </p>

                      {item.nokContact && (
                        <div className="text-xs text-slate-500 font-mono-dose">
                          Next of kin: <span className="text-slate-800 font-medium">{item.nokContact.name} ({item.nokContact.phone})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onOpenQuickCheckIn(item)}
                      className="dose-btn-secondary w-full md:w-auto"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#0284c7]" />
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
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0284c7] mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              All items addressed in this filter
            </h3>
            <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
              No tasks currently pending review. Test incoming requests using the Telegram or WhatsApp simulation buttons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
