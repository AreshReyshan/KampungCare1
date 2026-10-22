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
          title: 'Triage Inbox',
          subtitle: 'Prioritised feed of Telegram & WhatsApp requests, emergencies, and check-ins',
        };
      case 'active':
        return {
          title: 'Active Care & Dispatches',
          subtitle: 'Real-time timeline and status of ongoing visits across Setapak',
        };
      case 'residents':
        return {
          title: 'Residents (Care Passports)',
          subtitle: 'Senior health profiles, mobility requirements, and emergency contacts',
        };
      case 'volunteers':
        return {
          title: 'Community Volunteers',
          subtitle: 'Verified local helpers, proximity, and specialised skill tags',
        };
    }
  };

  const info = getTabInfo();

  return (
    <header className="sticky top-0 z-10 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-10 py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              {info.title}
            </h2>
            {emergencyCount > 0 && currentTab === 'triage' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                {emergencyCount} Emergency Active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1 font-normal">
            {info.subtitle}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search resident, volunteer, skill..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 rounded-xl border border-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onOpenTelegram}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 rounded-xl text-xs font-semibold border border-sky-800/80 transition-all shadow-xs active:scale-95"
            title="Open Telegram Bot Mobile Simulator"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Telegram</span>
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-800/80 transition-all shadow-xs active:scale-95"
            title="Open WhatsApp Careline Mobile Simulator"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
