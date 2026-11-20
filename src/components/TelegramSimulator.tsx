import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Paperclip, 
  CheckCheck, 
  Sparkles
} from 'lucide-react';
import type { TelegramMessage } from '../types';

interface TelegramSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  messages: TelegramMessage[];
  onSendMessage: (text: string) => void;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      id: 'clinic',
      label: 'Clinic Escort (BM)',
      sub: 'Mrs. Tan Ah Mooi • Walking Frame',
      text: 'Tolong carikan orang teman Mak Cik Tan pergi klinik Khamis pagi pukul 9.30, dia pakai walking frame.',
      tag: 'Regular Request'
    },
    {
      id: 'grocery',
      label: 'Grocery Help (EN)',
      sub: 'Uncle Lim • Vision Assist',
      text: 'Hi, Uncle Lim here. Can someone help buy bread and milk tomorrow morning?',
      tag: 'Regular Request'
    },
    {
      id: 'emergency',
      label: 'Emergency Fall Trigger ⚠️',
      sub: 'Pak Samad • Fall & Chest Pain',
      text: 'Tolong! Pak Samad jatuh dekat bilik air dan sakit dada!',
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

      {/* Drawer Device Container */}
      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white text-slate-900 shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-slate-200">
        {/* Telegram Header (Lagoon Blue) */}
        <div className="px-5 py-3.5 bg-[#0284c7] text-white flex items-center justify-between shadow-md shrink-0 border-b border-[#0369a1]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-white/30 backdrop-blur-xs">
                <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0284c7]"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-base tracking-tight text-white">
                  KampungCare Bot
                </h3>
                <span className="font-mono bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                  bot
                </span>
              </div>
              <p className="text-xs text-sky-100 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-white font-medium">@KampungCareBot</span>
                <span>•</span>
                <span className="text-emerald-200">Setapak &amp; Melati</span>
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
        <div className="bg-sky-50/70 border-b border-sky-100 p-3.5 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0284c7] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              Quick demo presets
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Click to test scenario</span>
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
                      : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-800'
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
                        : 'bg-[#0284c7] text-white shadow-2xs font-semibold'
                    }`}
                  >
                    Send preset
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telegram Chat Feed */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#f0f4f8]"
          style={{
            backgroundImage: `radial-gradient(rgba(2, 132, 199, 0.08) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <div className="bg-white/90 border border-slate-200 text-slate-600 text-xs px-4 py-1.5 rounded-xl max-w-sm text-center shadow-xs leading-relaxed">
                    {msg.text}
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs relative ${
                    isUser
                      ? 'bg-[#0284c7] text-white rounded-tr-xs shadow-sky-500/10'
                      : isEm
                      ? 'bg-pink-50 border border-pink-300 text-pink-950 font-medium rounded-tl-xs shadow-xs'
                      : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200 shadow-2xs'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-[#0284c7] mb-1">
                      {msg.senderName}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>

                  <div className={`flex items-center justify-end gap-1.5 mt-1.5 text-[11px] font-mono ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Telegram Chat Input Bar */}
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
              title="Attach photo/prescription"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message @KampungCareBot..."
              className="flex-1 bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all shadow-inner"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                <Send className="w-4 h-4 translate-x-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setInputText('Mak Cik Tan perlu bantuan ke klinik');
                }}
                className="p-2 text-slate-400 hover:text-[#0284c7] transition-colors"
                title="Voice input simulator"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-2 font-sans">
            Messages automatically trigger AI Triage and Volunteer Dispatch logic.
          </p>
        </div>
      </div>
    </div>
  );
};
