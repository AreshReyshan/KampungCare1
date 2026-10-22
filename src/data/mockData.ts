import type { Resident, Volunteer, TriageItem, ActiveDispatch, TelegramMessage, WhatsAppMessage } from '../types';

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-pak-samad',
    name: 'Pak Samad (Samad bin Abdullah)',
    preferredName: 'Pak Samad',
    age: 78,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&auto=format&fit=crop&q=80',
    address: 'Blok C-04-12, PPR Sri Melati',
    neighborhood: 'Taman Melati',
    phone: '+60 17-334 8921',
    languages: ['Bahasa Melayu'],
    mobilityLevel: 'High Fall Risk • Requires Assistance',
    mobilityBadge: 'High Fall Risk',
    careNeeds: [
      {
        title: 'Fall Risk Caution',
        description: 'History of bathroom slips; requires grab-bar checks and non-slip mats.',
        type: 'mobility'
      },
      {
        title: 'Hypertension & Cardiac Follow-up',
        description: 'Amlodipine 10mg daily at 8:00 AM. Reports occasional chest tightness.',
        type: 'medication'
      },
      {
        title: 'Low Sodium Diet',
        description: 'Restricted salt intake monitored by family members.',
        type: 'diet'
      }
    ],
    emergencyContact: {
      name: 'Zainab binti Samad',
      relationship: 'Daughter',
      phone: '+60 12-345 6789',
      telegramUsername: '@zainab_samad',
      whatsappNumber: '+60 12-345 6789'
    },
    lastCheckIn: 'Today, 20 mins ago',
    timeline: [
      {
        id: 'tl-1',
        date: 'Today',
        time: 'Just now',
        title: 'Emergency Fall Alert Triggered',
        description: 'Reported slip in bathroom and chest tightness. Auto-routed 999 response instructions and alerted daughter Zainab.',
        type: 'emergency_resolved',
        outcome: '999 paramedic dispatch coordinated'
      },
      {
        id: 'tl-2',
        date: '18 Oct 2026',
        time: '10:15 AM',
        title: 'Bi-Weekly Health Check',
        description: 'Volunteer Siti Nurhaliza conducted BP check (138/86 mmHg). Pak Samad was cheerful and took his prescribed medication.',
        type: 'visit_completed',
        volunteerName: 'Siti Nurhaliza',
        outcome: 'Normal vitals, cheerful'
      },
      {
        id: 'tl-3',
        date: '12 Oct 2026',
        time: '3:00 PM',
        title: 'Grocery Drop-off',
        description: 'Delivered oats, low-fat milk, and fresh papaya ordered by daughter Zainab.',
        type: 'visit_completed',
        volunteerName: 'Ahmad Danial',
        outcome: 'Delivered successfully'
      }
    ]
  },
  {
    id: 'res-tan-ah-mooi',
    name: 'Mrs. Tan Ah Mooi (陈亚妹)',
    preferredName: 'Mrs. Tan',
    age: 74,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    address: 'No. 28, Jalan 3/23A, Danau Kota',
    neighborhood: 'Danau Kota, Setapak',
    phone: '+60 12-882 1049',
    languages: ['Bahasa Melayu', 'Cantonese', 'Mandarin'],
    mobilityLevel: 'Uses 4-Point Walking Frame',
    mobilityBadge: 'Walking Frame Assist',
    careNeeds: [
      {
        title: 'Uses 4-Point Walking Frame',
        description: 'Needs physical stability support on stairs and clinic curb ramps.',
        type: 'mobility'
      },
      {
        title: 'Poliklinik Setapak Regular',
        description: 'Monthly chronic disease check-up every 3rd Thursday.',
        type: 'medication'
      },
      {
        title: 'Hearing Assistance',
        description: 'Mild bilateral hearing loss. Speak clearly facing her.',
        type: 'sensory'
      }
    ],
    emergencyContact: {
      name: 'Robert Tan',
      relationship: 'Son (Works in Petaling Jaya)',
      phone: '+60 17-889 9221',
      telegramUsername: '@roberttan_kl',
      whatsappNumber: '+60 17-889 9221'
    },
    lastCheckIn: 'Yesterday, 4:30 PM',
    timeline: [
      {
        id: 'tl-tan-1',
        date: 'Today',
        time: '9:12 AM',
        title: 'Request for Clinic Escort',
        description: 'Requested volunteer escort to Poliklinik Setapak for Thursday 9:30 AM appointment.',
        type: 'telegram_received'
      },
      {
        id: 'tl-tan-2',
        date: '14 Oct 2026',
        time: '11:00 AM',
        title: 'Safety Grab Bar Inspection',
        description: 'KampungCare volunteer checked bathroom safety bars. Secure and functional.',
        type: 'visit_completed',
        volunteerName: 'Ahmad Danial',
        outcome: 'Grab bars firm'
      }
    ]
  },
  {
    id: 'res-mak-cik-rokiah',
    name: 'Mak Cik Rokiah (Rokiah binti Ismail)',
    preferredName: 'Mak Cik Rokiah',
    age: 71,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: 'Blok B-08-04, Residensi Melati',
    neighborhood: 'Taman Melati',
    phone: '+60 19-332 2114',
    languages: ['Bahasa Melayu'],
    mobilityLevel: 'Independent Indoors • Mild Knee Arthritis',
    mobilityBadge: 'Mild Knee Arthritis',
    careNeeds: [
      {
        title: 'Hypertension Monitoring',
        description: 'Daily morning Losartan 50mg. Needs routine BP checks every 48 hours.',
        type: 'medication'
      },
      {
        title: 'Lives Alone',
        description: 'Requires friendly social wellness check-in every 2-3 days.',
        type: 'social'
      }
    ],
    emergencyContact: {
      name: 'Azman bin Razali',
      relationship: 'Son (Lives in Shah Alam)',
      phone: '+60 19-332 2114',
      telegramUsername: '@azman_razali',
      whatsappNumber: '+60 19-332 2114'
    },
    lastCheckIn: '2 days ago',
    isOverdue: true,
    timeline: [
      {
        id: 'tl-rok-1',
        date: '19 Oct 2026',
        time: '11:30 AM',
        title: 'Routine Health Check-in',
        description: 'BP 132/84 mmHg. Noted slight knee stiffness due to rainy weather.',
        type: 'checkin_logged',
        volunteerName: 'Priya Ramanathan',
        outcome: 'Vitals stable'
      }
    ]
  },
  {
    id: 'res-uncle-lim',
    name: 'Uncle Lim (Lim Kok Leong)',
    preferredName: 'Uncle Lim',
    age: 79,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: 'Unit 15-08, PV 15 Platinum Lake',
    neighborhood: 'Danau Kota, Setapak',
    phone: '+60 16-554 4332',
    languages: ['English', 'Cantonese', 'Hokkien', 'Bahasa Melayu'],
    mobilityLevel: 'Independent • Mild Cataract Vision Loss',
    mobilityBadge: 'Vision Assist',
    careNeeds: [
      {
        title: 'Mild Visual Impairment',
        description: 'Needs help reading small expiration dates and prescription labels.',
        type: 'sensory'
      },
      {
        title: 'Grocery Support',
        description: 'Prefers assistance carrying heavy items (rice, cooking oil, milk cartons).',
        type: 'mobility'
      }
    ],
    emergencyContact: {
      name: 'Jenny Lim',
      relationship: 'Daughter',
      phone: '+60 16-221 4488',
      telegramUsername: '@jennylim_kl',
      whatsappNumber: '+60 16-221 4488'
    },
    lastCheckIn: 'Yesterday, 2:15 PM',
    timeline: [
      {
        id: 'tl-lim-1',
        date: '17 Oct 2026',
        time: '4:00 PM',
        title: 'Prescription Label Clarification',
        description: 'Volunteer read new eye drops regimen instructions and organized medicine pillbox.',
        type: 'visit_completed',
        volunteerName: 'Jason Tan',
        outcome: 'Pillbox sorted for 2 weeks'
      }
    ]
  },
  {
    id: 'res-madam-devi',
    name: 'Madam Devi a/p Subramaniam',
    preferredName: 'Madam Devi',
    age: 76,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: 'No. 45, Lorong Gombak Permai 2',
    neighborhood: 'Jalan Gombak',
    phone: '+60 13-776 6554',
    languages: ['Tamil', 'English', 'Bahasa Melayu'],
    mobilityLevel: 'Diabetic Foot Care • Uses Walking Cane',
    mobilityBadge: 'Cane User',
    careNeeds: [
      {
        title: 'Diabetic Foot Wound Care',
        description: 'Daily sterile dressing inspection on left heel.',
        type: 'medication'
      },
      {
        title: 'Klinik Kesihatan Setapak Follow-up',
        description: 'Requires vehicle escort for monthly endocrinology review.',
        type: 'mobility'
      }
    ],
    emergencyContact: {
      name: 'Suresh Kumar',
      relationship: 'Son',
      phone: '+60 13-776 6554',
      telegramUsername: '@sureshkumar_kl',
      whatsappNumber: '+60 13-776 6554'
    },
    lastCheckIn: 'Today, 8:00 AM',
    timeline: [
      {
        id: 'tl-dev-1',
        date: 'Today',
        time: '8:30 AM',
        title: 'Morning Wound Dressing Check',
        description: 'Volunteer nurse Siti arrived to inspect wound healing progress. Clean and non-infected.',
        type: 'visit_completed',
        volunteerName: 'Siti Nurhaliza',
        outcome: 'Healing well, dressing renewed'
      }
    ]
  },
  {
    id: 'res-haji-othman',
    name: 'Haji Othman bin Kassim',
    preferredName: 'Haji Othman',
    age: 82,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    address: 'Blok D-02-05, Teratai Mewah',
    neighborhood: 'Setapak',
    phone: '+60 12-998 8776',
    languages: ['Bahasa Melayu', 'Arabic'],
    mobilityLevel: 'Post-Stroke Recovery • Slow Gait',
    mobilityBadge: 'Post-Stroke Assist',
    careNeeds: [
      {
        title: 'Mild Right-Side Weakness',
        description: 'Recovered from mild ischemic stroke 2 years ago. Needs companion on outdoor walks.',
        type: 'mobility'
      },
      {
        title: 'Surau Escort Companion',
        description: 'Enjoys Friday prayers at Masjid Jamiul Ehsan with a companion.',
        type: 'social'
      }
    ],
    emergencyContact: {
      name: 'Faridah binti Othman',
      relationship: 'Daughter (Teacher in Wangsa Maju)',
      phone: '+60 12-998 8776',
      telegramUsername: '@faridah_othman',
      whatsappNumber: '+60 12-998 8776'
    },
    lastCheckIn: '2 days ago',
    isOverdue: true,
    timeline: [
      {
        id: 'tl-oth-1',
        date: '18 Oct 2026',
        time: '5:30 PM',
        title: 'Evening Mobility Walk',
        description: 'Walked 400m around neighborhood park with Ahmad Danial. Gait steady.',
        type: 'visit_completed',
        volunteerName: 'Ahmad Danial',
        outcome: 'Completed 400m with no dizziness'
      }
    ]
  }
];

export const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-ahmad',
    name: 'Ahmad Danial',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+60 18-912 3450',
    telegramHandle: '@ahmad_danial',
    whatsappNumber: '+60 18-912 3450',
    distanceKm: 0.8,
    neighborhood: 'Melati Utama (Near TAR UMT)',
    isAvailable: true,
    status: 'available',
    completedVisits: 42,
    rating: 4.9,
    languages: ['Bahasa Melayu', 'English'],
    verifiedSkills: ['Walking Frame Verified', 'First Aid Certified', 'Physical Mobility Support'],
    bio: 'TAR UMT Postgraduate student. Active Rukun Tetangga volunteer who loves spending mornings assisting community seniors.'
  },
  {
    id: 'vol-siti',
    name: 'Siti Nurhaliza',
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    phone: '+60 13-221 9884',
    telegramHandle: '@siti_care_kl',
    whatsappNumber: '+60 13-221 9884',
    distanceKm: 1.2,
    neighborhood: 'Danau Kota, Setapak',
    isAvailable: true,
    status: 'on_visit',
    completedVisits: 68,
    rating: 5.0,
    languages: ['Bahasa Melayu', 'English'],
    verifiedSkills: ['Registered Nurse Assist', 'CPR Certified', 'Medication Management', 'Blood Pressure Check'],
    bio: 'Former clinical nurse. Specialises in chronic vitals monitoring, sterile dressing, and geriatric medication compliance.'
  },
  {
    id: 'vol-jason',
    name: 'Jason Tan Jun Wei',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+60 17-665 4321',
    telegramHandle: '@jasontan_jw',
    whatsappNumber: '+60 17-665 4321',
    distanceKm: 1.5,
    neighborhood: 'Wangsa Maju / Setapak border',
    isAvailable: true,
    status: 'available',
    completedVisits: 31,
    rating: 4.9,
    languages: ['English', 'Cantonese', 'Bahasa Melayu', 'Mandarin'],
    verifiedSkills: ['Wheelchair Transport', 'Owns Car (Spacious Boot)', 'Hospital Escort'],
    bio: 'Freelance UX designer working from home. Flexible schedule for hospital and clinic transport escorts.'
  },
  {
    id: 'vol-priya',
    name: 'Priya Ramanathan',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+60 11-2334 5567',
    telegramHandle: '@priya_ram',
    whatsappNumber: '+60 11-2334 5567',
    distanceKm: 0.9,
    neighborhood: 'Setapak Central area',
    isAvailable: true,
    status: 'available',
    completedVisits: 27,
    rating: 5.0,
    languages: ['English', 'Tamil', 'Bahasa Melayu'],
    verifiedSkills: ['Blood Pressure Monitoring', 'Diabetic Diet Advice', 'First Aid Certified'],
    bio: 'Final year medical student passionate about preventative healthcare and dementia care coordination.'
  },
  {
    id: 'vol-khairul',
    name: 'Khairul Anuar',
    age: 38,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+60 19-876 5432',
    telegramHandle: '@khairul_rt',
    whatsappNumber: '+60 19-876 5432',
    distanceKm: 2.1,
    neighborhood: 'Taman Melati',
    isAvailable: false,
    status: 'offline',
    completedVisits: 54,
    rating: 4.8,
    languages: ['Bahasa Melayu'],
    verifiedSkills: ['Grocery & Heavy Errands', 'Motorcycle & Car', 'Handyman Safety Checks'],
    bio: 'Local community committee member. Coordinates emergency home maintenance and grocery deliveries.'
  }
];

export const INITIAL_TRIAGE_ITEMS: TriageItem[] = [
  {
    id: 'trg-em-1',
    type: 'emergency',
    channel: 'telegram',
    priority: 'emergency',
    residentId: 'res-pak-samad',
    residentName: 'Pak Samad',
    residentAvatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&auto=format&fit=crop&q=80',
    residentAge: 78,
    residentNeighborhood: 'PPR Sri Melati, Taman Melati',
    timestamp: '2026-10-22T00:35:00',
    timeAgo: 'Just now',
    emergencySummary: 'Reported a fall and chest pain via Telegram just now.',
    emergencyActionTag: 'Auto-replied 999 instructions & alerted daughter (Zainab)',
    emergencyTriggerDetails: 'Bathroom slip detected via Telegram message. Bot auto-replied emergency protocol and dispatched alert to Next-of-Kin Zainab.'
  },
  {
    id: 'trg-req-1',
    type: 'telegram_request',
    channel: 'telegram',
    priority: 'normal',
    residentId: 'res-tan-ah-mooi',
    residentName: 'Mrs. Tan Ah Mooi',
    residentAvatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    residentAge: 74,
    residentNeighborhood: 'Danau Kota, Setapak',
    timestamp: '2026-10-22T00:20:00',
    timeAgo: '20 mins ago',
    originalTelegramMessage: 'Tolong carikan orang teman Mak Cik Tan pergi klinik Khamis pagi pukul 9.30, dia pakai walking frame.',
    aiSummary: 'Needs clinic escort to Poliklinik Setapak • Thu 9:30 AM',
    requiredCareTag: 'Walking Frame Assist',
    scheduledTime: 'Thursday, 9:30 AM',
    matchedVolunteerId: 'vol-ahmad'
  },
  {
    id: 'trg-req-2',
    type: 'whatsapp_request',
    channel: 'whatsapp',
    priority: 'normal',
    residentId: 'res-uncle-lim',
    residentName: 'Uncle Lim',
    residentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    residentAge: 79,
    residentNeighborhood: 'Danau Kota, Setapak',
    timestamp: '2026-10-22T00:15:00',
    timeAgo: '25 mins ago',
    originalWhatsAppMessage: 'Good day, Uncle Lim here. Need assistance to buy wholemeal bread and low sugar soy milk tomorrow.',
    aiSummary: 'Grocery Assistance (Bread & Low-Sugar Milk) • Fri Morning',
    requiredCareTag: 'Vision & Grocery Assist',
    scheduledTime: 'Friday, 9:00 AM',
    matchedVolunteerId: 'vol-khairul'
  },
  {
    id: 'trg-od-1',
    type: 'overdue_checkin',
    priority: 'high',
    residentId: 'res-mak-cik-rokiah',
    residentName: 'Mak Cik Rokiah',
    residentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    residentAge: 71,
    residentNeighborhood: 'Residensi Melati, Taman Melati',
    timestamp: '2026-10-21T09:00:00',
    timeAgo: '1 day overdue',
    overdueDuration: '1 day overdue',
    nokContact: {
      name: 'Azman (Son)',
      relationship: 'Son',
      phone: '+60 19-332 2114'
    },
    lastNotes: 'Routine 48-hour hypertension BP check is pending. Lives alone.'
  },
  {
    id: 'trg-od-2',
    type: 'overdue_checkin',
    priority: 'normal',
    residentId: 'res-haji-othman',
    residentName: 'Haji Othman',
    residentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    residentAge: 82,
    residentNeighborhood: 'Teratai Mewah, Setapak',
    timestamp: '2026-10-20T17:00:00',
    timeAgo: '2 days overdue',
    overdueDuration: '2 days overdue',
    nokContact: {
      name: 'Faridah (Daughter)',
      relationship: 'Daughter',
      phone: '+60 12-998 8776'
    },
    lastNotes: 'Post-stroke gait check and surau companion follow-up.'
  }
];

export const INITIAL_ACTIVE_DISPATCHES: ActiveDispatch[] = [
  {
    id: 'disp-1',
    channel: 'whatsapp',
    residentId: 'res-madam-devi',
    residentName: 'Madam Devi',
    residentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    residentAddress: 'No. 45, Lorong Gombak Permai 2',
    volunteerId: 'vol-siti',
    volunteerName: 'Siti Nurhaliza',
    volunteerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    volunteerPhone: '+60 13-221 9884',
    serviceType: 'Diabetic Dressing & Vitals Check',
    carePill: 'Clinical Nurse Assist',
    dispatchedAt: '08:15 AM',
    timeAgo: '35 mins ago',
    estimatedArrival: 'Arrived • In Progress',
    status: 'in_progress',
    notes: 'Checking left heel sterile dressing and recording fasting blood sugar.'
  },
  {
    id: 'disp-2',
    channel: 'telegram',
    residentId: 'res-uncle-lim',
    residentName: 'Uncle Lim',
    residentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    residentAddress: 'Unit 15-08, PV 15 Platinum Lake',
    volunteerId: 'vol-jason',
    volunteerName: 'Jason Tan',
    volunteerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    volunteerPhone: '+60 17-665 4321',
    serviceType: 'Prescription Refill & Eye Drop Reading',
    carePill: 'Vision Assist & Transport',
    dispatchedAt: '08:45 AM',
    timeAgo: '10 mins ago',
    estimatedArrival: 'En route • Arriving in 5 mins',
    status: 'dispatched',
    notes: 'Picking up eye medication from Caring Pharmacy Danau Kota.'
  }
];

export const INITIAL_TELEGRAM_MESSAGES: TelegramMessage[] = [
  {
    id: 'tg-1',
    sender: 'system',
    senderName: 'System',
    text: 'Selamat datang ke KampungCare Bot Setapak & Taman Melati. Sistem sedia menerima permohonan bantuan atau laporan kecemasan komuniti.',
    time: '08:00 AM'
  },
  {
    id: 'tg-2',
    sender: 'user',
    senderName: 'Robert Tan (for Mrs. Tan)',
    text: 'Tolong carikan orang teman Mak Cik Tan pergi klinik Khamis pagi pukul 9.30, dia pakai walking frame.',
    time: '09:12 AM',
    status: 'read'
  },
  {
    id: 'tg-3',
    sender: 'bot',
    senderName: 'KampungCare Bot',
    text: 'Terima kasih! Kami sedang mencarikan sukarelawan berdekatan untuk membantu anda.',
    time: '09:12 AM'
  }
];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'wa-1',
    sender: 'system',
    senderName: 'System',
    text: 'Selamat datang ke KampungCare WhatsApp Careline (Setapak & Taman Melati). Hantarkan mesej untuk memohon sukarelawan atau laporkan kecemasan warga emas.',
    time: '08:00 AM'
  },
  {
    id: 'wa-2',
    sender: 'user',
    senderName: 'Uncle Lim (PV15)',
    text: 'Good day, Uncle Lim here. Need assistance to buy wholemeal bread and low sugar soy milk tomorrow.',
    time: '09:25 AM',
    status: 'read'
  },
  {
    id: 'wa-3',
    sender: 'bot',
    senderName: 'KampungCare WhatsApp Careline',
    text: 'Terima kasih Uncle Lim! Permohonan barangan dapur anda telah diterima dan sedang dipadankan dengan sukarelawan KampungCare.',
    time: '09:25 AM'
  }
];
