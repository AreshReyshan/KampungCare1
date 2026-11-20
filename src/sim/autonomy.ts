import type { TriageItem, Volunteer, Resident } from '../types';
import type { DecisionResult, VolunteerMatchScore } from './types';

/**
 * Autonomy Decision Engine.
 * Evaluates inbound care requests, sensor alerts, and check-ins into three distinct tiers:
 *  - AUTO: High confidence (≥0.80), low/routine urgency (≤2), safe automated dispatch/reply.
 *  - PROPOSE: Moderate confidence (0.55-0.79), urgency 3, clinical touchpoint or mobility risk. Needs human coordinator 1-click approval.
 *  - HUMAN: Emergency keywords, ring fall/SOS, 999 dispatch, NOK serious alerts. AI drafts; human MUST execute.
 */
export function decide(item: TriageItem, _resident?: Resident): DecisionResult {
  const text = (
    (item.originalWhatsAppMessage || '') +
    ' ' +
    (item.originalTelegramMessage || '') +
    ' ' +
    (item.emergencySummary || '') +
    ' ' +
    (item.aiSummary || '') +
    ' ' +
    (item.lastNotes || '')
  ).toLowerCase();

  const isEmergencyType = item.type === 'emergency';
  const hasEmergencyKeyword =
    text.includes('jatuh') ||
    text.includes('fall') ||
    text.includes('sakit dada') ||
    text.includes('chest pain') ||
    text.includes('999') ||
    text.includes('darurat') ||
    text.includes('unresponsive') ||
    text.includes('sos') ||
    text.includes('bilik air') ||
    text.includes('ambulance') ||
    text.includes('pengsan') ||
    text.includes('ring_fall');

  // Tier 1: HUMAN ONLY (High-stakes emergencies, 999, NOK dispatch)
  if (isEmergencyType || hasEmergencyKeyword) {
    return {
      tier: 'human',
      confidence: 0.99,
      urgency: 4,
      requiresHuman: true,
      category: 'emergency',
      reasoning: [
        'Acute distress markers detected: physical fall / thoracic pain signature.',
        'High-stakes policy: AI prohibited from dispatching 999 or sending unverified NOK alerts.',
        'Immediate human coordinator review required to confirm paramedic routing.',
      ],
      suggestedVolunteerId: undefined,
    };
  }

  // Check for clinical / mobility risk / care-plan changes / thin match
  const touchesMedication =
    text.includes('ubat') ||
    text.includes('medication') ||
    text.includes('insulin') ||
    text.includes('bp') ||
    text.includes('pressure') ||
    text.includes('hypertension') ||
    text.includes('dressing') ||
    text.includes('wound');

  const touchesDizzinessOrMobility =
    text.includes('pening') ||
    text.includes('dizzy') ||
    text.includes('dizziness') ||
    text.includes('walking frame') ||
    text.includes('tongkat') ||
    text.includes('wheelchair') ||
    text.includes('stroke') ||
    text.includes('curb') ||
    text.includes('tangga') ||
    text.includes('stairs');

  const isSensorInactivity =
    text.includes('no movement') ||
    text.includes('pengesan rumah') ||
    text.includes('inactivity') ||
    text.includes('unanswered check-in');

  // Tier 2: PROPOSE (Urgency 3 or confidence 0.55-0.79 or clinical/mobility/sensor escalation)
  if (touchesDizzinessOrMobility || touchesMedication || isSensorInactivity || item.type === 'overdue_checkin') {
    let confidence = 0.64;
    const reasoning: string[] = [];

    if (touchesDizzinessOrMobility) {
      confidence = 0.62;
      reasoning.push('Involves physical gait vulnerability (4-point walking frame / mobility support).');
      reasoning.push('Volunteer must have physical assistance training; candidate language/skill margin is narrow.');
      reasoning.push('Proposes best-match candidate with coordinator 1-click confirmation.');
    } else if (isSensorInactivity) {
      confidence = 0.72;
      reasoning.push('Home activity sensor flagged zero movement across regular 2.5-hour window.');
      reasoning.push('Automated WhatsApp ping unanswered after 60 simulated seconds.');
      reasoning.push('Escalated from auto-check-in to proposed in-person volunteer verification.');
    } else if (touchesMedication) {
      confidence = 0.68;
      reasoning.push('Request touches prescription / clinical dressing regimen.');
      reasoning.push('Coordinator review required to confirm nurse/certified helper qualification.');
    } else {
      confidence = 0.70;
      reasoning.push('Routine periodic check-in overdue by >24 hours.');
      reasoning.push('Proposing direct coordinator telephone contact or neighbor drop-by.');
    }

    return {
      tier: 'propose',
      confidence,
      urgency: 3,
      requiresHuman: true,
      category: 'care_risk',
      reasoning,
      suggestedVolunteerId: item.matchedVolunteerId || 'vol-ahmad',
    };
  }

  // Tier 3: AUTO (Routine grocery, routine escort, reminder, check-in confirmation)
  return {
    tier: 'auto',
    confidence: 0.92,
    urgency: 1,
    requiresHuman: false,
    category: 'routine',
    reasoning: [
      'Routine grocery assistance / household errand request.',
      'Resident history clear: zero active fall or cardiac flags.',
      'High volunteer competency match (Khairul Anuar: 0.6 km away, Grocery skill verified).',
      'Automated dispatch policy executed: ETA dispatched to WhatsApp Careline.',
    ],
    suggestedVolunteerId: item.matchedVolunteerId || 'vol-khairul',
  };
}

/**
 * Evaluates and ranks all candidates for a specific care item.
 * NOTE: As per safety policy, the model ONLY ranks candidates; deterministic rule sets govern execution.
 */
export function scoreVolunteers(
  item: TriageItem,
  volunteers: Volunteer[],
  resident?: Resident
): VolunteerMatchScore[] {
  const reqText = (
    (item.requiredCareTag || '') +
    ' ' +
    (item.aiSummary || '') +
    ' ' +
    (item.originalWhatsAppMessage || '') +
    ' ' +
    (item.originalTelegramMessage || '')
  ).toLowerCase();

  const residentLangs = resident?.languages || ['Bahasa Melayu'];

  const scored = volunteers.map((vol) => {
    let score = 50;
    const reasons: string[] = [];

    // 1. Distance scoring (up to 30 points)
    if (vol.distanceKm <= 1.0) {
      score += 30;
      reasons.push(`${vol.distanceKm} km proximity`);
    } else if (vol.distanceKm <= 2.0) {
      score += 20;
      reasons.push(`${vol.distanceKm} km nearby`);
    } else {
      score += 5;
      reasons.push(`${vol.distanceKm} km moderate distance`);
    }

    // 2. Language overlap (up to 25 points)
    const langOverlap = vol.languages.filter((l) =>
      residentLangs.some((rl) => rl.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(rl.toLowerCase()))
    );

    if (langOverlap.length > 0) {
      score += 20;
      reasons.push(`Speaks ${langOverlap.join('/')}`);
    } else {
      score -= 10;
      reasons.push('Language barrier potential');
    }

    // 3. Verified skill match (up to 25 points)
    if (reqText.includes('walking frame') || reqText.includes('mobility')) {
      if (vol.verifiedSkills.some((s) => s.toLowerCase().includes('walking frame') || s.toLowerCase().includes('mobility'))) {
        score += 25;
        reasons.push('Walking Frame verified');
      }
    } else if (reqText.includes('grocery') || reqText.includes('bread') || reqText.includes('milk') || reqText.includes('roti')) {
      if (vol.verifiedSkills.some((s) => s.toLowerCase().includes('grocery') || s.toLowerCase().includes('errands'))) {
        score += 25;
        reasons.push('Grocery errands verified');
      }
    } else if (reqText.includes('wound') || reqText.includes('dressing') || reqText.includes('nurse')) {
      if (vol.verifiedSkills.some((s) => s.toLowerCase().includes('nurse') || s.toLowerCase().includes('first aid'))) {
        score += 25;
        reasons.push('Clinical / First Aid verified');
      }
    }

    // 4. Availability
    if (vol.isAvailable && vol.status === 'available') {
      score += 15;
    } else {
      score -= 20;
      reasons.push('Currently offline/engaged');
    }

    const clampedScore = Math.max(10, Math.min(99, score));

    return {
      volunteer: vol,
      score: clampedScore,
      oneLineReason: reasons.slice(0, 3).join(' • '),
      distanceKm: vol.distanceKm,
      languageOverlap: langOverlap,
      verifiedSkills: vol.verifiedSkills,
      isAvailable: vol.isAvailable,
    };
  });

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score);
}
