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
      {/* 30s Are You OK Modal / Banner when fall detected */}
      {isCountingDown && (
        <div className="dose-tray-emergency p-6 animate-pulse border-2 border-rose-500 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-xl font-bold text-white font-display">
                    HIGH-G IMPACT DETECTED!
                  </span>
                  <span className="font-mono text-sm px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
                    Smart-Ring Buzzing
                  </span>
                </div>
                <p className="text-sm font-semibold text-rose-100 font-sans">
                  {resident.name} ring telemetry detected bathroom slip signature.
                </p>
                <p className="text-xs text-rose-200/90 font-mono">
                  If uncancelled, auto-routes 999 paramedic coordination script to human coordinator.
                </p>
              </div>
            </div>

            {/* Countdown Badge & Button */}
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-[#2d0f15] border border-rose-700 rounded-2xl">
                <div className="text-3xl font-bold font-mono text-rose-200">
                  {secondsRemaining}s
                </div>
                <div className="text-[10px] text-rose-300/80 font-mono uppercase tracking-wider">
                  Until 999 Escalate
                </div>
              </div>

              <button
                onClick={handleCancelFalseAlarm}
                className="dose-btn-secondary bg-[#1a2222] border-emerald-600 text-emerald-300 hover:text-white px-5 py-3 text-xs font-mono font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>CANCEL / I'M OK</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-rose-950/80 h-2 rounded-full overflow-hidden border border-rose-800">
            <div
              className="bg-rose-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(secondsRemaining / 30) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Ring Telemetry Card */}
      <section className="dose-tray p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1c2c2a]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#142322] border border-[#233836] flex items-center justify-center text-[#10b981]">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">
                  KampungCare Smart-Ring Telemetry
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#064e3b] text-[#6ee7b7] border border-[#047857]">
                  BT LE 5.3 LINKED
                </span>
              </div>
              <p className="text-xs text-[#809692] font-mono mt-0.5">
                Wearable fall detection, continuous vitals, and auto-calibrating sensitivity
              </p>
            </div>
          </div>

          {/* Resident Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-[#809692]">Monitoring:</label>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              className="bg-[#121c1c] text-xs text-[#f0f5f4] border border-[#223533] rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-[#10b981]"
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
          <div className="p-4 rounded-2xl bg-[#121c1c] border border-[#20312f] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#809692]">
              <span className="font-mono">Pulse Rate</span>
              <Heart className="w-4 h-4 text-rose-400 fill-current animate-pulse" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {heartRate} <span className="text-xs text-[#809692] font-normal">BPM</span>
            </div>
            <div className="text-[11px] text-[#a7f3d0] font-mono">Resting range</div>
          </div>

          {/* Blood Oxygen */}
          <div className="p-4 rounded-2xl bg-[#121c1c] border border-[#20312f] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#809692]">
              <span className="font-mono">SpO₂ Oxygen</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {spO2}%
            </div>
            <div className="text-[11px] text-[#a7f3d0] font-mono">Optimal saturation</div>
          </div>

          {/* Skin Temperature */}
          <div className="p-4 rounded-2xl bg-[#121c1c] border border-[#20312f] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#809692]">
              <span className="font-mono">Skin Temp</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {skinTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-[#a7f3d0] font-mono">Afebrile baseline</div>
          </div>

          {/* Battery */}
          <div className="p-4 rounded-2xl bg-[#121c1c] border border-[#20312f] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#809692]">
              <span className="font-mono">Battery</span>
              <BatteryCharging className="w-4 h-4 text-[#10b981]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {battery}%
            </div>
            <div className="text-[11px] text-[#a7f3d0] font-mono">~3.5 days runtime</div>
          </div>
        </div>

        {/* 60s Sparkline Chart */}
        <div className="p-4 rounded-2xl bg-[#121c1c] border border-[#20312f] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#809692]">
              Real-time PPG Photoplethysmogram (60-second window)
            </span>
            <span className="font-mono text-xs text-[#10b981]">72–78 bpm trend</span>
          </div>

          <div className="w-full h-16 flex items-center justify-center overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>

        {/* Ring Sensitivity & Calibration Box */}
        <div className="p-5 rounded-2xl bg-[#14201f] border border-[#20312f] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#10b981]" />
              <h4 className="font-bold text-sm text-white font-display">
                Adaptive Accelerometer Calibration
              </h4>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#162524] text-[#a7f3d0] border border-[#2b3f3c]">
                Level {sensitivity}/10
              </span>
            </div>
            <p className="text-xs text-[#809692] font-sans">
              Auto-calibrated: repeated false alarms lower threshold sensitivity to eliminate panic fatigue ({falseAlarmCount} logged false alarms).
            </p>
          </div>

          {/* Simulate Fall Button */}
          <button
            onClick={handleSimulateFall}
            disabled={isCountingDown}
            className="dose-btn-emergency h-11 px-5 text-xs font-mono font-bold shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SIMULATE PHYSICAL FALL</span>
          </button>
        </div>
      </section>
    </div>
  );
};
