import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Paperclip, 
  CheckCheck, 
  Sparkles, 
  Phone, 
  Video, 
  Smile, 
  MessageSquare
} from 'lucide-react';
import type { WhatsAppMessage } from '../types';

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

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
      text: 'Salam KampungCare, boleh tolong aturkan sukarelawan teman Mak Cik Tan pergi Poliklinik Setapak pagi Khamis pukul 9.30? Dia pakai walking frame.',
      tag: 'Clinic Escort'
    },
    {
      id: 'grocery',
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
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* WhatsApp Device Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-[#0b141a] text-slate-100 shadow-2xl flex flex-col z-10 animate-slide-in-right border-l border-emerald-950/60">
        {/* WhatsApp Header */}
        <div className="px-5 py-3.5 bg-[#1f2c34] text-white flex items-center justify-between shadow-md shrink-0 border-b border-[#2a3942]">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-inner ring-2 ring-emerald-500/40">
                <MessageSquare className="w-6 h-6 fill-current" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#1f2c34]"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base tracking-tight text-white">
                  KampungCare Careline
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-medium">WhatsApp Business</span>
                <span>•</span>
                <span>+60 11-KAMPUNG</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Demo Presets Banner */}
        <div className="bg-[#111b21] border-b border-[#222d34] p-3.5 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              1-Tap WhatsApp Presets
            </span>
            <span className="text-[11px] text-slate-400">Tap to test live bot response</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {demoPresets.map((preset) => {
              const isEm = preset.id === 'emergency';

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSend(preset.text)}
                  className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isEm
                      ? 'bg-rose-950/40 hover:bg-rose-900/50 border-rose-800/80 text-rose-200'
                      : 'bg-[#1f2c34] hover:bg-[#26353d] border-[#2f3d46] text-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="font-semibold text-xs truncate text-slate-100">{preset.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{preset.sub}</div>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isEm
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    Send Now
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Chat Feed */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-3.5"
          style={{
            backgroundImage: `radial-gradient(rgba(37, 211, 102, 0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundColor: '#0b141a'
          }}
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <div className="bg-[#182229] border border-[#222d34] text-slate-400 text-xs px-4 py-1.5 rounded-xl max-w-sm text-center shadow-xs leading-relaxed">
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm relative ${
                    isUser
                      ? 'bg-[#005c4b] text-white rounded-tr-xs'
                      : isEm
                      ? 'bg-rose-950/80 border border-rose-500/60 text-rose-100 font-medium rounded-tl-xs'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-xs border border-[#2a3942]'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <span>{msg.senderName}</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 rounded">BOT</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>

                  <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] text-slate-300/80">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-[#202c33] text-slate-400 text-xs px-3.5 py-2.5 rounded-2xl max-w-[130px] border border-[#2a3942]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-400 ml-1">typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Chat Input Bar */}
        <div className="p-3.5 bg-[#1f2c34] border-t border-[#2a3942] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              title="Attach photo/prescription"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message KampungCare Careline..."
              className="flex-1 bg-[#2a3942] text-sm text-white placeholder-slate-400 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                title="Voice input simulator"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>

          <p className="text-[11px] text-slate-400 text-center mt-2">
            Incoming WhatsApp messages trigger AI Triage and Volunteer Proximity Match.
          </p>
        </div>
      </div>
    </div>
  );
};
