import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { TriageInbox } from './components/TriageInbox';
import { ActiveDispatches } from './components/ActiveDispatches';
import { ResidentsGrid } from './components/ResidentsGrid';
import { VolunteersGrid } from './components/VolunteersGrid';
import { CarePassportDrawer } from './components/CarePassportDrawer';
import { TelegramSimulator } from './components/TelegramSimulator';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { ResolveEmergencyModal } from './components/ResolveEmergencyModal';
import { CompleteVisitModal } from './components/CompleteVisitModal';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { VolunteerSelectModal } from './components/VolunteerSelectModal';
import { Toast } from './components/Toast';

import {
  INITIAL_RESIDENTS,
  INITIAL_VOLUNTEERS,
  INITIAL_TRIAGE_ITEMS,
  INITIAL_ACTIVE_DISPATCHES,
  INITIAL_TELEGRAM_MESSAGES,
  INITIAL_WHATSAPP_MESSAGES,
} from './data/mockData';

import type {
  Resident,
  Volunteer,
  TriageItem,
  ActiveDispatch,
  TelegramMessage,
  WhatsAppMessage,
  ToastMessage,
} from './types';

export function App() {
  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<TabType>('triage');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Domain State
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [triageItems, setTriageItems] = useState<TriageItem[]>(INITIAL_TRIAGE_ITEMS);
  const [activeDispatches, setActiveDispatches] = useState<ActiveDispatch[]>(INITIAL_ACTIVE_DISPATCHES);
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>(INITIAL_TELEGRAM_MESSAGES);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulator Drawers & Modal States
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [resolvingEmergencyItem, setResolvingEmergencyItem] = useState<TriageItem | null>(null);
  const [completingDispatch, setCompletingDispatch] = useState<ActiveDispatch | null>(null);
  const [checkingInItem, setCheckingInItem] = useState<TriageItem | null>(null);
  const [changingHelperItem, setChangingHelperItem] = useState<TriageItem | null>(null);

  // Toast Helper
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'emergency' | 'warning' = 'success'
  ) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset demo data
  const handleResetData = () => {
    setResidents(INITIAL_RESIDENTS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setTriageItems(INITIAL_TRIAGE_ITEMS);
    setActiveDispatches(INITIAL_ACTIVE_DISPATCHES);
    setTelegramMessages(INITIAL_TELEGRAM_MESSAGES);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    addToast('Demo Data Reset', 'Restored initial Setapak township scenarios.', 'info');
  };

  // Helper match finder based on skill & distance
  const findBestVolunteer = (requiredSkillTag?: string): Volunteer => {
    if (!requiredSkillTag) return volunteers[0];
    const skillMatch = volunteers.find((v) =>
      v.verifiedSkills.some((s) => s.toLowerCase().includes(requiredSkillTag.toLowerCase()))
    );
    return skillMatch || volunteers[0];
  };

  // 1A. Flow: Telegram message received from user
  const handleSendTelegramMessage = (text: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: TelegramMessage = {
      id: 'tg-user-' + Date.now(),
      sender: 'user',
      senderName: 'Resident / Family',
      text,
      time: timeNow,
      status: 'read',
    };

    setTelegramMessages((prev) => [...prev, userMsg]);

    const lowerText = text.toLowerCase();
    const isEmergency =
      lowerText.includes('jatuh') ||
      lowerText.includes('sakit dada') ||
      lowerText.includes('fall') ||
      lowerText.includes('chest pain') ||
      lowerText.includes('tolong!') ||
      lowerText.includes('darurat');

    setTimeout(() => {
      if (isEmergency) {
        const botReply: TelegramMessage = {
          id: 'tg-bot-' + Date.now(),
          sender: 'bot',
          senderName: 'KampungCare Bot',
          text: '⚠️ KECEMASAN: Sila hubungi 999 segera! Kami telah menghantar amaran kecemasan kepada waris dan penyelaras KampungCare.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergency: true,
        };
        setTelegramMessages((prev) => [...prev, botReply]);

        const newEmergency: TriageItem = {
          id: 'trg-em-' + Date.now(),
          type: 'emergency',
          channel: 'telegram',
          priority: 'emergency',
          residentId: 'res-pak-samad',
          residentName: 'Pak Samad',
          residentAvatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&auto=format&fit=crop&q=80',
          residentAge: 78,
          residentNeighborhood: 'PPR Sri Melati, Taman Melati',
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          emergencySummary: 'Reported a fall and chest pain via Telegram just now.',
          emergencyActionTag: 'Auto-replied 999 instructions & alerted daughter (Zainab)',
          emergencyTriggerDetails: text,
        };

        setTriageItems((prev) => [newEmergency, ...prev]);
        addToast(
          '⚠️ Emergency Alert via Telegram',
          'Pak Samad reported bathroom fall. 999 instructions dispatched.',
          'emergency'
        );
      } else {
        const botReply: TelegramMessage = {
          id: 'tg-bot-' + Date.now(),
          sender: 'bot',
          senderName: 'KampungCare Bot',
          text: 'Terima kasih! Kami sedang mencarikan sukarelawan berdekatan untuk membantu anda.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTelegramMessages((prev) => [...prev, botReply]);

        let res = residents[1];
        let summary = 'Needs clinic escort to Poliklinik Setapak • Thu 9:30 AM';
        let carePill = 'Walking Frame Assist';
        let matchedVol = findBestVolunteer('Walking Frame');

        if (lowerText.includes('bread') || lowerText.includes('milk') || lowerText.includes('uncle lim') || lowerText.includes('roti')) {
          res = residents.find((r) => r.id === 'res-uncle-lim') || residents[3];
          summary = 'Assistance purchasing groceries (bread, milk) tomorrow morning';
          carePill = 'Vision Assist & Errands';
          matchedVol = findBestVolunteer('Grocery') || volunteers[4];
        }

        const newTriageRequest: TriageItem = {
          id: 'trg-req-' + Date.now(),
          type: 'telegram_request',
          channel: 'telegram',
          priority: 'normal',
          residentId: res.id,
          residentName: res.name.split(' (')[0],
          residentAvatar: res.avatar,
          residentAge: res.age,
          residentNeighborhood: res.neighborhood,
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          originalTelegramMessage: text,
          aiSummary: summary,
          requiredCareTag: carePill,
          matchedVolunteerId: matchedVol.id,
        };

        setTriageItems((prev) => [newTriageRequest, ...prev]);
        addToast(
          'New Telegram Request Triaged',
          `AI matched ${matchedVol.name} (${matchedVol.distanceKm} km away) for ${res.name.split(' (')[0]}.`,
          'info'
        );
      }
    }, 600);
  };

  // 1B. Flow: WhatsApp message received from user
  const handleSendWhatsAppMessage = (text: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: WhatsAppMessage = {
      id: 'wa-user-' + Date.now(),
      sender: 'user',
      senderName: 'Resident / Family',
      text,
      time: timeNow,
      status: 'read',
    };

    setWhatsAppMessages((prev) => [...prev, userMsg]);

    const lowerText = text.toLowerCase();
    const isEmergency =
      lowerText.includes('jatuh') ||
      lowerText.includes('sakit dada') ||
      lowerText.includes('fall') ||
      lowerText.includes('chest pain') ||
      lowerText.includes('kecemasan') ||
      lowerText.includes('tolong');

    setTimeout(() => {
      if (isEmergency) {
        const botReply: WhatsAppMessage = {
          id: 'wa-bot-' + Date.now(),
          sender: 'bot',
          senderName: 'KampungCare WhatsApp Careline',
          text: '⚠️ AMARAN KECEMASAN: Sila hubungi 999 dengan segera! Pasukan kecemasan KampungCare dan waris telah dimaklumkan secara automatik.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergency: true,
        };
        setWhatsAppMessages((prev) => [...prev, botReply]);

        const newEmergency: TriageItem = {
          id: 'trg-em-' + Date.now(),
          type: 'emergency',
          channel: 'whatsapp',
          priority: 'emergency',
          residentId: 'res-pak-samad',
          residentName: 'Pak Samad',
          residentAvatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&auto=format&fit=crop&q=80',
          residentAge: 78,
          residentNeighborhood: 'PPR Sri Melati, Taman Melati',
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          emergencySummary: 'Reported a fall and chest pain via WhatsApp just now.',
          emergencyActionTag: 'Auto-replied 999 instructions & alerted daughter (Zainab)',
          emergencyTriggerDetails: text,
        };

        setTriageItems((prev) => [newEmergency, ...prev]);
        addToast(
          '⚠️ Emergency Alert via WhatsApp',
          'Pak Samad reported fall via WhatsApp Careline. Alert dispatched.',
          'emergency'
        );
      } else {
        const botReply: WhatsAppMessage = {
          id: 'wa-bot-' + Date.now(),
          sender: 'bot',
          senderName: 'KampungCare WhatsApp Careline',
          text: 'Terima kasih kerana menghubungi KampungCare WhatsApp Careline! Permohonan anda sedang diproses dan sukarelawan berdekatan akan dipadankan segera.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setWhatsAppMessages((prev) => [...prev, botReply]);

        let res = residents[3]; // Uncle Lim default for WhatsApp
        let summary = 'Assistance purchasing groceries (bread, milk) tomorrow morning';
        let carePill = 'Vision Assist & Errands';
        let matchedVol = findBestVolunteer('Grocery') || volunteers[4];

        if (lowerText.includes('klinik') || lowerText.includes('tan') || lowerText.includes('walking frame')) {
          res = residents[1];
          summary = 'Needs clinic escort to Poliklinik Setapak • Thu 9:30 AM';
          carePill = 'Walking Frame Assist';
          matchedVol = findBestVolunteer('Walking Frame');
        } else if (lowerText.includes('dressing') || lowerText.includes('wound') || lowerText.includes('devi')) {
          res = residents[4];
          summary = 'Diabetic wound dressing check & blood sugar';
          carePill = 'Clinical Nurse Assist';
          matchedVol = findBestVolunteer('Nurse');
        }

        const newTriageRequest: TriageItem = {
          id: 'trg-req-' + Date.now(),
          type: 'whatsapp_request',
          channel: 'whatsapp',
          priority: 'normal',
          residentId: res.id,
          residentName: res.name.split(' (')[0],
          residentAvatar: res.avatar,
          residentAge: res.age,
          residentNeighborhood: res.neighborhood,
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          originalWhatsAppMessage: text,
          aiSummary: summary,
          requiredCareTag: carePill,
          matchedVolunteerId: matchedVol.id,
        };

        setTriageItems((prev) => [newTriageRequest, ...prev]);
        addToast(
          'New WhatsApp Request Triaged',
          `AI matched ${matchedVol.name} (${matchedVol.distanceKm} km away) for ${res.name.split(' (')[0]}.`,
          'info'
        );
      }
    }, 600);
  };

  // 2. Flow: 1-Click Dispatch from Triage
  const handleAssignVolunteer = (triageItem: TriageItem, volunteer: Volunteer) => {
    setTriageItems((prev) => prev.filter((item) => item.id !== triageItem.id));

    const isWhatsApp = triageItem.type === 'whatsapp_request' || triageItem.channel === 'whatsapp';

    const newDispatch: ActiveDispatch = {
      id: 'disp-' + Date.now(),
      triageId: triageItem.id,
      channel: isWhatsApp ? 'whatsapp' : 'telegram',
      residentId: triageItem.residentId,
      residentName: triageItem.residentName,
      residentAvatar: triageItem.residentAvatar,
      residentAddress:
        residents.find((r) => r.id === triageItem.residentId)?.address ||
        triageItem.residentNeighborhood,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      volunteerAvatar: volunteer.avatar,
      volunteerPhone: volunteer.phone,
      serviceType: triageItem.aiSummary || 'Community Care Visit',
      carePill: triageItem.requiredCareTag || 'Volunteer Assist',
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just dispatched',
      estimatedArrival: 'En route • Arriving in 15 mins',
      status: 'dispatched',
      notes: triageItem.originalWhatsAppMessage || triageItem.originalTelegramMessage || 'Coordinated via Triage.',
    };

    setActiveDispatches((prev) => [newDispatch, ...prev]);

    if (isWhatsApp) {
      const waConfirmation: WhatsAppMessage = {
        id: 'wa-disp-' + Date.now(),
        sender: 'bot',
        senderName: 'KampungCare WhatsApp Careline',
        text: `✅ Sukarelawan ${volunteer.name} telah ditugaskan untuk membantu anda melalui WhatsApp Careline. Beliau akan tiba dalam masa anggaran 15 minit. Sila bersedia di rumah.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setWhatsAppMessages((prev) => [...prev, waConfirmation]);

      addToast(
        `Dispatched to ${volunteer.name} via WhatsApp`,
        `Notification sent to ${triageItem.residentName} on WhatsApp Careline.`,
        'success'
      );
    } else {
      const tgConfirmation: TelegramMessage = {
        id: 'tg-disp-' + Date.now(),
        sender: 'bot',
        senderName: 'KampungCare Bot',
        text: `✅ Sukarelawan ${volunteer.name} telah ditugaskan untuk membantu anda. Beliau akan tiba dalam masa anggaran 15 minit. Sila tunggu di rumah.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTelegramMessages((prev) => [...prev, tgConfirmation]);

      addToast(
        `Dispatched to ${volunteer.name} via Telegram`,
        `Notification sent to ${triageItem.residentName} via @KampungCareBot.`,
        'success'
      );
    }
  };

  // 3. Flow: Resolve Emergency Alert
  const handleResolveEmergency = (item: TriageItem, resolutionNotes: string) => {
    setTriageItems((prev) => prev.filter((i) => i.id !== item.id));
    setResolvingEmergencyItem(null);

    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === item.residentId) {
          const newEvent = {
            id: 'tl-' + Date.now(),
            date: 'Today',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Emergency Fall Resolved & Logged',
            description: resolutionNotes,
            type: 'emergency_resolved' as const,
            outcome: '999 paramedic & family coordination logged',
          };
          return {
            ...r,
            timeline: [newEvent, ...r.timeline],
          };
        }
        return r;
      })
    );

    // Notify inside Telegram & WhatsApp Simulators
    const alertNotice: TelegramMessage = {
      id: 'tg-em-res-' + Date.now(),
      sender: 'system',
      senderName: 'System',
      text: `Penyelaras KampungCare telah mengesahkan penyelesaian kecemasan: ${resolutionNotes}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTelegramMessages((prev) => [...prev, alertNotice]);
    setWhatsAppMessages((prev) => [...prev, alertNotice]);

    addToast('Emergency Alert Resolved', 'Logged coordination details to Pak Samad Care Passport.', 'success');
  };

  // 4. Flow: Complete Visit & Update Care Passport
  const handleCompleteVisit = (dispatch: ActiveDispatch, outcome: string, notes: string) => {
    setActiveDispatches((prev) =>
      prev.map((d) => (d.id === dispatch.id ? { ...d, status: 'completed' as const } : d))
    );
    setCompletingDispatch(null);

    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === dispatch.residentId) {
          const newTimelineEvent = {
            id: 'tl-' + Date.now(),
            date: 'Today',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: dispatch.serviceType,
            description: notes || 'Visit completed successfully.',
            type: 'visit_completed' as const,
            volunteerName: dispatch.volunteerName,
            outcome,
          };

          return {
            ...r,
            lastCheckIn: 'Today, just now',
            isOverdue: false,
            timeline: [newTimelineEvent, ...r.timeline],
          };
        }
        return r;
      })
    );

    if (dispatch.channel === 'whatsapp') {
      const waCompleteNotice: WhatsAppMessage = {
        id: 'wa-comp-' + Date.now(),
        sender: 'bot',
        senderName: 'KampungCare WhatsApp Careline',
        text: `🌟 Lawatan selesai: ${dispatch.serviceType}. Terima kasih kepada sukarelawan ${dispatch.volunteerName}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setWhatsAppMessages((prev) => [...prev, waCompleteNotice]);
    } else {
      const tgCompleteNotice: TelegramMessage = {
        id: 'tg-comp-' + Date.now(),
        sender: 'bot',
        senderName: 'KampungCare Bot',
        text: `🌟 Lawatan selesai: ${dispatch.serviceType}. Terima kasih kepada sukarelawan ${dispatch.volunteerName}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTelegramMessages((prev) => [...prev, tgCompleteNotice]);
    }

    addToast('Visit Completed!', `Outcome recorded to ${dispatch.residentName}'s Care Passport.`, 'success');
  };

  // 5. Flow: Quick Check-In Resolution
  const handleConfirmQuickCheckIn = (item: TriageItem, outcome: string, notes: string) => {
    setTriageItems((prev) => prev.filter((i) => i.id !== item.id));
    setCheckingInItem(null);

    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === item.residentId) {
          const newEvent = {
            id: 'tl-' + Date.now(),
            date: 'Today',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Quick Check-In Logged',
            description: notes,
            type: 'checkin_logged' as const,
            outcome,
          };
          return {
            ...r,
            lastCheckIn: 'Today, just now',
            isOverdue: false,
            timeline: [newEvent, ...r.timeline],
          };
        }
        return r;
      })
    );

    addToast('Check-In Logged', `Updated care record for ${item.residentName}.`, 'success');
  };

  // 6. Flow: Change Helper on Triage Card
  const handleSelectAlternateVolunteer = (triageItemId: string, volunteerId: string) => {
    setTriageItems((prev) =>
      prev.map((item) => {
        if (item.id === triageItemId) {
          return { ...item, matchedVolunteerId: volunteerId };
        }
        return item;
      })
    );
    const vol = volunteers.find((v) => v.id === volunteerId);
    if (vol) {
      addToast('Helper Updated', `Matched with ${vol.name} (${vol.distanceKm} km away).`, 'info');
    }
  };

  // 7. Contact volunteer directly
  const handleContactVolunteer = (volunteer: Volunteer, channel: 'telegram' | 'whatsapp') => {
    if (channel === 'whatsapp') {
      setIsWhatsAppOpen(true);
      addToast(
        `Direct WhatsApp to ${volunteer.name}`,
        `Connecting to ${volunteer.whatsappNumber} on KampungCare network.`,
        'info'
      );
    } else {
      setIsTelegramOpen(true);
      addToast(
        `Direct Telegram to ${volunteer.name}`,
        `Connecting to @${volunteer.telegramHandle.replace('@', '')} on KampungCare network.`,
        'info'
      );
    }
  };

  // 8. Call NOK from Care Passport
  const handleCallNOK = (resident: Resident, channel: 'telegram' | 'whatsapp' | 'phone') => {
    if (channel === 'whatsapp') {
      setIsWhatsAppOpen(true);
      addToast(
        `WhatsApp Alert Sent`,
        `Direct message opened with ${resident.emergencyContact.name}.`,
        'info'
      );
    } else if (channel === 'telegram') {
      setIsTelegramOpen(true);
      addToast(
        `Telegram Alert Sent`,
        `Direct bot dispatch queued to ${resident.emergencyContact.name}.`,
        'info'
      );
    } else {
      addToast(
        `Calling ${resident.emergencyContact.name}`,
        `Dialing ${resident.emergencyContact.phone}...`,
        'info'
      );
    }
  };

  // Derived counts
  const emergencyCount = triageItems.filter((i) => i.type === 'emergency').length;
  const activeCount = activeDispatches.filter((d) => d.status !== 'completed').length;

  const selectedResident = residents.find((r) => r.id === selectedResidentId) || null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sleek Left Sidebar (Wider & Bolder) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        counts={{
          triage: triageItems.length,
          active: activeCount,
          residents: residents.length,
          volunteers: volunteers.length,
          emergencyCount,
        }}
        onOpenTelegramSimulator={() => setIsTelegramOpen(true)}
        onOpenWhatsAppSimulator={() => setIsWhatsAppOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Spacious Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          currentTab={currentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenTelegram={() => setIsTelegramOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          emergencyCount={emergencyCount}
        />

        <main className="flex-1 px-10 py-10">
          {currentTab === 'triage' && (
            <TriageInbox
              items={triageItems}
              volunteers={volunteers}
              residents={residents}
              onAssignVolunteer={handleAssignVolunteer}
              onOpenResolveEmergency={(item) => setResolvingEmergencyItem(item)}
              onOpenQuickCheckIn={(item) => setCheckingInItem(item)}
              onOpenResidentPassport={(id) => setSelectedResidentId(id)}
              onChangeHelper={(item) => setChangingHelperItem(item)}
            />
          )}

          {currentTab === 'active' && (
            <ActiveDispatches
              dispatches={activeDispatches}
              residents={residents}
              onOpenCompleteVisit={(dispatch) => setCompletingDispatch(dispatch)}
              onOpenResidentPassport={(id) => setSelectedResidentId(id)}
            />
          )}

          {currentTab === 'residents' && (
            <ResidentsGrid
              residents={residents}
              searchQuery={searchQuery}
              onSelectResident={(id) => setSelectedResidentId(id)}
            />
          )}

          {currentTab === 'volunteers' && (
            <VolunteersGrid
              volunteers={volunteers}
              searchQuery={searchQuery}
              onContactVolunteer={handleContactVolunteer}
            />
          )}
        </main>
      </div>

      {/* Slide-Over Drawer: Resident Care Passport */}
      <CarePassportDrawer
        resident={selectedResident}
        isOpen={selectedResidentId !== null}
        onClose={() => setSelectedResidentId(null)}
        onTriggerCallNOK={handleCallNOK}
      />

      {/* Slide-Over Drawer: Telegram Bot Phone Simulator */}
      <TelegramSimulator
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        messages={telegramMessages}
        onSendMessage={handleSendTelegramMessage}
      />

      {/* Slide-Over Drawer: WhatsApp Careline Phone Simulator */}
      <WhatsAppSimulator
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        messages={whatsAppMessages}
        onSendMessage={handleSendWhatsAppMessage}
      />

      {/* Modal: Resolve Emergency Alert */}
      <ResolveEmergencyModal
        isOpen={resolvingEmergencyItem !== null}
        item={resolvingEmergencyItem}
        resident={
          residents.find((r) => r.id === resolvingEmergencyItem?.residentId) || null
        }
        onClose={() => setResolvingEmergencyItem(null)}
        onResolve={handleResolveEmergency}
      />

      {/* Modal: Complete Visit & Outcome Logging */}
      <CompleteVisitModal
        isOpen={completingDispatch !== null}
        dispatch={completingDispatch}
        onClose={() => setCompletingDispatch(null)}
        onComplete={handleCompleteVisit}
      />

      {/* Modal: Quick Check-In */}
      <QuickCheckInModal
        isOpen={checkingInItem !== null}
        item={checkingInItem}
        resident={residents.find((r) => r.id === checkingInItem?.residentId) || null}
        onClose={() => setCheckingInItem(null)}
        onConfirmCheckIn={handleConfirmQuickCheckIn}
      />

      {/* Modal: Change Helper */}
      <VolunteerSelectModal
        isOpen={changingHelperItem !== null}
        triageItem={changingHelperItem}
        volunteers={volunteers}
        onClose={() => setChangingHelperItem(null)}
        onSelectVolunteer={handleSelectAlternateVolunteer}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
