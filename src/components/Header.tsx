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
    }
  };

  const info = getTabInfo();

  return (
    <header className="sticky top-0 z-10 bg-[#0c1313]/90 backdrop-blur-md border-b border-[#1c2c2a] px-10 py-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-[#f0f5f4] font-display">
              {info.title}
            </h2>
            {emergencyCount > 0 && currentTab === 'triage' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono-dose bg-[#3b1219] text-[#fecdd3] border border-[#881337]">
                <span>{emergencyCount} active emergency</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#809692] mt-1 font-sans">
            {info.subtitle}
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-[#738a86] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter resident, helper, or skill..."
              className="w-full pl-9 pr-4 py-2 bg-[#121c1c] text-xs text-[#f0f5f4] placeholder-[#738a86] rounded-lg border border-[#223533] shadow-inner focus:outline-none focus:border-[#10b981] font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#738a86] hover:text-[#f0f5f4]"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={onOpenTelegram}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#122227] hover:bg-[#182c33] text-[#38bdf8] rounded-lg text-xs font-mono-dose border border-[#1e3c45] active:translate-y-0.5 transition-transform duration-100 ease-out"
            title="Open Telegram Bot simulator"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@Telegram</span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#12241f] hover:bg-[#172e27] text-[#4ade80] rounded-lg text-xs font-mono-dose border border-[#1d4137] active:translate-y-0.5 transition-transform duration-100 ease-out"
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
