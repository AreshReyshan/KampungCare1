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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
              filter === 'all'
                ? 'bg-[#10b981] text-[#042f2e] font-semibold'
                : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
            }`}
          >
            All visits ({dispatches.length})
          </button>
          <button
            onClick={() => setFilter('dispatched')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
              filter === 'dispatched'
                ? 'bg-[#0284c7] text-white font-semibold'
                : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
            }`}
          >
            En route ({dispatches.filter((d) => d.status === 'dispatched').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
              filter === 'in_progress'
                ? 'bg-[#d97706] text-white font-semibold'
                : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
            }`}
          >
            In progress ({dispatches.filter((d) => d.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
              filter === 'completed'
                ? 'bg-[#059669] text-white font-semibold'
                : 'bg-[#121c1c] text-[#9eb1ad] hover:text-[#f0f5f4] border border-[#20312f]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#809692] font-mono-dose">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
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
              className={`dose-tray p-5 transition-transform duration-100 ease-out ${
                isCompleted ? 'opacity-85' : 'hover:border-[#334c48]'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Left: Resident Info & Care Task */}
                <div className="lg:col-span-7 space-y-3">
                  {/* Status header & Channel line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono-dose ${
                        isCompleted
                          ? 'bg-[#142e27] text-[#6ee7b7] border border-[#205244]'
                          : dispatch.status === 'in_progress'
                          ? 'bg-[#2b1d11] text-[#fcd34d] border border-[#78350f]'
                          : 'bg-[#122227] text-[#38bdf8] border border-[#1e3c45]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                          <span>Visit completed &amp; logged</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-[#38bdf8]" />
                          <span>{dispatch.estimatedArrival}</span>
                        </>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono-dose bg-[#162322] text-[#9eb1ad] border border-[#233533]">
                      {isWhatsApp ? (
                        <>
                          <MessageSquare className="w-3 h-3 text-[#4ade80]" />
                          <span>WhatsApp dispatch</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-[#38bdf8]" />
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
                        className="w-12 h-12 rounded-xl object-cover border border-[#2b3f3c]"
                      />
                    </button>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => onOpenResidentPassport(dispatch.residentId)}
                        className="text-base font-bold text-[#f0f5f4] hover:text-[#10b981] transition-colors flex items-center gap-1.5 font-display"
                      >
                        <span>{dispatch.residentName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#738a86]" />
                      </button>

                      <div className="flex items-center gap-1 text-xs text-[#809692] font-mono-dose">
                        <MapPin className="w-3 h-3 text-[#738a86] shrink-0" />
                        <span>{dispatch.residentAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="bg-[#0c1313] rounded-lg p-3 border border-[#20312f] text-xs space-y-1">
                    <div className="font-semibold text-[#f0f5f4] flex items-center justify-between font-sans">
                      <span>{dispatch.serviceType}</span>
                      <span className="text-[#a7f3d0] font-mono-dose">
                        {dispatch.carePill}
                      </span>
                    </div>
                    {dispatch.notes && (
                      <p className="text-[#809692] text-xs font-sans leading-relaxed">
                        {dispatch.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Assigned Volunteer & Action */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#20312f] pt-4 lg:pt-0 lg:pl-5 space-y-3">
                  <div className="text-xs font-medium text-[#809692] font-sans">
                    Assigned community volunteer
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={dispatch.volunteerAvatar}
                        alt={dispatch.volunteerName}
                        className="w-10 h-10 rounded-lg object-cover border border-[#2b3f3c]"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#f0f5f4] font-display">
                          {dispatch.volunteerName}
                        </div>
                        <div className="text-xs text-[#809692] flex items-center gap-1 font-mono-dose">
                          <Phone className="w-3 h-3 text-[#738a86]" />
                          <span>{dispatch.volunteerPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono-dose text-[#738a86]">
                      <div>Dispatched</div>
                      <div className="font-semibold text-[#c6d6d2]">{dispatch.dispatchedAt}</div>
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
                    <div className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono-dose text-[#a7f3d0] bg-[#142e27] border border-[#205244] rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                      <span>Outcome verified on passport</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredDispatches.length === 0 && (
          <div className="p-12 text-center border border-dashed border-[#20312f] rounded-xl space-y-2">
            <Calendar className="w-8 h-8 text-[#10b981] mx-auto" />
            <h3 className="text-base font-bold text-[#f0f5f4] font-display">No visits in this category</h3>
            <p className="text-xs text-[#809692] font-sans max-w-sm mx-auto">
              Assign action items from the Triage Inbox to start active dispatches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
