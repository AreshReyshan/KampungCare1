import type { TriageItem, Volunteer, Resident, ActiveDispatch } from '../types';

export type SimulationSpeed = 1 | 4 | 12;

export type AutonomyTier = 'auto' | 'propose' | 'human';

export interface DecisionResult {
  tier: AutonomyTier;
  confidence: number; // 0.00 to 1.00
  urgency: number; // 1 (low/routine), 2 (medium), 3 (elevated/care-risk), 4 (emergency/SOS)
  reasoning: string[];
  suggestedVolunteerId?: string;
  suggestedVolunteer?: Volunteer;
  requiresHuman?: boolean;
  category: 'routine' | 'care_risk' | 'emergency' | 'sensor_inactivity';
}

export interface VolunteerMatchScore {
  volunteer: Volunteer;
  score: number; // 0 to 100
  oneLineReason: string;
  distanceKm: number;
  languageOverlap: string[];
  verifiedSkills: string[];
  isAvailable: boolean;
}

export interface AuditEntry {
  id: string;
  virtualTime: number; // in seconds from start of simulation
  timestampLabel: string; // "0:20"
  realTime: string; // "10:14:20"
  actor: 'AI' | 'Human';
  tier: AutonomyTier | 'system';
  title: string;
  reasoning: string[];
  metadata?: Record<string, unknown>;
  undo?: () => void;
  undone?: boolean;
}

export interface AutonomyRailEvent {
  id: string;
  virtualTime: number;
  timestampLabel: string;
  tier: AutonomyTier;
  title: string;
  subtitle: string;
  confidence: number;
  urgency: number;
  details: string[];
  undoActionId?: string;
  expiresAtVirtualTime?: number;
  undone?: boolean;
}

export interface BeatDefinition {
  number: number;
  totalBeats: number;
  atSeconds: number;
  timeLabel: string; // "0:20"
  label: string;
  tier: AutonomyTier | 'idle';
  description: string;
  run: (ctx: ScenarioContext) => void;
}

export interface ScenarioContext {
  virtualTime: number;
  speed: SimulationSpeed;
  residents: Resident[];
  volunteers: Volunteer[];
  triageItems: TriageItem[];
  activeDispatches: ActiveDispatch[];
  setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
  setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
  setTriageItems: React.Dispatch<React.SetStateAction<TriageItem[]>>;
  setActiveDispatches: React.Dispatch<React.SetStateAction<ActiveDispatch[]>>;
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'emergency' | 'warning', onUndo?: () => void) => void;
  addAuditLog: (entry: Omit<AuditEntry, 'id' | 'virtualTime' | 'timestampLabel' | 'realTime'> & { undo?: () => void }) => string;
  addRailEvent: (event: Omit<AutonomyRailEvent, 'id' | 'virtualTime' | 'timestampLabel'>) => void;
  sendTelegramSimMessage: (text: string, isFromUser?: boolean) => void;
  sendWhatsAppSimMessage: (text: string, isFromUser?: boolean) => void;
  openAuditDrawer: () => void;
  triggerRingFall: () => void;
}

export interface RingState {
  residentId: string;
  residentName: string;
  heartRate: number;
  spO2: number;
  skinTemp: number; // in Celsius
  batteryPercent: number;
  sparkline: number[]; // 60 values
  sensitivity: number; // 1 to 10 scale (defaults to 9)
  falseAlarmCount: number;
  fallStatus: 'idle' | 'countdown' | 'escalated' | 'dismissed';
  countdownRemaining: number; // 30 seconds
}
