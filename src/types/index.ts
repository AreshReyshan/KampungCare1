export type PriorityLevel = 'emergency' | 'high' | 'normal' | 'low';

export type TriageCategory = 'emergency' | 'telegram_request' | 'whatsapp_request' | 'overdue_checkin';

export interface Resident {
  id: string;
  name: string;
  preferredName?: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  address: string;
  neighborhood: string;
  phone: string;
  languages: string[];
  mobilityLevel: string;
  mobilityBadge: string;
  careNeeds: {
    title: string;
    description: string;
    type: 'mobility' | 'medication' | 'diet' | 'sensory' | 'social';
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    telegramUsername?: string;
    whatsappNumber?: string;
  };
  lastCheckIn: string;
  isOverdue?: boolean;
  timeline: CareTimelineEvent[];
}

export interface CareTimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'visit_completed' | 'emergency_resolved' | 'checkin_logged' | 'telegram_received' | 'whatsapp_received' | 'medication_update';
  volunteerName?: string;
  outcome?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  age: number;
  avatar: string;
  phone: string;
  telegramHandle: string;
  whatsappNumber: string;
  distanceKm: number;
  neighborhood: string;
  isAvailable: boolean;
  status: 'available' | 'on_visit' | 'offline';
  completedVisits: number;
  rating: number;
  languages: string[];
  verifiedSkills: string[];
  bio: string;
}

export interface TriageItem {
  id: string;
  type: TriageCategory;
  channel?: 'telegram' | 'whatsapp';
  priority: PriorityLevel;
  residentId: string;
  residentName: string;
  residentAvatar: string;
  residentAge: number;
  residentNeighborhood: string;
  timestamp: string;
  timeAgo: string;
  // Emergency specific
  emergencySummary?: string;
  emergencyActionTag?: string;
  emergencyTriggerDetails?: string;
  // Messaging Request specific
  originalTelegramMessage?: string;
  originalWhatsAppMessage?: string;
  aiSummary?: string;
  requiredCareTag?: string;
  scheduledTime?: string;
  matchedVolunteerId?: string;
  // Overdue Check-in specific
  overdueDuration?: string;
  nokContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  lastNotes?: string;
}

export interface ActiveDispatch {
  id: string;
  triageId?: string;
  channel?: 'telegram' | 'whatsapp';
  residentId: string;
  residentName: string;
  residentAvatar: string;
  residentAddress: string;
  volunteerId: string;
  volunteerName: string;
  volunteerAvatar: string;
  volunteerPhone: string;
  serviceType: string;
  carePill: string;
  dispatchedAt: string;
  timeAgo: string;
  estimatedArrival: string;
  status: 'dispatched' | 'in_progress' | 'completed';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  senderName: string;
  text: string;
  time: string;
  isEmergency?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export type TelegramMessage = ChatMessage;
export type WhatsAppMessage = ChatMessage;

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'emergency' | 'warning';
}
