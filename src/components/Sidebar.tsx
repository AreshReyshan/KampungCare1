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

export type TabType = 'triage' | 'active' | 'residents' | 'volunteers' | 'sensors';

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
  onOpenAuditDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  onOpenTelegramSimulator,
  onOpenWhatsAppSimulator,
  onResetData,
  onOpenAuditDrawer,
}) => {
  const navItems = [
    {
      id: 'triage' as TabType,
      label: 'Inbox & Triage',
      icon: Inbox,
      count: counts.triage,
      hasEmergency: counts.emergencyCount > 0,
      description: 'Incoming requests'
    },
    {
      id: 'active' as TabType,
      label: 'Active Care',
      icon: Activity,
      count: counts.active,
      description: 'Ongoing visits'
    },
    {
      id: 'residents' as TabType,
      label: 'Residents',
      icon: Users,
      count: counts.residents,
      description: 'Senior profiles'
    },
    {
      id: 'volunteers' as TabType,
      label: 'Volunteers',
      icon: HeartHandshake,
      count: counts.volunteers,
      description: 'Verified helpers'
    },
    {
      id: 'sensors' as TabType,
      label: 'Ring & Sensors',
      icon: ShieldCheck,
      count: 0,
      description: 'Fall telemetry'
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 shadow-xs">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
                Kampung<span className="text-[#0284c7]">Care</span>
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <span>Setapak &amp; Taman Melati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-sans">
          Coordination desk
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-sky-50/90 text-[#0284c7] border border-sky-200/80 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-sans text-sm">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 font-mono-dose">
                {item.hasEmergency && (
                  <span className="relative flex h-2 w-2" title="Active emergency">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec4899]"></span>
                  </span>
                )}
                {item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-md ${
                      isActive
                        ? 'bg-sky-100 text-[#0284c7] border border-sky-200'
                        : item.hasEmergency
                        ? 'bg-pink-100 text-[#db2777] border border-pink-200 font-bold'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Dual Channel Live Status Tray */}
        <div className="pt-6 px-1">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                Connected lines
              </span>
              <span className="text-[11px] font-mono-dose bg-sky-100 text-[#0284c7] border border-sky-200 px-2 py-0.5 rounded font-semibold">
                2 active
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-dose">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-[#0284c7] font-medium">
                  <Send className="w-3.5 h-3.5" /> Telegram Bot
                </span>
                <span className="text-slate-400">@KampungCareBot</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Careline
                </span>
                <span className="text-slate-400">+60 11-KAMPUNG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Primary CTAs: Tactile Moulded Plastic Controls */}
      <div className="p-5 border-t border-slate-100 space-y-2.5 bg-white">
        <button
          onClick={onOpenTelegramSimulator}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-semibold shadow-sm border border-[#0284c7] active:translate-y-0.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simulate Telegram</span>
        </button>

        <button
          onClick={onOpenWhatsAppSimulator}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm border border-emerald-600 active:translate-y-0.5 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Simulate WhatsApp</span>
        </button>

        {onOpenAuditDrawer && (
          <button
            onClick={onOpenAuditDrawer}
            className="w-full flex items-center justify-center gap-2 h-9 px-3 bg-pink-50 hover:bg-pink-100 text-[#db2777] rounded-xl text-xs font-mono font-bold border border-pink-200 transition-colors"
          >
            <span>View Governance Audit</span>
          </button>
        )}

        <div className="flex items-center justify-between px-1 pt-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
            <span className="text-xs">Care network online</span>
          </div>
          <button
            onClick={onResetData}
            title="Reset to default demo data"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
