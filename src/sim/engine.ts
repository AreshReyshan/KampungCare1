import type { SimulationSpeed } from './types';

/**
 * Seeded PRNG using the Mulberry32 algorithm.
 * Guarantees 100% deterministic, repeatable pseudorandom values across demo runs.
 */
export function createMulberry32(seed = 1337) {
  let s = seed >>> 0;
  return function mulberry32(): number {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ScheduledEvent {
  id: string;
  atSeconds: number;
  label: string;
  run: (virtualSeconds: number) => void;
  executed: boolean;
}

export type EngineListener = (state: EngineState) => void;

export interface EngineState {
  virtualSeconds: number;
  speed: SimulationSpeed;
  isPlaying: boolean;
  formattedTime: string;
}

export class SimulationEngine {
  private static instance: SimulationEngine | null = null;

  private virtualSeconds = 0;
  private speed: SimulationSpeed = 1;
  private isPlaying = false;
  private tickIntervalId: ReturnType<typeof setInterval> | null = null;
  private readonly tickIntervalMs = 250;

  private rngSeed = 1337;
  public rng = createMulberry32(this.rngSeed);

  private eventQueue: ScheduledEvent[] = [];
  private listeners: Set<EngineListener> = new Set();

  private constructor() {
    // Singleton
  }

  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  public subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in SimulationEngine listener:', err);
      }
    });
  }

  public getState(): EngineState {
    return {
      virtualSeconds: this.virtualSeconds,
      speed: this.speed,
      isPlaying: this.isPlaying,
      formattedTime: this.formatTime(this.virtualSeconds),
    };
  }

  public formatTime(totalSeconds: number): string {
    const rounded = Math.floor(totalSeconds);
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  public setSpeed(newSpeed: SimulationSpeed) {
    this.speed = newSpeed;
    this.notify();
  }

  public schedule(atSeconds: number, run: (virtualSeconds: number) => void, label: string): string {
    const id = `ev-${atSeconds}-${label.replace(/\s+/g, '-').toLowerCase()}`;
    // Check if already registered
    const existing = this.eventQueue.find((e) => e.id === id);
    if (existing) {
      existing.run = run;
      existing.executed = false;
      return id;
    }
    this.eventQueue.push({
      id,
      atSeconds,
      label,
      run,
      executed: false,
    });
    // Sort by scheduled time
    this.eventQueue.sort((a, b) => a.atSeconds - b.atSeconds);
    return id;
  }

  public clearSchedule() {
    this.eventQueue = [];
  }

  public play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (!this.tickIntervalId) {
      this.tickIntervalId = setInterval(() => {
        this.tick();
      }, this.tickIntervalMs);
    }
    this.notify();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
    this.notify();
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public reset(keepListeners = true) {
    this.pause();
    this.virtualSeconds = 0;
    this.rng = createMulberry32(this.rngSeed);

    // Reset executed flags on event queue
    for (const ev of this.eventQueue) {
      ev.executed = false;
    }

    if (!keepListeners) {
      this.listeners.clear();
    }
    this.notify();
  }

  private tick() {
    if (!this.isPlaying) return;

    // Advance virtual seconds: (250ms = 0.25s) * speed
    const deltaSeconds = (this.tickIntervalMs / 1000) * this.speed;
    const previousTime = this.virtualSeconds;
    this.virtualSeconds += deltaSeconds;

    // Check and trigger events whose time has arrived
    for (const ev of this.eventQueue) {
      if (!ev.executed && ev.atSeconds <= this.virtualSeconds && ev.atSeconds >= previousTime - 0.001) {
        ev.executed = true;
        try {
          ev.run(this.virtualSeconds);
        } catch (err) {
          console.error(`Error executing simulation event ${ev.label}:`, err);
        }
      }
    }

    this.notify();
  }

  public getVirtualSeconds(): number {
    return this.virtualSeconds;
  }

  public getSpeed(): SimulationSpeed {
    return this.speed;
  }

  public destroy() {
    this.pause();
    this.listeners.clear();
    this.eventQueue = [];
    SimulationEngine.instance = null;
  }
}

export const engine = SimulationEngine.getInstance();
