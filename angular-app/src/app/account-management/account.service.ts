import { Injectable } from '@angular/core';
import { Account } from './account.model';
import { AuthGateService } from '../core/services/auth-gate.service';
import { AuditService } from './audit.service';

/**
 * localStorage-backed CRUD for accounts (same no-backend approach as data-manager). This is
 * master data for the cosmetic prototype only — it does NOT feed the launcher login gate, which
 * still accepts any non-empty credentials (see AuthGateService).
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly key = 'dgt-account-management:accounts';

  constructor(private readonly auth: AuthGateService, private readonly audit: AuditService) {}

  list(): Account[] {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) {
        return JSON.parse(raw) as Account[];
      }
    } catch (e) { /* fall through to seed */ }
    const seed = this.seed();
    this.write(seed);
    return seed;
  }

  save(draft: Partial<Account> & Pick<Account, 'login' | 'email'>): Account {
    const all = this.list();
    const now = new Date().toISOString();
    const by = this.auth.getUsername();
    if (draft.id) {
      const i = all.findIndex(a => a.id === draft.id);
      all[i] = { ...all[i], ...draft, modifiedBy: by, modifiedDate: now } as Account;
      this.write(all);
      this.audit.log('Ubah akun', all[i].login);
      return all[i];
    }
    const created: Account = {
      id: all.reduce((m, a) => Math.max(m, a.id), 0) + 1,
      activated: true, language: 'id', roles: ['ROLE_USER'],
      ...draft, createdDate: now, modifiedBy: by, modifiedDate: now
    } as Account;
    this.write([...all, created]);
    this.audit.log('Buat akun', created.login);
    return created;
  }

  remove(id: number): void {
    const gone = this.list().find(a => a.id === id);
    this.write(this.list().filter(a => a.id !== id));
    if (gone) { this.audit.log('Hapus akun', gone.login); }
  }

  /** Stamp modified-by/date without changing anything else (e.g. after a password reset). */
  touch(id: number): void {
    const all = this.list();
    const i = all.findIndex(a => a.id === id);
    if (i >= 0) {
      all[i] = { ...all[i], modifiedBy: this.auth.getUsername(), modifiedDate: new Date().toISOString() };
      this.write(all);
    }
  }

  /** Case-insensitive uniqueness check on login/email, ignoring the record being edited. */
  isTaken(field: 'login' | 'email', value: string, ignoreId?: number): boolean {
    const v = value.trim().toLowerCase();
    return this.list().some(a => a.id !== ignoreId && a[field].toLowerCase() === v);
  }

  private write(all: Account[]): void {
    try { localStorage.setItem(this.key, JSON.stringify(all)); } catch (e) { /* storage blocked */ }
  }

  private seed(): Account[] {
    return [
      { id: 1, login: 'system', email: 'system@localhost', activated: true, language: 'id', roles: ['ROLE_USER', 'ROLE_ADMIN'], createdDate: null, modifiedBy: 'system', modifiedDate: null },
      { id: 2, login: 'admin', email: 'admin@dgt.local', activated: true, language: 'id', roles: ['ROLE_USER', 'ROLE_HEAD_OFFICE', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'], createdDate: '2025-09-12T07:00:00Z', modifiedBy: 'system', modifiedDate: '2026-06-30T09:23:00Z' },
      { id: 3, login: 'operator.data', email: 'operator.data@dgt.local', activated: true, language: 'id', roles: ['ROLE_USER'], createdDate: '2025-09-12T07:00:00Z', modifiedBy: 'admin', modifiedDate: '2026-07-30T09:53:00Z' },
      { id: 4, login: 'kepala.kantor', email: 'kepala.kantor@dgt.local', activated: false, language: 'id', roles: ['ROLE_USER', 'ROLE_HEAD_OFFICE'], createdDate: '2025-10-01T07:00:00Z', modifiedBy: 'admin', modifiedDate: '2026-08-02T10:10:00Z' }
    ];
  }
}
