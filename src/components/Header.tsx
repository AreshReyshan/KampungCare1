import React from 'react';
import { 
  Search, 
  Send, 
  MessageSquare, 
  Menu, 
  Inbox, 
  Activity, 
  Users, 
  HeartHandshake, 
  ShieldCheck, 
  ArrowLeftRight 
} from 'lucide-react';
import type { TabType } from './Sidebar';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab?: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTelegram: () => void;
  onOpenWhatsApp: () => void;
  emergencyCount: number;
  onOpenMobileMenu?: () => void;
  counts?: {
    triage: number;
    active: number;
    residents: number;
    volunteers: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenTelegram,
  onOpenWhatsApp,
  emergencyCount,
  onOpenMobileMenu,
  counts,
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

  const mobileTabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'triage', label: 'Triage', icon: Inbox, count: counts?.triage },
    { id: 'active', label: 'Active', icon: Activity, count: counts?.active },
    { id: 'residents', label: 'Residents', icon: Users, count: counts?.residents },
    { id: 'volunteers', label: 'Helpers', icon: HeartHandshake, count: counts?.volunteers },
    { id: 'sensors', label: 'Sensors', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-10 py-3.5 md:py-5 transition-all">
      <div className="max-w-6xl mx-auto space-y-3 md:space-y-0">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Menu Button + Title / Brand */}
          <div className="flex items-center gap-3">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="md:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900 font-display">
                  {info.title}
                </h2>
                {emergencyCount > 0 && currentTab === 'triage' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-dose bg-pink-100 text-[#db2777] border border-pink-200 font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]"></span>
                    <span>{emergencyCount} emergency</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-sans hidden sm:block">
                {info.subtitle}
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative w-40 sm:w-60 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search senior or helper..."
                className="w-full pl-8 md:pl-9 pr-3 md:pr-4 py-1.5 md:py-2 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0284c7] focus:bg-white font-sans transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onOpenTelegram}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-sky-50 hover:bg-sky-100 text-[#0284c7] rounded-xl text-xs font-mono-dose border border-sky-200 font-semibold active:translate-y-0.5 transition-all shadow-2xs shrink-0"
              title="Open Telegram Bot simulator"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">@Telegram</span>
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-mono-dose border border-emerald-200 font-semibold active:translate-y-0.5 transition-all shadow-2xs shrink-0"
              title="Open WhatsApp Careline simulator"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Mobile Swipeable Tab Strip (Visible on small screens) */}
        {onSelectTab && (
          <div className="md:hidden pt-1 pb-0.5 space-y-1.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
              {mobileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                const isEmergencyTab = tab.id === 'triage' && emergencyCount > 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs shrink-0 ${
                      isActive
                        ? 'bg-[#0284c7] text-white shadow-sky-500/20'
                        : isEmergencyTab
                        ? 'bg-pink-50 text-[#db2777] border border-pink-200 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-white text-slate-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Gesture Hint */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
              <ArrowLeftRight className="w-3 h-3 text-[#0284c7]" />
              <span>Swipe left or right anywhere on screen to switch tabs</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
