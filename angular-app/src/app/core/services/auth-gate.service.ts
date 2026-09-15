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
  private readonly usernameKey = 'dgt-auth-user';

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.storageKey) === '1';
  }

  /** Accepts any non-empty username/password, matching the original prototype. Remembers the
   *  typed username (session-only) so the post-login launcher can greet the user by name. */
  signIn(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }
    sessionStorage.setItem(this.storageKey, '1');
    sessionStorage.setItem(this.usernameKey, username);
    return true;
  }

  /** The name entered at sign-in, or a generic fallback if this session never went through the
   *  login form (e.g. a deep link straight into an authenticated route). */
  getUsername(): string {
    try {
      return sessionStorage.getItem(this.usernameKey) || 'Pengguna';
    } catch (e) {
      return 'Pengguna';
    }
  }

  signOut(): void {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.usernameKey);
  }
}
