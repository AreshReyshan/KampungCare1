# KampungCare — Modern Community Care Coordination (MVP)

> **A consumer-grade, dual-bot care coordination platform purpose-built for aging Malaysian townships in Setapak & Taman Melati, Kuala Lumpur.**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev/)
[![Telegram Bot](https://img.shields.io/badge/Telegram_Bot-Integrated-0088cc.svg)](https://telegram.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp_Careline-Integrated-25D366.svg)](https://whatsapp.com/)

---

## 🎯 What is KampungCare For?

Traditional elderly welfare coordination in Malaysia often relies on chaotic administrative spreadsheets, disjointed chat groups, and fragmented paper logs. Urgent alerts get buried, and pairing volunteers with seniors who have specific mobility needs (e.g., walking frames, post-stroke weakness) takes hours of manual phone calls.

**KampungCare** bridges this gap by providing an **AI-powered, consumer-grade SaaS coordination web app** (inspired by **Linear, Airbnb, and Apple Health**) designed specifically for community leaders, Rukun Tetangga (RT) committees, and neighborhood care networks.

### Core Problems Solved:
1. **Zero Technical Clutter:** Replaced raw database IDs (`tsk_914331`), bracketed unit codes, and cramped multi-panel tables with warm, human-first senior profiles, plain-language summaries, and spacious dark-mode ergonomics.
2. **Dual-Channel Messaging Integration:** Seniors and their Next-of-Kin report needs or emergencies via their preferred app:
   * **Telegram Bot (`@KampungCareBot`)**
   * **WhatsApp Careline (`+60 11-KAMPUNG`)**
3. **Automated AI Triage Feed:** Incoming messages are instantly analyzed, categorized (Emergency, Clinic Escort, Groceries, Check-In), and routed with #1 matched volunteers based on proximity and verified mobility skills.
4. **1-Click Volunteer Matching & Dispatch:** One click assigns the closest helper, updates the ongoing dispatches board, and notifies the senior with an estimated arrival time in their chat.
5. **Resident Care Passports:** Right slide-over drawers maintain comprehensive health profiles, dietary restrictions, emergency contacts, and complete chronological care timelines.

---

## 🚀 Getting Started (How to Run Locally)

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended; verified on Node v24)
* **npm** (v9.0.0 or higher)

### 1. Installation
Clone or navigate to the project directory, then install the dependencies:

```bash
# Navigate to the project root
cd KampungCare_FINAL

# Install dependencies
npm install
```

### 2. Start Development Server
Run the Vite development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

### 3. Build for Production
To generate an optimized, type-checked production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧭 Interactive Demo & Walkthrough Guide

The app comes pre-seeded with realistic Setapak & Taman Melati senior residents (*Pak Samad, Mrs. Tan Ah Mooi, Mak Cik Rokiah, Uncle Lim, Madam Devi, Haji Othman*) and verified volunteers (*Ahmad Danial, Siti Nurhaliza, Jason Tan, Priya Ramanathan, Khairul Anuar*).

### 1. Testing the Telegram Bot Simulator
1. Click **`Send Telegram Test`** in the bottom-left sidebar or the top header.
2. The Telegram mobile simulator drawer will slide in from the right.
3. Tap **Preset #1 (Clinic Escort)** or **Preset #3 (Emergency Fall Trigger)**, or type your own message.
4. Watch the bot respond instantly and see the request automatically ingest into the **Triage Inbox**!

### 2. Testing the WhatsApp Careline Simulator
1. Click **`Send WhatsApp Test`** in the sidebar or top header.
2. The authentic WhatsApp Dark Mode simulator drawer will open.
3. Tap **Preset #2 (Grocery Assistance)** or write a custom message.
4. The WhatsApp Careline Bot replies immediately and routes a new WhatsApp request into the action feed.

### 3. Testing 1-Click Volunteer Dispatch
1. In the **Triage Inbox**, find Mrs. Tan Ah Mooi's clinic request.
2. Note the **Magic Match box** highlighting **Ahmad Danial** (`0.8 km away • Walking Frame Verified`).
3. Click **`[ Assign Ahmad ]`**.
4. The card transitions smoothly to **Active Care**, triggers a toast notification, and automatically messages Mrs. Tan with Ahmad's 15-minute ETA.

### 4. Testing Emergency 999 Resolution
1. Locate Pak Samad's **Urgent Emergency Alert Banner** at the top of the Triage Inbox.
2. Click **`[ Resolve & Log Call ]`**.
3. Confirm paramedic (999) dispatch and Next-of-Kin coordination, then click **`Confirm & Log Resolution`**.
4. The emergency clears from the inbox, posts a resolution update to the chat, and logs directly into Pak Samad's Care Passport timeline.

### 5. Testing Resident Care Passports
1. Click on **any resident's name or avatar** from anywhere in the app.
2. The **Care Passport Drawer** slides in, revealing:
   * Mobility badges & detailed care needs (medications, diets, fall prevention).
   * 1-Click Next-of-Kin alert buttons (Telegram, WhatsApp, Phone).
   * Full chronological care history.

### 6. Completing a Visit & Outcome Logging
1. Switch to the **Active Care** tab in the sidebar.
2. On any in-progress visit (e.g. Madam Devi's diabetic dressing check), click **`[ Complete Visit & Log Outcome ]`**.
3. Select an outcome pill (*"Visit went smoothly"*, *"Medication updated"*, or *"Needs follow-up"*), enter optional field notes, and submit.
4. Enjoy the celebratory confetti animation and inspect the updated Care Passport!

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI component model with state coordination |
| **TypeScript** | Strict type safety across residents, volunteers, dispatches, and messages |
| **Tailwind CSS 3.4** | Custom dark mode theme, geometric sans typography, and fluid responsive layouts |
| **Vite 8** | Lightning-fast HMR and bundle compilation (<2 seconds) |
| **Lucide React** | Clean, minimalist iconography (Linear / Apple Health aesthetic) |
| **Canvas Confetti** | Tactile feedback celebration upon task completion |

### Directory Structure
```
KampungCare_FINAL/
├── public/                 # Static assets & icons
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx             # Left navigation with counters & test triggers
│   │   ├── Header.tsx              # Spacious top canvas bar with search & channel buttons
│   │   ├── TriageInbox.tsx         # Unified action feed with emergencies & magic match
│   │   ├── ActiveDispatches.tsx    # Live dispatches board & visit completion
│   │   ├── ResidentsGrid.tsx       # Grid of senior care passport previews
│   │   ├── VolunteersGrid.tsx      # Helper directory with proximity & skill tags
│   │   ├── CarePassportDrawer.tsx  # Deep medical, mobility, & timeline drawer
│   │   ├── TelegramSimulator.tsx   # Realistic Telegram mobile chat simulator
│   │   ├── WhatsAppSimulator.tsx   # Realistic WhatsApp mobile chat simulator
│   │   ├── ResolveEmergencyModal.tsx# 999 paramedic & NOK call logger
│   │   ├── CompleteVisitModal.tsx  # Visit outcome pills & care loop closer
│   │   ├── QuickCheckInModal.tsx   # Routine check-in logger
│   │   ├── VolunteerSelectModal.tsx# Alternative helper selector
│   │   └── Toast.tsx               # Modern glassmorphism toast notifications
│   ├── data/
│   │   └── mockData.ts             # Realistic Setapak/Melati township seed data
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces for all domain entities
│   ├── App.tsx                     # Main application orchestrator & state machine
│   ├── index.css                   # Tailwind base, dark mode scrollbars & tokens
│   └── main.tsx                    # React DOM entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🛡️ License

KampungCare MVP is open-source and intended for community welfare, eldercare coordination, and township social innovation.
