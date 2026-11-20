import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Send, 
  Phone, 
  Calendar,
  ExternalLink,
  MessageSquare,
  Clock
} from 'lucide-react';
import type { ActiveDispatch, Resident } from '../types';

interface ActiveDispatchesProps {
  dispatches: ActiveDispatch[];
  residents?: Resident[];
  onOpenCompleteVisit: (dispatch: ActiveDispatch) => void;
  onOpenResidentPassport: (residentId: string) => void;
}

export const ActiveDispatches: React.FC<ActiveDispatchesProps> = ({
  dispatches,
  onOpenCompleteVisit,
  onOpenResidentPassport,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'dispatched' | 'completed'>('all');

  const filteredDispatches = dispatches.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const activeCount = dispatches.filter((d) => d.status !== 'completed').length;
  const completedCount = dispatches.filter((d) => d.status === 'completed').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
              filter === 'all'
                ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All visits ({dispatches.length})
          </button>
          <button
            onClick={() => setFilter('dispatched')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
              filter === 'dispatched'
                ? 'bg-[#0284c7] text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-sky-300'
            }`}
          >
            En route ({dispatches.filter((d) => d.status === 'dispatched').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
              filter === 'in_progress'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-amber-300'
            }`}
          >
            In progress ({dispatches.filter((d) => d.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans transition-all ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-dose">
          <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
          <span>{activeCount} active dispatches deployed in Setapak</span>
        </div>
      </div>

      {/* Dispatches List */}
      <div className="space-y-4">
        {filteredDispatches.map((dispatch) => {
          const isCompleted = dispatch.status === 'completed';
          const isWhatsApp = dispatch.channel === 'whatsapp';

          return (
            <article
              key={dispatch.id}
              className={`dose-tray p-5 transition-all duration-150 bg-white border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md ${
                isCompleted ? 'opacity-90' : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Left: Resident Info & Care Task */}
                <div className="lg:col-span-7 space-y-3">
                  {/* Status header & Channel line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono-dose font-semibold ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : dispatch.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-sky-50 text-[#0284c7] border border-sky-200'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Visit completed &amp; logged</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-[#0284c7]" />
                          <span>{dispatch.estimatedArrival}</span>
                        </>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono-dose bg-slate-100 text-slate-600 border border-slate-200">
                      {isWhatsApp ? (
                        <>
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp dispatch</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-[#0284c7]" />
                          <span>Telegram dispatch</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Resident Info */}
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => onOpenResidentPassport(dispatch.residentId)}
                      className="group shrink-0 relative"
                    >
                      <img
                        src={dispatch.residentAvatar}
                        alt={dispatch.residentName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    </button>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => onOpenResidentPassport(dispatch.residentId)}
                        className="text-base font-bold text-slate-900 hover:text-[#0284c7] transition-colors flex items-center gap-1.5 font-display"
                      >
                        <span>{dispatch.residentName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <div className="flex items-center gap-1 text-xs text-slate-500 font-mono-dose">
                        <MapPin className="w-3 h-3 text-[#0284c7] shrink-0" />
                        <span>{dispatch.residentAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between font-sans">
                      <span>{dispatch.serviceType}</span>
                      <span className="text-[#0284c7] font-mono-dose font-semibold">
                        {dispatch.carePill}
                      </span>
                    </div>
                    {dispatch.notes && (
                      <p className="text-slate-600 text-xs font-sans leading-relaxed">
                        {dispatch.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Assigned Volunteer & Action */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-5 space-y-3">
                  <div className="text-xs font-medium text-slate-500 font-sans">
                    Assigned community volunteer
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={dispatch.volunteerAvatar}
                        alt={dispatch.volunteerName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 font-display">
                          {dispatch.volunteerName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 font-mono-dose">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{dispatch.volunteerPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono-dose text-slate-400">
                      <div>Dispatched</div>
                      <div className="font-semibold text-slate-700">{dispatch.dispatchedAt}</div>
                    </div>
                  </div>

                  {!isCompleted ? (
                    <button
                      onClick={() => onOpenCompleteVisit(dispatch)}
                      className="dose-btn-primary w-full"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete visit &amp; log outcome</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono-dose text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Outcome verified on passport</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredDispatches.length === 0 && (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white space-y-2">
            <Calendar className="w-8 h-8 text-[#0284c7] mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-display">No visits in this category</h3>
            <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
              Assign action items from the Triage Inbox to start active dispatches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
