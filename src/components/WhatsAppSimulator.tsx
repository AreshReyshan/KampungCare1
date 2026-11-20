import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Paperclip, 
  CheckCheck, 
  Sparkles, 
  Smile, 
  MessageSquare
} from 'lucide-react';
import type { WhatsAppMessage } from '../types';
import { useSwipe } from '../hooks/useSwipe';

interface WhatsAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  messages: WhatsAppMessage[];
  onSendMessage: (text: string) => void;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipe({
    onSwipeRight: onClose,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim()) return;

    onSendMessage(text.trim());
    setInputText('');
  };

  const demoPresets = [
    {
      id: 'wound_care',
      label: 'Home Nurse Dressing (EN)',
      sub: 'Madam Devi • Diabetic Ulcer',
      text: 'Good morning KampungCare, Madam Devi here from Gombak Setia. Need nurse volunteer for routine diabetic wound dressing change today.',
      tag: 'Medical'
    },
    {
      id: 'groceries',
      label: 'Grocery Assistance (EN)',
      sub: 'Uncle Lim • PV 15 Platinum Lake',
      text: 'Good day, Uncle Lim here from PV15. Can someone help buy bread, eggs and low-sugar soy milk tomorrow morning?',
      tag: 'Grocery'
    },
    {
      id: 'emergency',
      label: 'Emergency Fall Trigger ⚠️',
      sub: 'Pak Samad • Bilik Air & Sakit Dada',
      text: 'TOLONG KECEMASAN! Pak Samad baru jatuh di bilik air dan mengadu sakit dada, tolong hantar bantuan segera!',
      tag: 'Emergency Trigger'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* WhatsApp Device Drawer */}
      <div 
        {...swipeHandlers}
        className="absolute inset-y-0 right-0 max-w-lg w-full bg-white text-slate-900 shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-slate-200 touch-pan-y"
      >
        {/* WhatsApp Header */}
        <div className="px-5 py-3.5 bg-[#075e54] text-white flex items-center justify-between shadow-md shrink-0 border-b border-[#054c44]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white shadow-inner ring-2 ring-white/30 backdrop-blur-xs">
                <MessageSquare className="w-6 h-6 fill-current" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#075e54]"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-base tracking-tight text-white">
                  KampungCare Careline
                </h3>
                <span className="font-mono bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                  Official
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-white font-medium">WhatsApp Business</span>
                <span>•</span>
                <span className="text-emerald-200">+60 11-KAMPUNG</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Demo Presets Banner */}
        <div className="bg-emerald-50/60 border-b border-emerald-100 p-3.5 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Quick demo presets
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Tap to test live bot</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {demoPresets.map((preset) => {
              const isEm = preset.id === 'emergency';

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSend(preset.text)}
                  className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs shadow-2xs ${
                    isEm
                      ? 'bg-pink-50 hover:bg-pink-100/80 border-pink-200 text-pink-900'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="font-semibold text-xs truncate text-slate-900">{preset.label}</div>
                    <div className="text-[11px] text-slate-500 truncate">{preset.sub}</div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium ${
                      isEm
                        ? 'bg-[#ec4899] text-white shadow-2xs font-bold'
                        : 'bg-emerald-600 text-white shadow-2xs font-semibold'
                    }`}
                  >
                    Send preset
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Chat Feed */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#efeae2]"
          style={{
            backgroundImage: `radial-gradient(rgba(7, 94, 84, 0.08) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <div className="bg-white/90 border border-slate-200 text-slate-600 text-xs px-4 py-1.5 rounded-xl max-w-sm text-center shadow-xs leading-relaxed">
                    🔒 {msg.text}
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';
            const isEm = msg.isEmergency;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs relative ${
                    isUser
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60'
                      : isEm
                      ? 'bg-pink-50 border border-pink-300 text-pink-950 font-medium rounded-tl-xs shadow-xs'
                      : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200 shadow-2xs'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
                      <span>{msg.senderName}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-mono font-semibold">BOT</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>

                  <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] text-slate-500 font-mono">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Chat Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Attach photo/prescription"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message KampungCare Careline..."
              className="flex-1 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 border border-slate-200 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white shadow-inner transition-all"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setInputText('Mak Cik Tan perlukan bantuan teman ke klinik');
                }}
                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                title="Voice input simulator"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-2 font-sans">
            Incoming WhatsApp messages trigger AI Triage and Volunteer Proximity Match.
          </p>
        </div>
      </div>
    </div>
  );
};
