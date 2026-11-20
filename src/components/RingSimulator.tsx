import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  BatteryCharging, 
  ShieldAlert, 
  Sliders, 
  Check
} from 'lucide-react';
import type { Resident } from '../types';

interface RingSimulatorProps {
  residents: Resident[];
  onTriggerFallEmergency: (resident: Resident) => void;
  onLogCalibrationEvent: (msg: string, oldSensitivity: number, newSensitivity: number) => void;
}

export const RingSimulator: React.FC<RingSimulatorProps> = ({
  residents,
  onTriggerFallEmergency,
  onLogCalibrationEvent,
}) => {
  // Select resident: default to Pak Samad (res-pak-samad)
  const defaultResident = residents.find((r) => r.id === 'res-pak-samad') || residents[0];
  const [selectedResidentId, setSelectedResidentId] = useState(defaultResident?.id || 'res-pak-samad');

  const resident = residents.find((r) => r.id === selectedResidentId) || defaultResident;

  // Telemetry state
  const [heartRate, setHeartRate] = useState(74);
  const spO2 = 98;
  const skinTemp = 36.6;
  const battery = 84;
  const [sensitivity, setSensitivity] = useState(9); // 1 to 10
  const [falseAlarmCount, setFalseAlarmCount] = useState(0);

  // Sparkline history (60 points)
  const [sparkline, setSparkline] = useState<number[]>(() => {
    const pts: number[] = [];
    for (let i = 0; i < 60; i++) {
      pts.push(72 + (i % 6));
    }
    return pts;
  });

  // Countdown state
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  // Live telemetry pulse simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(() => {
        const delta = Math.sin(Date.now() / 1000) * 2;
        return Math.round(74 + delta);
      });
      setSparkline((prev) => {
        const nextVal = Math.round(74 + Math.sin(Date.now() / 800) * 4);
        return [...prev.slice(1), nextVal];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 30s Countdown timer when fall is simulated
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isCountingDown) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Expired without user cancel -> escalate to 999 HUMAN Emergency!
            setIsCountingDown(false);
            onTriggerFallEmergency(resident);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCountingDown, onTriggerFallEmergency, resident]);

  const handleSimulateFall = () => {
    setIsCountingDown(true);
    setSecondsRemaining(30);
  };

  const handleCancelFalseAlarm = () => {
    setIsCountingDown(false);
    setSecondsRemaining(30);

    const newCount = falseAlarmCount + 1;
    setFalseAlarmCount(newCount);

    // Repeated false alarms lower ring sensitivity!
    const oldSensitivity = sensitivity;
    const newSensitivity = Math.max(5, sensitivity - 1);
    setSensitivity(newSensitivity);

    onLogCalibrationEvent(
      `Resident cancelled fall alert on ring (False Alarm #${newCount}). Auto-calibrated accelerometer sensitivity threshold from ${oldSensitivity} to ${newSensitivity}/10.`,
      oldSensitivity,
      newSensitivity
    );
  };

  // Generate SVG path for sparkline
  const minVal = Math.min(...sparkline, 65);
  const maxVal = Math.max(...sparkline, 85);
  const range = maxVal - minVal || 1;
  const svgWidth = 320;
  const svgHeight = 60;

  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * (svgHeight - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 30s Are You OK Modal / Banner when fall detected (Bubblegum Pink) */}
      {isCountingDown && (
        <div className="dose-tray-emergency p-6 border-2 border-pink-400 bg-pink-50/95 shadow-xl space-y-4 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ec4899] to-[#db2777] flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-500/30 animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-xl font-bold text-slate-900 font-display">
                    HIGH-G IMPACT DETECTED!
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-[#db2777] border border-pink-200 font-bold">
                    Smart-Ring Buzzing
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 font-sans">
                  {resident.name} ring telemetry detected bathroom slip signature.
                </p>
                <p className="text-xs text-pink-700 font-mono font-medium">
                  If uncancelled, auto-routes 999 paramedic coordination script to human coordinator.
                </p>
              </div>
            </div>

            {/* Countdown Badge & Button */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white border border-pink-200 rounded-2xl shadow-xs">
                <div className="text-3xl font-bold font-mono text-[#db2777]">
                  {secondsRemaining}s
                </div>
                <div className="text-[10px] text-pink-600 font-mono uppercase tracking-wider font-semibold">
                  Until 999 Escalate
                </div>
              </div>

              <button
                onClick={handleCancelFalseAlarm}
                className="dose-btn-secondary bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-5 py-3 text-xs font-mono font-bold flex items-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>CANCEL / I'M OK</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-pink-200/80 h-2.5 rounded-full overflow-hidden border border-pink-200">
            <div
              className="bg-gradient-to-r from-[#f43f8e] to-[#db2777] h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(secondsRemaining / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Ring Telemetry Card */}
      <section className="dose-tray p-7 space-y-6 bg-white border border-slate-200 shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7] shadow-2xs">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  KampungCare Smart-Ring Telemetry
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284c7] border border-sky-200 font-semibold">
                  BT LE 5.3 LINKED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Wearable fall detection, continuous vitals, and auto-calibrating sensitivity
              </p>
            </div>
          </div>

          {/* Resident Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-500 font-medium">Monitoring:</label>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              className="bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl px-3 py-1.5 font-mono focus:outline-none focus:border-[#0284c7] shadow-2xs"
            >
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Sensor Dial Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Heart Rate */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Pulse Rate</span>
              <Heart className="w-4 h-4 text-[#ec4899] fill-current animate-pulse" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {heartRate} <span className="text-xs text-slate-400 font-normal">BPM</span>
            </div>
            <div className="text-[11px] text-[#0284c7] font-mono font-semibold">Resting range</div>
          </div>

          {/* Blood Oxygen */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">SpO₂ Oxygen</span>
              <Activity className="w-4 h-4 text-[#0284c7]" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {spO2}%
            </div>
            <div className="text-[11px] text-[#0284c7] font-mono font-semibold">Optimal saturation</div>
          </div>

          {/* Skin Temperature */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Skin Temp</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {skinTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Afebrile baseline</div>
          </div>

          {/* Battery */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">Battery</span>
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {battery}%
            </div>
            <div className="text-[11px] text-emerald-700 font-mono font-semibold">~3.5 days runtime</div>
          </div>
        </div>

        {/* 60s Sparkline Chart */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-500">
              Real-time PPG Photoplethysmogram (60-second window)
            </span>
            <span className="font-mono text-xs text-[#0284c7] font-semibold">72–78 bpm trend</span>
          </div>

          <div className="w-full h-16 flex items-center justify-center overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>

        {/* Ring Sensitivity & Calibration Box */}
        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0284c7]" />
              <h4 className="font-bold text-sm text-slate-900 font-display">
                Adaptive Accelerometer Calibration
              </h4>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white text-[#0284c7] border border-sky-200 font-semibold shadow-2xs">
                Level {sensitivity}/10
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Auto-calibrated: repeated false alarms lower threshold sensitivity to eliminate panic fatigue ({falseAlarmCount} logged false alarms).
            </p>
          </div>

          {/* Simulate Fall Button */}
          <button
            onClick={handleSimulateFall}
            disabled={isCountingDown}
            className="dose-btn-emergency h-11 px-5 text-xs font-mono font-bold shrink-0 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SIMULATE PHYSICAL FALL</span>
          </button>
        </div>
      </section>
    </div>
  );
};
