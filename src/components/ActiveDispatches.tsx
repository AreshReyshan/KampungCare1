import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Send, 
  Phone, 
  Calendar,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import type { ActiveDispatch, Resident } from '../types';

interface ActiveDispatchesProps {
  dispatches: ActiveDispatch[];
  residents: Resident[];
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Controls & Status Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-100 text-slate-900 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Visits ({dispatches.length})
          </button>
          <button
            onClick={() => setFilter('dispatched')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'dispatched'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            En Route ({dispatches.filter((d) => d.status === 'dispatched').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'in_progress'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            In Progress ({dispatches.filter((d) => d.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Completed Today ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{activeCount} active helpers dispatched across Setapak</span>
        </div>
      </div>

      {/* Dispatches Grid */}
      <div className="space-y-4">
        {filteredDispatches.map((dispatch) => {
          const isCompleted = dispatch.status === 'completed';

          return (
            <div
              key={dispatch.id}
              className={`border rounded-2xl p-6 transition-all ${
                isCompleted
                  ? 'border-slate-800/60 bg-slate-900/40 opacity-80'
                  : 'bg-slate-900 border-slate-800 shadow-md hover:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Resident Info & Service Details (Cols 1-7) */}
                <div className="lg:col-span-7 space-y-3">
                  {/* Status header & Telegram sync badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isCompleted
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : dispatch.status === 'in_progress'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                          : 'bg-sky-950/80 text-sky-300 border border-sky-800/80'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          Visit Completed
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                          {dispatch.estimatedArrival}
                        </>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                      <Send className="w-3 h-3 text-sky-400" />
                      Dispatched via @KampungCareBot
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
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-sky-400 transition-all"
                      />
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenResidentPassport(dispatch.residentId)}
                          className="text-base font-semibold text-white hover:text-sky-400 transition-colors flex items-center gap-1"
                        >
                          <span>{dispatch.residentName}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{dispatch.residentAddress}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task description */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>{dispatch.serviceType}</span>
                      <span className="text-[11px] text-sky-400 font-medium">
                        {dispatch.carePill}
                      </span>
                    </div>
                    {dispatch.notes && (
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {dispatch.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Assigned Volunteer & Action (Cols 8-12) */}
                <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    Assigned Community Helper
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={dispatch.volunteerAvatar}
                        alt={dispatch.volunteerName}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800 shadow-sm"
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {dispatch.volunteerName}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{dispatch.volunteerPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <div>Dispatched</div>
                      <div className="font-semibold text-slate-300">{dispatch.dispatchedAt}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isCompleted ? (
                    <button
                      onClick={() => onOpenCompleteVisit(dispatch)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Visit &amp; Log Outcome</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/80 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Visit Logged to Care Passport</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredDispatches.length === 0 && (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No visits in this status</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Assign pending tasks from the Triage Inbox to start active dispatches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
