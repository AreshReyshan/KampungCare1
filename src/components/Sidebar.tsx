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
  ];

  return (
    <aside className="w-72 bg-[#0e1717] border-r border-[#223331] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1c2c2a]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#10b981] to-[#059669] flex items-center justify-center text-[#042f2e] shadow-sm border border-[#34d399]/30">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#f0f5f4] font-display">
                Kampung<span className="text-[#10b981]">Care</span>
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#809692] mt-0.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span>Setapak &amp; Taman Melati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs font-medium text-[#738a86] font-sans">
          Coordination desk
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-transform duration-100 ease-out group ${
                isActive
                  ? 'bg-[#182625] text-[#f0f5f4] border border-[#2b423f] shadow-sm font-semibold'
                  : 'text-[#9eb1ad] hover:text-[#f0f5f4] hover:bg-[#131f1e] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-[#10b981] text-[#042f2e]'
                      : 'text-[#809692] group-hover:text-[#f0f5f4] group-hover:bg-[#1a2928]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-sans text-sm">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 font-mono-dose">
                {item.hasEmergency && (
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]" title="Active emergency" />
                )}
                {item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-md ${
                      isActive
                        ? 'bg-[#223936] text-[#a7f3d0] border border-[#345954]'
                        : item.hasEmergency
                        ? 'bg-[#3b1219] text-[#fecdd3] border border-[#881337]'
                        : 'bg-[#152221] text-[#809692] group-hover:bg-[#1d2d2c]'
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
          <div className="p-4 bg-[#121c1c] border border-[#20312f] rounded-xl space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#c6d6d2] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                Connected lines
              </span>
              <span className="text-[11px] font-mono-dose bg-[#192b28] text-[#a7f3d0] border border-[#274642] px-2 py-0.5 rounded">
                2 active
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-dose">
              <div className="flex items-center justify-between text-[#9eb1ad]">
                <span className="flex items-center gap-1.5 text-[#38bdf8]">
                  <Send className="w-3.5 h-3.5" /> Telegram Bot
                </span>
                <span className="text-[#738a86]">@KampungCareBot</span>
              </div>

              <div className="flex items-center justify-between text-[#9eb1ad]">
                <span className="flex items-center gap-1.5 text-[#4ade80]">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Careline
                </span>
                <span className="text-[#738a86]">+60 11-KAMPUNG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Primary CTAs: Tactile Moulded Plastic Controls */}
      <div className="p-5 border-t border-[#1c2c2a] space-y-2.5 bg-[#0e1717]">
        <button
          onClick={onOpenTelegramSimulator}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-semibold shadow-sm border border-[#0369a1] active:translate-y-0.5 transition-transform duration-100 ease-out"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Simulate Telegram</span>
        </button>

        <button
          onClick={onOpenWhatsAppSimulator}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-semibold shadow-sm border border-[#047857] active:translate-y-0.5 transition-transform duration-100 ease-out"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Simulate WhatsApp</span>
        </button>

        <div className="flex items-center justify-between px-1 pt-1.5 text-xs text-[#738a86]">
          <div className="flex items-center gap-1.5 text-[#9eb1ad]">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span className="text-xs">Care network online</span>
          </div>
          <button
            onClick={onResetData}
            title="Reset to default demo data"
            className="flex items-center gap-1 text-xs text-[#809692] hover:text-[#f0f5f4] p-1 rounded hover:bg-[#182625] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
