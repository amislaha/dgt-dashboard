import { Injectable } from '@angular/core';
import { AuthGateService } from '../core/services/auth-gate.service';

export interface AuditEntry {
  at: string;
  by: string;
  action: string;
  target: string;
}

/** localStorage-backed log of who changed what in Account Management (newest first, capped). */
@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly key = 'dgt-account-management:audit';
  private readonly max = 200;

  constructor(private readonly auth: AuthGateService) {}

  list(): AuditEntry[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]') as AuditEntry[];
    } catch (e) {
      return [];
    }
  }

  log(action: string, target: string): void {
    const next = [{ at: new Date().toISOString(), by: this.auth.getUsername(), action, target }, ...this.list()]
      .slice(0, this.max);
    try { localStorage.setItem(this.key, JSON.stringify(next)); } catch (e) { /* storage blocked */ }
  }

  clear(): void {
    try { localStorage.removeItem(this.key); } catch (e) { /* storage blocked */ }
  }
}
