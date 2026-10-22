import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  ArrowRight, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
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
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* Filter Pill Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-slate-100 text-slate-900 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Action Items ({items.length})
        </button>

        <button
          onClick={() => setFilter('emergency')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            filter === 'emergency'
              ? 'bg-rose-600 text-white shadow-sm'
              : emergencyCount > 0
              ? 'bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900/60'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          {emergencyCount > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          )}
          Emergencies ({emergencyCount})
        </button>

        <button
          onClick={() => setFilter('telegram_request')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            filter === 'telegram_request'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5 text-sky-400" />
          Telegram ({telegramCount})
        </button>

        <button
          onClick={() => setFilter('whatsapp_request')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            filter === 'whatsapp_request'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          WhatsApp ({whatsAppCount})
        </button>

        <button
          onClick={() => setFilter('overdue_checkin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            filter === 'overdue_checkin'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Overdue Check-Ins ({overdueCount})
        </button>
      </div>

      {/* 1. Emergency Alert Banners (Top Priority) */}
      {emergencyItems.map((item) => (
        <div
          key={item.id}
          className="relative overflow-hidden bg-rose-950/40 border-2 border-rose-500/60 rounded-3xl p-7 shadow-xl shadow-rose-950/30 transition-all hover:border-rose-400 animate-fade-in"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={item.residentAvatar}
                  alt={item.residentName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500 shadow-md"
                />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onOpenResidentPassport(item.residentId)}
                    className="text-xl font-bold text-white hover:text-sky-300 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <span>{item.residentName}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="text-sm text-slate-400">• {item.residentAge}yo</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Urgent Emergency
                  </span>
                </div>

                <p className="text-lg font-bold text-rose-100 leading-snug">
                  "{item.emergencySummary}"
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-rose-300">
                  <span className="inline-flex items-center gap-2 bg-rose-950/90 px-3.5 py-1.5 rounded-full border border-rose-800 font-medium text-rose-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {item.emergencyActionTag || 'Auto-replied 999 instructions & alerted daughter (Zainab)'}
                  </span>
                  <span className="text-slate-400">• {item.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Right: Prominent Single Action Button */}
            <div className="shrink-0 flex items-center">
              <button
                onClick={() => onOpenResolveEmergency(item)}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/35 active:scale-[0.98] transition-all"
              >
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <span>Resolve &amp; Log Call</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Main List: Telegram Requests, WhatsApp Requests & Overdue Check-ins */}
      <div className="space-y-5">
        {otherItems.map((item) => {
          if (item.type === 'telegram_request' || item.type === 'whatsapp_request') {
            const isWhatsApp = item.type === 'whatsapp_request';
            const matchedVol =
              volunteers.find((v) => v.id === item.matchedVolunteerId) ||
              volunteers[0];

            const isExpanded = expandedQuotes[item.id];
            const originalMsg = item.originalWhatsAppMessage || item.originalTelegramMessage;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-md hover:border-slate-700 transition-all animate-fade-in"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                  {/* Left Side: Resident Info & AI Summary (Cols 1-7) */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onOpenResidentPassport(item.residentId)}
                        className="relative group shrink-0"
                      >
                        <img
                          src={item.residentAvatar}
                          alt={item.residentName}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-sky-500 transition-all shadow-sm"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-900 shadow-sm ${
                            isWhatsApp ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                        >
                          {isWhatsApp ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                          ) : (
                            <Send className="w-3.5 h-3.5 -rotate-12 translate-x-0.5" />
                          )}
                        </div>
                      </button>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onOpenResidentPassport(item.residentId)}
                            className="text-lg font-bold text-white hover:text-sky-400 transition-colors flex items-center gap-1.5"
                          >
                            <span>{item.residentName}</span>
                          </button>
                          <span className="text-sm text-slate-400">• {item.residentAge}yo</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {item.residentNeighborhood}
                          </span>
                          <span>•</span>
                          <span className="text-slate-500">{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Structured Summary */}
                    <div className="space-y-2 pl-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isWhatsApp ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            WhatsApp Careline
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-sky-950/80 text-sky-300 border border-sky-800/80">
                            <Send className="w-3.5 h-3.5 text-sky-400" />
                            @Telegram Bot
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                          AI Summary
                        </span>

                        {item.requiredCareTag && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/70 text-slate-300 border border-slate-700/60">
                            {item.requiredCareTag}
                          </span>
                        )}
                      </div>

                      <p className="text-base font-semibold text-slate-100 leading-snug">
                        {item.aiSummary || 'Assistance requested'}
                      </p>

                      {/* Collapsible original message */}
                      {originalMsg && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
                          >
                            <span>
                              {isExpanded ? 'Hide original message' : 'View original message'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                              "{originalMsg}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: The "Magic Match" Box (Cols 8-12) */}
                  <div className="lg:col-span-5">
                    {matchedVol ? (
                      <div
                        className={`rounded-2xl p-5 space-y-3.5 border ${
                          isWhatsApp
                            ? 'bg-emerald-950/25 border-emerald-800/50'
                            : 'bg-sky-950/30 border-sky-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 ${
                              isWhatsApp ? 'text-emerald-300' : 'text-sky-300'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            #1 Matched Volunteer
                          </span>
                          <button
                            onClick={() => onChangeHelper(item)}
                            className={`text-xs font-semibold hover:underline transition-colors ${
                              isWhatsApp
                                ? 'text-emerald-400 hover:text-emerald-300'
                                : 'text-sky-400 hover:text-sky-300'
                            }`}
                          >
                            Change helper
                          </button>
                        </div>

                        {/* Volunteer info */}
                        <div className="flex items-center gap-3.5">
                          <img
                            src={matchedVol.avatar}
                            alt={matchedVol.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-bold text-white truncate">
                              {matchedVol.name}
                            </div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">
                              <span
                                className={`font-semibold ${
                                  isWhatsApp ? 'text-emerald-400' : 'text-sky-400'
                                }`}
                              >
                                {matchedVol.distanceKm} km away
                              </span>
                              {' • '}
                              <span>{matchedVol.verifiedSkills[0] || 'Verified'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Single 1-Click Assign Button */}
                        <button
                          onClick={() => onAssignVolunteer(item, matchedVol)}
                          className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all ${
                            isWhatsApp
                              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                              : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Assign {matchedVol.name.split(' ')[0]}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 bg-slate-950/60 rounded-xl text-center">
                        <p className="text-xs text-slate-400">No helper matched yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === 'overdue_checkin') {
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-700 transition-all animate-fade-in"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Left: Resident & overdue context */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onOpenResidentPassport(item.residentId)}
                      className="shrink-0 group"
                    >
                      <img
                        src={item.residentAvatar}
                        alt={item.residentName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-sky-400 transition-all shadow-sm"
                      />
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => onOpenResidentPassport(item.residentId)}
                          className="text-lg font-bold text-white hover:text-sky-400 transition-colors"
                        >
                          {item.residentName}
                        </button>
                        <span className="text-sm text-slate-400">• {item.residentAge}yo</span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {item.overdueDuration}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400">
                        {item.lastNotes || 'Check-in overdue. Routine vitals and well-being check.'}
                      </p>

                      {item.nokContact && (
                        <div className="text-xs text-slate-500">
                          Next of Kin:{' '}
                          <span className="text-slate-300 font-medium">
                            {item.nokContact.name} ({item.nokContact.phone})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action */}
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => onOpenQuickCheckIn(item)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-sky-400" />
                      <span>Quick Check-In</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}

        {filteredItems.length === 0 && (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-14 text-center space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              All caught up in this view!
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              No items require attention in this category right now. You can test new incoming alerts using the Telegram or WhatsApp test buttons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
