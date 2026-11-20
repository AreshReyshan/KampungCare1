import type { BeatDefinition } from './types';
import type { TriageItem, ActiveDispatch } from '../types';

export const DEMO_BEATS: BeatDefinition[] = [
  {
    number: 1,
    totalBeats: 5,
    atSeconds: 0,
    timeLabel: '0:00',
    label: 'Baseline Monitoring',
    tier: 'idle',
    description: 'Idle dashboard with live clock ticking on existing overdue check-ins.',
    run: (ctx) => {
      ctx.addAuditLog({
        actor: 'AI',
        tier: 'system',
        title: 'Semi-Autonomous Surveillance Online',
        reasoning: [
          'Background sensor stream and intake queues connected.',
          'Two routine overdue check-ins queued for coordinator review.',
        ],
      });
    },
  },
  {
    number: 2,
    totalBeats: 5,
    atSeconds: 20,
    timeLabel: '0:20',
    label: 'Auto Grocery Dispatch',
    tier: 'auto',
    description: 'Uncle Lim WhatsApps routine grocery request. AI triages, scores, and auto-dispatches helper with WhatsApp ETA.',
    run: (ctx) => {
      const groceryText =
        'Good day, Uncle Lim here. Need wholemeal bread, eggs and low-sugar soy milk tomorrow morning.';

      // 1. Simulate WhatsApp message intake
      ctx.sendWhatsAppSimMessage(groceryText, true);

      // 2. Stage reasoning in rail
      ctx.addRailEvent({
        tier: 'auto',
        title: 'Triaged WhatsApp Intake',
        subtitle: 'Urgency 1 • 0.92 confidence • Routine non-clinical',
        confidence: 0.92,
        urgency: 1,
        details: [
          'Resident: Uncle Lim (79 yrs, Danau Kota)',
          'Intent: Household grocery errand (eggs, bread, soy milk)',
          'Risk profile: Zero active cardiac/fall symptoms',
        ],
      });

      // 3. Match candidate
      const helper = ctx.volunteers.find((v) => v.id === 'vol-khairul') || ctx.volunteers[4];

      ctx.addRailEvent({
        tier: 'auto',
        title: `Matched Helper: ${helper.name}`,
        subtitle: `${helper.distanceKm} km away • Grocery errands verified`,
        confidence: 0.92,
        urgency: 1,
        details: [
          'Distance: 0.6 km proximity',
          'Verified Skill: Grocery & Heavy Errands',
          'Language: Bahasa Melayu / English',
        ],
      });

      // 4. Create triage item and immediately auto-dispatch
      const triageId = 'trg-auto-uncle-lim-' + Date.now();
      const dispatchId = 'disp-auto-uncle-lim-' + Date.now();

      const newDispatch: ActiveDispatch = {
        id: dispatchId,
        triageId,
        channel: 'whatsapp',
        residentId: 'res-uncle-lim',
        residentName: 'Uncle Lim',
        residentAvatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        residentAddress: 'B-12-08, PV 15 Platinum Lake, Danau Kota',
        volunteerId: helper.id,
        volunteerName: helper.name,
        volunteerAvatar: helper.avatar,
        volunteerPhone: helper.phone,
        serviceType: 'Grocery Assistance (Bread, Eggs & Soy Milk)',
        carePill: 'Grocery & Errands',
        dispatchedAt: 'Just now',
        timeAgo: 'Just dispatched',
        estimatedArrival: 'Tomorrow 9:30 AM',
        status: 'dispatched',
        notes: groceryText,
      };

      // State transition
      ctx.setActiveDispatches((prev) => [newDispatch, ...prev]);

      // WhatsApp bot confirmation to resident
      ctx.sendWhatsAppSimMessage(
        `✅ Sukarelawan ${helper.name} telah ditugaskan untuk membeli barangan dapur anda. Anggaran tiba esok 9:30 pagi. Sila tunggu di rumah.`,
        false
      );

      // Reversible Undo handler
      const undoAction = () => {
        ctx.setActiveDispatches((prev) => prev.filter((d) => d.id !== dispatchId));
        // Restore to triage if desired
        const restoredTriage: TriageItem = {
          id: triageId,
          type: 'whatsapp_request',
          channel: 'whatsapp',
          priority: 'normal',
          residentId: 'res-uncle-lim',
          residentName: 'Uncle Lim',
          residentAvatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          residentAge: 79,
          residentNeighborhood: 'Danau Kota, Setapak',
          timestamp: new Date().toISOString(),
          timeAgo: 'Just now',
          originalWhatsAppMessage: groceryText,
          aiSummary: 'Grocery Assistance (Bread, Eggs, Soy Milk)',
          requiredCareTag: 'Grocery & Errands',
          matchedVolunteerId: helper.id,
        };
        ctx.setTriageItems((prev) => [restoredTriage, ...prev]);
        ctx.addToast('Auto-Dispatch Reverted', 'Uncle Lim grocery task returned to Triage.', 'info');
      };

      // Toast with Undo affordance
      ctx.addToast(
        'Auto-Dispatched: Uncle Lim Groceries',
        `Assigned ${helper.name} (${helper.distanceKm} km away) via WhatsApp.`,
        'success',
        undoAction
      );

      // Audit Log Entry
      ctx.addAuditLog({
        actor: 'AI',
        tier: 'auto',
        title: 'Auto-Dispatched Grocery Assistance',
        reasoning: [
          'Confidence 0.92 ≥ 0.80 threshold, routine errand with non-clinical urgency.',
          `Khairul Anuar ranked #1 (${helper.distanceKm} km, Grocery Verified).`,
          'Automated confirmation dispatched to WhatsApp Careline with 8s undo affordance.',
        ],
        undo: undoAction,
      });
    },
  },
  {
    number: 3,
    totalBeats: 5,
    atSeconds: 65, // 1:05
    timeLabel: '1:05',
    label: 'Proposed Clinic Escort',
    tier: 'propose',
    description: 'Mrs. Tan requests clinic escort with walking frame. Mobility risk triggers proposal card for coordinator review.',
    run: (ctx) => {
      const escortText =
        'Tolong carikan orang teman Mak Cik Tan pergi klinik Khamis pagi pukul 9.30, dia pakai walking frame.';

      ctx.sendTelegramSimMessage(escortText, true);

      // AI Analysis: Involves mobility risk & walking frame -> PROPOSE tier
      const helper = ctx.volunteers.find((v) => v.id === 'vol-ahmad') || ctx.volunteers[0];

      const proposeItem: TriageItem = {
        id: 'trg-propose-mrs-tan-' + Date.now(),
        type: 'telegram_request',
        channel: 'telegram',
        priority: 'high',
        residentId: 'res-tan-ah-mooi',
        residentName: 'Mrs. Tan Ah Mooi',
        residentAvatar:
          'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
        residentAge: 74,
        residentNeighborhood: 'Danau Kota, Setapak',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        originalTelegramMessage: escortText,
        aiSummary: 'Clinic Escort to Poliklinik Setapak • Thu 9:30 AM',
        requiredCareTag: 'Walking Frame Assist',
        scheduledTime: 'Thursday, 9:30 AM',
        matchedVolunteerId: helper.id,
      };

      ctx.setTriageItems((prev) => [proposeItem, ...prev]);

      ctx.addRailEvent({
        tier: 'propose',
        title: 'Proposed Clinic Escort Approval',
        subtitle: 'Mrs. Tan Ah Mooi • 0.62 confidence • Urgency 3',
        confidence: 0.62,
        urgency: 3,
        details: [
          'Clinical safety policy: Physical assistance on stairs requires verified human clearance.',
          'Recommended candidate: Ahmad Danial (0.8 km away • Walking Frame Verified).',
          'Inline approval card generated in Triage Inbox.',
        ],
      });

      ctx.addToast(
        'Proposed Action Awaiting Approval',
        'Mrs. Tan walking frame escort requires coordinator 1-click confirmation.',
        'warning'
      );

      ctx.addAuditLog({
        actor: 'AI',
        tier: 'propose',
        title: 'Proposed Clinic Escort (Ahmad Danial)',
        reasoning: [
          'Mobility flag detected: 4-point walking frame curb & stair assist.',
          'Confidence 0.62 falls in 0.55–0.79 band; AI blocked from auto-dispatching.',
          'Shortlisted Ahmad Danial (0.8 km, BM fluent, Walking Frame Certified).',
        ],
      });
    },
  },
  {
    number: 4,
    totalBeats: 5,
    atSeconds: 95, // 1:35
    timeLabel: '1:35',
    label: 'Sensor Inactivity Escalation',
    tier: 'propose',
    description: 'Uncle Lim home sensor detects zero morning movement. Automated check-in unanswered (60s), escalated to proposed home visit.',
    run: (ctx) => {
      // Step A: Home sensor notices lack of morning movement
      ctx.addRailEvent({
        tier: 'auto',
        title: 'IoT Sensor: Morning Inactivity Detected',
        subtitle: 'Uncle Lim • PV 15 • 0 movement between 07:00–09:30',
        confidence: 0.88,
        urgency: 2,
        details: [
          'Normal kitchen PIR sensor trigger missed (usual coffee time: 08:15 AM).',
          'Dispatching automated proactive WhatsApp well-being ping.',
        ],
      });

      ctx.sendWhatsAppSimMessage(
        'Salam Uncle Lim, sistem pengesan rumah pintar KampungCare mengesan tiada pergerakan aktif pagi ini. Adakah anda sihat? Sila balas mesej ini atau tekan 1.',
        false
      );

      // Step B: After 60 simulated seconds (or immediate escalation representation in demo)
      const escalationItem: TriageItem = {
        id: 'trg-sensor-esc-uncle-lim-' + Date.now(),
        type: 'overdue_checkin',
        priority: 'high',
        residentId: 'res-uncle-lim',
        residentName: 'Uncle Lim',
        residentAvatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        residentAge: 79,
        residentNeighborhood: 'Danau Kota, Setapak',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        overdueDuration: 'Unanswered (60s)',
        nokContact: {
          name: 'Lim Wei Kang (Son)',
          relationship: 'Son',
          phone: '+60 12-445 5667',
        },
        lastNotes: 'Zero movement detected by PIR sensor. Automated WhatsApp check-in unanswered for 60s. Propose immediate volunteer physical welfare check.',
      };

      ctx.setTriageItems((prev) => [escalationItem, ...prev]);

      ctx.addRailEvent({
        tier: 'propose',
        title: 'Escalated to In-Person Welfare Check',
        subtitle: 'Uncle Lim • Unresponsive to WhatsApp ping • 0.74 confidence',
        confidence: 0.74,
        urgency: 3,
        details: [
          'Automated tier exhausted without resident reply.',
          'Care protocol requires in-person door drop-by by closest helper.',
          'Alert dispatched to coordinator triage queue.',
        ],
      });

      ctx.addToast(
        'Sensor Alert Escalated',
        'Uncle Lim unresponsive to automated check-in. Proposed volunteer drop-by.',
        'warning'
      );

      ctx.addAuditLog({
        actor: 'AI',
        tier: 'propose',
        title: 'Escalated Inactivity Alert to Proposed Home Visit',
        reasoning: [
          'PIR sensor flagged 150 minutes of uncharacteristic morning inactivity.',
          'Proactive WhatsApp check-in auto-dispatched but received no reply within 60s.',
          'Escalated to coordinator queue with recommendation for neighbor volunteer check.',
        ],
      });
    },
  },
  {
    number: 5,
    totalBeats: 5,
    atSeconds: 130, // 2:10
    timeLabel: '2:10',
    label: 'Smart-Ring Fall & 999 Paramedic Gate',
    tier: 'human',
    description: 'Pak Samad smart ring detects fall. 30s countdown elapses, triggering HUMAN-ONLY 999 paramedic approval gate.',
    run: (ctx) => {
      // Trigger the ring fall modal & countdown sequence
      ctx.triggerRingFall();

      ctx.addRailEvent({
        tier: 'human',
        title: 'Smart Ring: High-G Fall Detected',
        subtitle: 'Pak Samad • Bathroom PPR Sri Melati • 30s countdown active',
        confidence: 0.99,
        urgency: 4,
        details: [
          'Ring accelerometer registered 3.8G spike followed by zero motor tremor.',
          'Buzzing ring haptic on resident hand.',
          '30-second false-alarm countdown started.',
        ],
      });

      // Drafted 999 Emergency Triage Item requiring Human Confirmation
      const emergencyItem: TriageItem = {
        id: 'trg-em-ring-' + Date.now(),
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
        emergencySummary: 'Smart-Ring Fall Detected: Bathroom slip with cardiac risk. 30s countdown uncancelled.',
        emergencyActionTag: 'Drafted 999 Dispatch Script • Awaiting Human Click',
        emergencyTriggerDetails: 'Smart Ring telemetry detected fall at PPR Sri Melati, Blok C-04-12. Daughter Zainab alerted via Telegram. 999 ambulance script prepared.',
      };

      ctx.setTriageItems((prev) => [emergencyItem, ...prev]);

      ctx.sendTelegramSimMessage(
        '⚠️ AMARAN KECEMASAN: Cincin pintar Pak Samad mengesan insiden jatuh di bilik air! Tiada pembatalan diterima dalam masa 30 saat. Mesej amaran dihantar kepada waris (Zainab).',
        false
      );

      ctx.addToast(
        '🚨 CRITICAL: Smart-Ring Fall Confirmed',
        '999 ambulance dispatch script drafted. Awaiting human coordinator confirmation.',
        'emergency'
      );

      ctx.addAuditLog({
        actor: 'Human',
        tier: 'human',
        title: 'Emergency Fall Protocol: 999 Awaiting Human Confirmation',
        reasoning: [
          'Ring telemetry confirmed fall without user cancellation.',
          'Safety Policy Strict Gate: AI is technically blocked from auto-dialing 999.',
          'Human coordinator must verify resident status and click Confirm 999 Dispatch.',
        ],
      });

      // Schedule audit drawer prompt at 2:40 (160 seconds)
      setTimeout(() => {
        ctx.openAuditDrawer();
      }, 5000);
    },
  },
];
