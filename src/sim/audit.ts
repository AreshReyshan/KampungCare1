import type { AuditEntry, AutonomyTier } from './types';
import { engine } from './engine';

export type AuditListener = (entries: AuditEntry[]) => void;

export class AuditLogManager {
  private static instance: AuditLogManager | null = null;
  private entries: AuditEntry[] = [];
  private listeners: Set<AuditListener> = new Set();

  private constructor() {
    // Singleton
  }

  public static getInstance(): AuditLogManager {
    if (!AuditLogManager.instance) {
      AuditLogManager.instance = new AuditLogManager();
    }
    return AuditLogManager.instance;
  }

  public subscribe(listener: AuditListener): () => void {
    this.listeners.add(listener);
    listener([...this.entries]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = [...this.entries];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error in AuditLogManager listener:', err);
      }
    });
  }

  public getEntries(): AuditEntry[] {
    return [...this.entries];
  }

  public logAction(
    actor: 'AI' | 'Human',
    tier: AutonomyTier | 'system',
    title: string,
    reasoning: string[],
    undo?: () => void,
    metadata?: Record<string, unknown>
  ): AuditEntry {
    const virtualTime = engine.getVirtualSeconds();
    const timestampLabel = engine.formatTime(virtualTime);
    const realTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${this.entries.length + 1}`,
      virtualTime,
      timestampLabel,
      realTime,
      actor,
      tier,
      title,
      reasoning,
      undo,
      undone: false,
      metadata,
    };

    // Prepend (newest first)
    this.entries = [entry, ...this.entries];
    this.notify();
    return entry;
  }

  public undoAction(id: string): boolean {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry || entry.undone || !entry.undo) return false;

    try {
      entry.undo();
      entry.undone = true;

      // Log the undo event itself
      this.logAction(
        'Human',
        'system',
        `Reverted Action: ${entry.title}`,
        [
          `Human coordinator triggered reversible undo for event #${id}.`,
          'Restored previous application state byte-identically.',
        ],
        undefined,
        { revertedId: id }
      );

      this.notify();
      return true;
    } catch (err) {
      console.error(`Failed to undo audit entry ${id}:`, err);
      return false;
    }
  }

  public getCounts() {
    let auto = 0;
    let propose = 0;
    let human = 0;

    for (const e of this.entries) {
      if (e.undone) continue;
      if (e.tier === 'auto') auto++;
      else if (e.tier === 'propose') propose++;
      else if (e.tier === 'human') human++;
    }

    return { auto, propose, human };
  }

  public reset() {
    this.entries = [];
    this.notify();
  }
}

export const auditManager = AuditLogManager.getInstance();
