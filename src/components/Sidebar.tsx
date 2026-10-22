import React from 'react';
import { 
  Inbox, 
  Activity, 
  Users, 
  HeartHandshake, 
  Send, 
  RotateCcw,
  ShieldCheck,
  MapPin,
  MessageSquare
} from 'lucide-react';

export type TabType = 'triage' | 'active' | 'residents' | 'volunteers';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  counts: {
    triage: number;
    active: number;
    residents: number;
    volunteers: number;
    emergencyCount: number;
  };
  onOpenTelegramSimulator: () => void;
  onOpenWhatsAppSimulator: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  onOpenTelegramSimulator,
  onOpenWhatsAppSimulator,
  onResetData,
}) => {
  const navItems = [
    {
      id: 'triage' as TabType,
      label: 'Inbox & Triage',
      icon: Inbox,
      count: counts.triage,
      hasEmergency: counts.emergencyCount > 0,
      description: 'Incoming requests & alerts'
    },
    {
      id: 'active' as TabType,
      label: 'Active Care',
      icon: Activity,
      count: counts.active,
      description: 'Ongoing visits & tasks'
    },
    {
      id: 'residents' as TabType,
      label: 'Residents',
      icon: Users,
      count: counts.residents,
      description: 'Senior care passports'
    },
    {
      id: 'volunteers' as TabType,
      label: 'Volunteers',
      icon: HeartHandshake,
      count: counts.volunteers,
      description: 'Local helpers & skills'
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Kampung<span className="text-sky-400">Care</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-950 text-sky-300 border border-sky-800/60">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">Setapak &amp; Taman Melati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all group ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/30'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.hasEmergency && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                )}
                {item.count > 0 && (
                  <span
                    className={`px-2.5 py-0.5 text-xs rounded-full font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-900/80 text-sky-200 border border-sky-700/60'
                        : item.hasEmergency
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800 font-bold'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Dual Channel Live Status Card */}
        <div className="pt-6 px-1">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Integrated Channels
              </span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                2 Live
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Send className="w-3.5 h-3.5" /> Telegram Bot
                </span>
                <span className="text-slate-400">@KampungCareBot</span>
              </div>

              <div className="flex items-center justify-between text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Careline
                </span>
                <span className="text-slate-400">+60 11-KAMPUNG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Primary CTAs: Telegram & WhatsApp Test Buttons */}
      <div className="p-5 border-t border-slate-800 space-y-2.5 bg-slate-900">
        <button
          onClick={onOpenTelegramSimulator}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold text-sm shadow-md shadow-sky-500/25 active:scale-[0.98] transition-all group"
        >
          <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>Send Telegram Test</span>
        </button>

        <button
          onClick={onOpenWhatsAppSimulator}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-600/25 active:scale-[0.98] transition-all group"
        >
          <MessageSquare className="w-4 h-4 group-hover:scale-105 transition-transform" />
          <span>Send WhatsApp Test</span>
        </button>

        <div className="flex items-center justify-between px-1 pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs">System Online</span>
          </div>
          <button
            onClick={onResetData}
            title="Reset to default demo data"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
