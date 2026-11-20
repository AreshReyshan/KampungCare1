import { useState, useEffect, useRef, useCallback } from 'react';
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
import { useSwipe } from './hooks/useSwipe';

// Semi-Autonomous Simulation & Governance System
import { engine, type EngineState } from './sim/engine';
import { auditManager } from './sim/audit';
import { DEMO_BEATS } from './sim/scenarios';
import type { SimulationSpeed, AutonomyRailEvent, AuditEntry } from './sim/types';
import { AutonomyRail } from './components/AutonomyRail';
import { DemoBar } from './components/DemoBar';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { RingSimulator } from './components/RingSimulator';

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

// Deterministic sequential ID generator (zero Math.random() in render/state)
let idCounter = 1000;
function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

// Tab order for mobile swipe gestures
const TABS: TabType[] = ['triage', 'active', 'residents', 'volunteers', 'sensors'];

export function App() {
  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<TabType>('triage');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Primary Domain State (seeded deterministically from mockData)
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [triageItems, setTriageItems] = useState<TriageItem[]>(INITIAL_TRIAGE_ITEMS);
  const [activeDispatches, setActiveDispatches] = useState<ActiveDispatch[]>(INITIAL_ACTIVE_DISPATCHES);
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>(INITIAL_TELEGRAM_MESSAGES);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simulation & Autonomy UI state
  const [engineState, setEngineState] = useState<EngineState>(() => engine.getState());
  const [railEvents, setRailEvents] = useState<AutonomyRailEvent[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(() => auditManager.getEntries());
  const [isRailOpen, setIsRailOpen] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  // Simulator Drawers & Modal States
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [resolvingEmergencyItem, setResolvingEmergencyItem] = useState<TriageItem | null>(null);
  const [completingDispatch, setCompletingDispatch] = useState<ActiveDispatch | null>(null);
  const [checkingInItem, setCheckingInItem] = useState<TriageItem | null>(null);
  const [changingHelperItem, setChangingHelperItem] = useState<TriageItem | null>(null);

  // Ref to hold live state for scenario execution without closures going stale
  const stateRef = useRef({
    residents,
    volunteers,
    triageItems,
    activeDispatches,
    telegramMessages,
    whatsAppMessages,
  });

  useEffect(() => {
    stateRef.current = {
      residents,
      volunteers,
      triageItems,
      activeDispatches,
      telegramMessages,
      whatsAppMessages,
    };
  });

  // Toast Helper (deterministic IDs, max 3 stacked, 6s auto-dismiss, optional undo)
  const addToast = useCallback(
    (
      title: string,
      description?: string,
      type: 'success' | 'info' | 'emergency' | 'warning' = 'success',
      onUndo?: () => void
    ) => {
      const id = nextId('toast');
      setToasts((prev) => [...prev.slice(-2), { id, title, description, type, onUndo }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add event to live Autonomy Rail
  const addRailEvent = useCallback(
    (event: Omit<AutonomyRailEvent, 'id' | 'virtualTime' | 'timestampLabel'>) => {
      const virtualTime = engine.getVirtualSeconds();
      const timestampLabel = engine.formatTime(virtualTime);
      const newEvent: AutonomyRailEvent = {
        ...event,
        id: nextId('rail'),
        virtualTime,
        timestampLabel,
      };
      setRailEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    },
    []
  );

  // Add entry to Audit Log
  const addAuditLog = useCallback(
    (
      entry: Omit<AuditEntry, 'id' | 'virtualTime' | 'timestampLabel' | 'realTime'> & {
        undo?: () => void;
      }
    ) => {
      const created = auditManager.logAction(
        entry.actor,
        entry.tier,
        entry.title,
        entry.reasoning,
        entry.undo,
        entry.metadata
      );
      return created.id;
    },
    []
  );

  // Helper match finder based on skill & distance
  const findBestVolunteer = useCallback(
    (requiredSkillTag?: string): Volunteer => {
      if (!requiredSkillTag) return volunteers[0];
      const skillMatch = volunteers.find((v) =>
        v.verifiedSkills.some((s) => s.toLowerCase().includes(requiredSkillTag.toLowerCase()))
      );
      return skillMatch || volunteers[0];
    },
    [volunteers]
  );

  // Telegram messaging simulator helper
  const sendTelegramSimMessage = useCallback((text: string, isFromUser = false) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: TelegramMessage = {
      id: nextId('tg'),
      sender: isFromUser ? 'user' : 'bot',
      senderName: isFromUser ? 'Resident / Family' : 'KampungCare Bot',
      text,
      time: timeNow,
      status: 'read',
    };
    setTelegramMessages((prev) => [...prev, msg]);
  }, []);

  // WhatsApp messaging simulator helper
  const sendWhatsAppSimMessage = useCallback((text: string, isFromUser = false) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: WhatsAppMessage = {
      id: nextId('wa'),
      sender: isFromUser ? 'user' : 'bot',
      senderName: isFromUser ? 'Resident / Family' : 'KampungCare WhatsApp Careline',
      text,
      time: timeNow,
      status: 'read',
    };
    setWhatsAppMessages((prev) => [...prev, msg]);
  }, []);

  // Subscribe to Engine and Audit Log
  useEffect(() => {
    const unsubEngine = engine.subscribe((state) => {
      setEngineState(state);
    });

    const unsubAudit = auditManager.subscribe((entries) => {
      setAuditEntries(entries);
    });

    return () => {
      unsubEngine();
      unsubAudit();
    };
  }, []);

  // Register the 5 Scenario Beats into the Simulation Engine
  const registerScenarios = useCallback(() => {
    engine.clearSchedule();

    for (const beat of DEMO_BEATS) {
      engine.schedule(
        beat.atSeconds,
        () => {
          beat.run({
            virtualTime: engine.getVirtualSeconds(),
            speed: engine.getSpeed(),
            residents: stateRef.current.residents,
            volunteers: stateRef.current.volunteers,
            triageItems: stateRef.current.triageItems,
            activeDispatches: stateRef.current.activeDispatches,
            setResidents,
            setVolunteers,
            setTriageItems,
            setActiveDispatches,
            addToast,
            addAuditLog,
            addRailEvent,
            sendTelegramSimMessage,
            sendWhatsAppSimMessage,
            openAuditDrawer: () => setIsAuditDrawerOpen(true),
            triggerRingFall: () => setCurrentTab('sensors'),
          });
        },
        beat.label
      );
    }
  }, [addToast, addAuditLog, addRailEvent, sendTelegramSimMessage, sendWhatsAppSimMessage]);

  useEffect(() => {
    registerScenarios();
  }, [registerScenarios]);

  // Full reset handler (restores byte-for-byte initial seed, resets virtual clock, clears timers)
  const handleResetData = useCallback(() => {
    engine.reset();
    auditManager.reset();
    setRailEvents([]);
    setResidents(INITIAL_RESIDENTS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setTriageItems(INITIAL_TRIAGE_ITEMS);
    setActiveDispatches(INITIAL_ACTIVE_DISPATCHES);
    setTelegramMessages(INITIAL_TELEGRAM_MESSAGES);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    registerScenarios();
    addToast('Simulation & Data Reset', 'Restored initial Setapak township scenarios byte-identically.', 'info');
  }, [registerScenarios, addToast]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    engine.togglePlayPause();
  };

  // Handle Speed Change
  const handleSetSpeed = (newSpeed: SimulationSpeed) => {
    engine.setSpeed(newSpeed);
  };

  // Handle Reversible Undo from Rail or Audit Drawer
  const handleUndoAction = (auditId: string) => {
    const success = auditManager.undoAction(auditId);
    if (success) {
      // Mark undone in rail
      setRailEvents((prev) =>
        prev.map((ev) => (ev.undoActionId === auditId ? { ...ev, undone: true } : ev))
      );
      addToast('Action Undone', 'Reverted previous action and restored previous state.', 'info');
    }
  };

  // 1A. Flow: Telegram message received from user
  const handleSendTelegramMessage = (text: string) => {
    sendTelegramSimMessage(text, true);

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
        sendTelegramSimMessage(
          '⚠️ KECEMASAN: Sila hubungi 999 segera! Kami telah menghantar amaran kecemasan kepada waris dan penyelaras KampungCare.',
          false
        );

        const newEmergency: TriageItem = {
          id: nextId('trg-em'),
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

        addRailEvent({
          tier: 'human',
          title: 'Emergency Fall Received via Telegram',
          subtitle: 'Pak Samad • Bathroom fall & chest pain • Urgency 4',
          confidence: 0.99,
          urgency: 4,
          details: [
            'Auto-sent 999 instructions to resident.',
            'Daughter Zainab alerted via Telegram.',
            'Safety Policy: Awaiting coordinator click to confirm 999 paramedic dispatch.',
          ],
        });

        addAuditLog({
          actor: 'AI',
          tier: 'human',
          title: 'Emergency Fall Detected via Telegram',
          reasoning: [
            'Thoracic distress & bathroom fall markers identified in text.',
            'Strict policy prohibits automated 999 call; requires human execution.',
          ],
        });

        addToast(
          '⚠️ Emergency Alert via Telegram',
          'Pak Samad reported bathroom fall. 999 instructions dispatched.',
          'emergency'
        );
      } else {
        sendTelegramSimMessage(
          'Terima kasih! Kami sedang mencarikan sukarelawan berdekatan untuk membantu anda.',
          false
        );

        let res = residents[1];
        let summary = 'Needs clinic escort to Poliklinik Setapak • Thu 9:30 AM';
        let carePill = 'Walking Frame Assist';
        let matchedVol = findBestVolunteer('Walking Frame');

        if (
          lowerText.includes('bread') ||
          lowerText.includes('milk') ||
          lowerText.includes('uncle lim') ||
          lowerText.includes('roti')
        ) {
          res = residents.find((r) => r.id === 'res-uncle-lim') || residents[3];
          summary = 'Assistance purchasing groceries (bread, milk) tomorrow morning';
          carePill = 'Vision Assist & Errands';
          matchedVol = findBestVolunteer('Grocery') || volunteers[4];
        }

        const newTriageRequest: TriageItem = {
          id: nextId('trg-req'),
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

        addRailEvent({
          tier: 'propose',
          title: `Triaged Telegram Request: ${res.name.split(' (')[0]}`,
          subtitle: `${summary} • Matched ${matchedVol.name}`,
          confidence: 0.68,
          urgency: 2,
          details: [
            `Resident mobility: ${res.mobilityBadge}`,
            `Candidate: ${matchedVol.name} (${matchedVol.distanceKm} km away)`,
          ],
        });

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
    sendWhatsAppSimMessage(text, true);

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
        sendWhatsAppSimMessage(
          '⚠️ AMARAN KECEMASAN: Sila hubungi 999 dengan segera! Pasukan kecemasan KampungCare dan waris telah dimaklumkan secara automatik.',
          false
        );

        const newEmergency: TriageItem = {
          id: nextId('trg-em'),
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

        addRailEvent({
          tier: 'human',
          title: 'Emergency Fall Received via WhatsApp',
          subtitle: 'Pak Samad • Bathroom slip • Urgency 4',
          confidence: 0.99,
          urgency: 4,
          details: [
            'WhatsApp Careline auto-replied emergency guidance.',
            '999 ambulance dispatch script drafted.',
            'Awaiting coordinator confirmation.',
          ],
        });

        addAuditLog({
          actor: 'AI',
          tier: 'human',
          title: 'Emergency Fall Alert via WhatsApp Careline',
          reasoning: [
            'Emergency markers matched.',
            'AI blocked from auto-contacting 999 without human review.',
          ],
        });

        addToast(
          '⚠️ Emergency Alert via WhatsApp',
          'Pak Samad reported fall via WhatsApp Careline. Alert dispatched.',
          'emergency'
        );
      } else {
        sendWhatsAppSimMessage(
          'Terima kasih kerana menghubungi KampungCare WhatsApp Careline! Permohonan anda sedang diproses dan sukarelawan berdekatan akan dipadankan segera.',
          false
        );

        let res = residents[3]; // Uncle Lim
        let summary = 'Assistance purchasing groceries (bread, milk) tomorrow morning';
        let carePill = 'Vision Assist & Errands';
        let matchedVol = findBestVolunteer('Grocery') || volunteers[4];

        if (
          lowerText.includes('klinik') ||
          lowerText.includes('tan') ||
          lowerText.includes('walking frame')
        ) {
          res = residents[1];
          summary = 'Needs clinic escort to Poliklinik Setapak • Thu 9:30 AM';
          carePill = 'Walking Frame Assist';
          matchedVol = findBestVolunteer('Walking Frame');
        } else if (
          lowerText.includes('dressing') ||
          lowerText.includes('wound') ||
          lowerText.includes('devi')
        ) {
          res = residents[4];
          summary = 'Diabetic wound dressing check & blood sugar';
          carePill = 'Clinical Nurse Assist';
          matchedVol = findBestVolunteer('Nurse');
        }

        const newTriageRequest: TriageItem = {
          id: nextId('trg-req'),
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

        addRailEvent({
          tier: 'auto',
          title: `Triaged WhatsApp Request: ${res.name.split(' (')[0]}`,
          subtitle: `${summary} • Matched ${matchedVol.name}`,
          confidence: 0.91,
          urgency: 1,
          details: [
            `Proximity: ${matchedVol.distanceKm} km away`,
            `Skill verification: ${carePill}`,
          ],
        });

        addToast(
          'New WhatsApp Request Triaged',
          `AI matched ${matchedVol.name} (${matchedVol.distanceKm} km away) for ${res.name.split(' (')[0]}.`,
          'info'
        );
      }
    }, 600);
  };

  // 2. Flow: 1-Click Dispatch from Triage (Used by both Human click and Proposal Approval)
  const handleAssignVolunteer = (triageItem: TriageItem, volunteer: Volunteer) => {
    setTriageItems((prev) => prev.filter((item) => item.id !== triageItem.id));

    const isWhatsApp =
      triageItem.type === 'whatsapp_request' || triageItem.channel === 'whatsapp';

    const dispatchId = nextId('disp');
    const newDispatch: ActiveDispatch = {
      id: dispatchId,
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
      notes:
        triageItem.originalWhatsAppMessage ||
        triageItem.originalTelegramMessage ||
        'Coordinated via Triage.',
    };

    setActiveDispatches((prev) => [newDispatch, ...prev]);

    // Send confirmation to resident's active channel
    if (isWhatsApp) {
      sendWhatsAppSimMessage(
        `✅ Sukarelawan ${volunteer.name} telah ditugaskan untuk membantu anda melalui WhatsApp Careline. Beliau akan tiba dalam masa anggaran 15 minit. Sila bersedia di rumah.`,
        false
      );
    } else {
      sendTelegramSimMessage(
        `✅ Sukarelawan ${volunteer.name} telah ditugaskan untuk membantu anda. Beliau akan tiba dalam masa anggaran 15 minit. Sila tunggu di rumah.`,
        false
      );
    }

    // Reversible Undo handler
    const undoDispatch = () => {
      setActiveDispatches((prev) => prev.filter((d) => d.id !== dispatchId));
      setTriageItems((prev) => [triageItem, ...prev]);
      addToast('Dispatch Reverted', `Task for ${triageItem.residentName} returned to Triage.`, 'info');
    };

    // Log to Audit Log
    addAuditLog({
      actor: 'Human',
      tier: 'propose',
      title: `Dispatched ${volunteer.name} to ${triageItem.residentName}`,
      reasoning: [
        'Human coordinator approved candidate match.',
        `Assigned ${volunteer.name} (${volunteer.distanceKm} km away, ${volunteer.verifiedSkills[0]}).`,
        `Arrival notice sent via ${isWhatsApp ? 'WhatsApp Careline' : 'Telegram Bot'}.`,
      ],
      undo: undoDispatch,
    });

    addToast(
      `Dispatched to ${volunteer.name}`,
      `Notification sent to ${triageItem.residentName}.`,
      'success',
      undoDispatch
    );
  };

  // Dismiss proposal handler
  const handleDismissProposal = (triageItemId: string) => {
    setTriageItems((prev) => prev.filter((item) => item.id !== triageItemId));
    addAuditLog({
      actor: 'Human',
      tier: 'propose',
      title: 'Proposal Rejected by Coordinator',
      reasoning: ['Coordinator manually rejected recommended candidate proposal.'],
    });
    addToast('Proposal Dismissed', 'Item removed from active queue.', 'info');
  };

  // 3. Flow: Resolve Emergency Alert
  const handleResolveEmergency = (item: TriageItem, resolutionNotes: string) => {
    setTriageItems((prev) => prev.filter((i) => i.id !== item.id));
    setResolvingEmergencyItem(null);

    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === item.residentId) {
          const newEvent = {
            id: nextId('tl'),
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

    sendTelegramSimMessage(
      `Penyelaras KampungCare telah mengesahkan penyelesaian kecemasan: ${resolutionNotes}`,
      false
    );
    sendWhatsAppSimMessage(
      `Penyelaras KampungCare telah mengesahkan penyelesaian kecemasan: ${resolutionNotes}`,
      false
    );

    addAuditLog({
      actor: 'Human',
      tier: 'human',
      title: `Emergency Resolved: ${item.residentName}`,
      reasoning: [
        'Human coordinator verified resident status with Next-of-Kin.',
        resolutionNotes,
        'Recorded outcome directly to Care Passport timeline.',
      ],
    });

    addToast(
      'Emergency Alert Resolved',
      `Logged coordination details to ${item.residentName} Care Passport.`,
      'success'
    );
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
            id: nextId('tl'),
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
            timeline: [newTimelineEvent, ...r.timeline],
          };
        }
        return r;
      })
    );

    addAuditLog({
      actor: 'Human',
      tier: 'system',
      title: `Completed Visit: ${dispatch.residentName}`,
      reasoning: [
        `Outcome: ${outcome}`,
        notes || 'Volunteer confirmed care instructions satisfied.',
      ],
    });

    addToast(
      'Visit Completed',
      `Logged outcome "${outcome}" to ${dispatch.residentName} Care Passport.`,
      'success'
    );
  };

  // 5. Flow: Quick Check-In Modal Confirm
  const handleConfirmQuickCheckIn = (item: TriageItem, outcome: string, notes: string) => {
    setTriageItems((prev) => prev.filter((i) => i.id !== item.id));
    setCheckingInItem(null);

    setResidents((prev) =>
      prev.map((r) => {
        if (r.id === item.residentId) {
          const newEvent = {
            id: nextId('tl'),
            date: 'Today',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'Routine Health Check-In Resolved',
            description: notes || outcome,
            type: 'checkin_logged' as const,
            outcome,
          };

          return {
            ...r,
            isOverdue: false,
            lastCheckIn: 'Today, just now',
            timeline: [newEvent, ...r.timeline],
          };
        }
        return r;
      })
    );

    addAuditLog({
      actor: 'Human',
      tier: 'system',
      title: `Check-In Resolved: ${item.residentName}`,
      reasoning: [
        `Outcome: ${outcome}`,
        notes || 'Coordinator verified well-being via phone check.',
      ],
    });

    addToast('Check-In Resolved', `Updated ${item.residentName} status to safe.`, 'success');
  };

  // 6. Flow: Select Alternate Volunteer
  const handleSelectAlternateVolunteer = (triageItemId: string, volunteerId: string) => {
    setTriageItems((prev) =>
      prev.map((item) =>
        item.id === triageItemId ? { ...item, matchedVolunteerId: volunteerId } : item
      )
    );
    const vol = volunteers.find((v) => v.id === volunteerId);
    if (vol) {
      addToast('Helper Updated', `Selected ${vol.name} for request.`, 'info');
    }
  };

  // 7. Flow: Contact Volunteer Direct
  const handleContactVolunteer = (vol: Volunteer, channel: 'telegram' | 'whatsapp') => {
    if (channel === 'telegram') {
      setIsTelegramOpen(true);
      sendTelegramSimMessage(`Coordinating with volunteer ${vol.name} (${vol.telegramHandle})...`, false);
    } else {
      setIsWhatsAppOpen(true);
      sendWhatsAppSimMessage(`Coordinating with volunteer ${vol.name} (${vol.whatsappNumber})...`, false);
    }
  };

  // 8. Flow: Call NOK direct
  const handleCallNOK = (resident: Resident) => {
    addToast(
      `Calling ${resident.emergencyContact.name}`,
      `Dialing ${resident.emergencyContact.phone}...`,
      'info'
    );
  };

  // 9. Flow: Smart Ring Fall Trigger
  const handleTriggerFallFromRing = (res: Resident) => {
    const emergencyItem: TriageItem = {
      id: nextId('trg-em-ring'),
      type: 'emergency',
      channel: 'telegram',
      priority: 'emergency',
      residentId: res.id,
      residentName: res.name.split(' (')[0],
      residentAvatar: res.avatar,
      residentAge: res.age,
      residentNeighborhood: res.neighborhood,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      emergencySummary: `Smart-Ring Fall: Bathroom slip with high impact detected. 30s countdown uncancelled.`,
      emergencyActionTag: 'Drafted 999 Paramedic Script • Awaiting Human Confirmation',
      emergencyTriggerDetails: `Wearable telemetry detected high-G fall at ${res.address}. Daughter ${res.emergencyContact.name} notified. 999 paramedic script prepared.`,
    };

    setTriageItems((prev) => [emergencyItem, ...prev]);

    sendTelegramSimMessage(
      `⚠️ AMARAN KECEMASAN: Cincin pintar ${res.name.split(' (')[0]} mengesan insiden jatuh! Tiada pembatalan diterima dalam masa 30 saat. Mesej amaran dihantar kepada waris (${res.emergencyContact.name}).`,
      false
    );

    addRailEvent({
      tier: 'human',
      title: 'Smart Ring: High-G Fall Confirmed',
      subtitle: `${res.name.split(' (')[0]} • 30s countdown uncancelled • Urgency 4`,
      confidence: 0.99,
      urgency: 4,
      details: [
        'Ring accelerometer telemetry validated impact.',
        `Drafted 999 ambulance dispatch script.`,
        'Safety Gate: Requires coordinator confirmation click.',
      ],
    });

    addAuditLog({
      actor: 'AI',
      tier: 'human',
      title: `Smart-Ring Fall Protocol: ${res.name.split(' (')[0]}`,
      reasoning: [
        'Wearable impact telemetry confirmed by countdown expiry.',
        'High-stakes policy: AI prohibited from contacting 999 without human review.',
        'Human coordinator verification required to confirm paramedic dispatch.',
      ],
    });

    addToast(
      '🚨 CRITICAL: Smart-Ring Fall Confirmed',
      '999 ambulance dispatch script drafted. Awaiting human confirmation.',
      'emergency'
    );

    // Switch to triage tab so emergency banner is in clear view
    setCurrentTab('triage');
  };

  // 10. Flow: Ring false alarm calibration
  const handleLogRingCalibration = (
    msg: string,
    oldSensitivity: number,
    newSensitivity: number
  ) => {
    addAuditLog({
      actor: 'AI',
      tier: 'system',
      title: 'Smart-Ring Sensitivity Auto-Calibrated',
      reasoning: [
        msg,
        `Reduced accelerometer threshold from ${oldSensitivity} to ${newSensitivity}/10.`,
        'Adaptive calibration prevents alarm fatigue on future senior movements.',
      ],
    });

    addToast(
      'Ring Calibrated',
      `Sensitivity adjusted to ${newSensitivity}/10 to eliminate false alarms.`,
      'info'
    );
  };

  // Derived counts
  const emergencyCount = triageItems.filter((i) => i.type === 'emergency').length;
  const activeCount = activeDispatches.filter((d) => d.status !== 'completed').length;
  const selectedResident = residents.find((r) => r.id === selectedResidentId) || null;
  const auditCounts = auditManager.getCounts();

  const handleSwipeLeft = useCallback(() => {
    // If any modal or drawer is open, ignore canvas swipe
    if (
      selectedResidentId !== null ||
      isTelegramOpen ||
      isWhatsAppOpen ||
      isAuditDrawerOpen ||
      resolvingEmergencyItem !== null ||
      completingDispatch !== null ||
      checkingInItem !== null ||
      changingHelperItem !== null
    ) {
      return;
    }

    // If mobile sidebar is open, swipe left closes it
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
      return;
    }

    setCurrentTab((prevTab) => {
      const currentIndex = TABS.indexOf(prevTab);
      if (currentIndex < TABS.length - 1) {
        return TABS[currentIndex + 1];
      }
      return prevTab;
    });
  }, [
    selectedResidentId,
    isTelegramOpen,
    isWhatsAppOpen,
    isAuditDrawerOpen,
    resolvingEmergencyItem,
    completingDispatch,
    checkingInItem,
    changingHelperItem,
    isMobileSidebarOpen,
  ]);

  const handleSwipeRight = useCallback(() => {
    // If any modal or drawer is open, ignore canvas swipe
    if (
      selectedResidentId !== null ||
      isTelegramOpen ||
      isWhatsAppOpen ||
      isAuditDrawerOpen ||
      resolvingEmergencyItem !== null ||
      completingDispatch !== null ||
      checkingInItem !== null ||
      changingHelperItem !== null
    ) {
      return;
    }

    setCurrentTab((prevTab) => {
      const currentIndex = TABS.indexOf(prevTab);
      if (currentIndex > 0) {
        return TABS[currentIndex - 1];
      }
      // If on the first tab ('triage') and user swipes right, reveal mobile navigation drawer!
      setIsMobileSidebarOpen(true);
      return prevTab;
    });
  }, [
    selectedResidentId,
    isTelegramOpen,
    isWhatsAppOpen,
    isAuditDrawerOpen,
    resolvingEmergencyItem,
    completingDispatch,
    checkingInItem,
    changingHelperItem,
  ]);

  const canvasSwipeHandlers = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden font-sans">
      {/* Sleek Left Sidebar */}
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
        onOpenAuditDrawer={() => setIsAuditDrawerOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Spacious Canvas */}
      <div 
        {...canvasSwipeHandlers}
        className="flex-1 flex flex-col min-w-0 overflow-y-auto relative touch-pan-y"
      >
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenTelegram={() => setIsTelegramOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          emergencyCount={emergencyCount}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          counts={{
            triage: triageItems.length,
            active: activeCount,
            residents: residents.length,
            volunteers: volunteers.length,
          }}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 pb-24">
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
              onDismissItem={handleDismissProposal}
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

          {currentTab === 'sensors' && (
            <RingSimulator
              residents={residents}
              onTriggerFallEmergency={handleTriggerFallFromRing}
              onLogCalibrationEvent={handleLogRingCalibration}
            />
          )}
        </main>

        {/* Bottom Demo Bar (Play/Pause, Speed 1x/4x/12x, Virtual Clock, Beat info) */}
        <DemoBar
          virtualSeconds={engineState.virtualSeconds}
          formattedTime={engineState.formattedTime}
          isPlaying={engineState.isPlaying}
          speed={engineState.speed}
          onPlayPause={handlePlayPause}
          onRestart={handleResetData}
          onSetSpeed={handleSetSpeed}
          onOpenAuditDrawer={() => setIsAuditDrawerOpen(true)}
          auditCounts={auditCounts}
        />
      </div>

      {/* Persistent Right Autonomy Rail */}
      <AutonomyRail
        events={railEvents}
        onUndoEvent={handleUndoAction}
        isOpen={isRailOpen}
        onToggle={() => setIsRailOpen(!isRailOpen)}
      />

      {/* Slide-Over Drawer: Governance Audit Log */}
      <AuditLogDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        entries={auditEntries}
        onUndo={handleUndoAction}
      />

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
