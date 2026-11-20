import React from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';
import type { TabType } from './Sidebar';

interface HeaderProps {
  currentTab: TabType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTelegram: () => void;
  onOpenWhatsApp: () => void;
  emergencyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  onOpenTelegram,
  onOpenWhatsApp,
  emergencyCount,
}) => {
  const getTabInfo = () => {
    switch (currentTab) {
      case 'triage':
        return {
          title: 'Triage inbox',
          subtitle: 'Prioritised intake of Telegram & WhatsApp requests, medical dispatches, and check-ins',
        };
      case 'active':
        return {
          title: 'Active care register',
          subtitle: 'Live timetable of ongoing household visits and medication escorts across Setapak',
        };
      case 'residents':
        return {
          title: 'Resident care passports',
          subtitle: 'Senior health profiles, clinical mobility needs, and next-of-kin lines',
        };
      case 'volunteers':
        return {
          title: 'Community volunteers',
          subtitle: 'Verified neighborhood helpers, verified skills, and active proximity',
        };
      case 'sensors':
        return {
          title: 'Smart-Ring & IoT Telemetry',
          subtitle: 'Continuous biometrics, fall impact detection, and adaptive sensitivity calibration',
        };
    }
  };

  const info = getTabInfo();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-10 py-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              {info.title}
            </h2>
            {emergencyCount > 0 && currentTab === 'triage' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-dose bg-pink-100 text-[#db2777] border border-pink-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-pulse"></span>
                <span>{emergencyCount} active emergency</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            {info.subtitle}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter resident, helper, or skill..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284c7] focus:bg-white font-sans transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onOpenTelegram}
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#0284c7] rounded-xl text-xs font-mono-dose border border-sky-200 font-semibold active:translate-y-0.5 transition-all"
            title="Open Telegram Bot simulator"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@Telegram</span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-mono-dose border border-emerald-200 font-semibold active:translate-y-0.5 transition-all"
            title="Open WhatsApp Careline simulator"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
