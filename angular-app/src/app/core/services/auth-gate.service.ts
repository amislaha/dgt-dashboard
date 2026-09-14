import { Injectable } from '@angular/core';

/**
 * Ports the root index.html login gate. This is a COSMETIC GATE ONLY — the
 * original static site has no backend, so any non-empty username/password is
 * accepted (see CLAUDE.md "index.html" section). Do not build real access
 * control on top of this without adding an actual backend + a real
 * CanActivate guard that checks a server-issued token.
 */
@Injectable({ providedIn: 'root' })
export class AuthGateService {
  private readonly storageKey = 'dgt-auth';

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.storageKey) === '1';
  }

  /** Accepts any non-empty username/password, matching the original prototype. */
  signIn(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }
    sessionStorage.setItem(this.storageKey, '1');
    return true;
  }

  signOut(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
