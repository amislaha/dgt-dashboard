import { Injectable } from '@angular/core';

const STORAGE_KEY = 'dgt-theme';

/**
 * App-wide light/dark toggle. Applies/removes `.dark` on <html>, which is
 * what `_tokens-bridge.scss`'s `.dark{}` block (and the Bootstrap-class
 * overrides in `_dark-mode.scss`) key off of. Manual toggle only — no
 * `prefers-color-scheme` default — so the choice persists in localStorage
 * under `dgt-theme` rather than following the OS setting.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = false;

  get isDark(): boolean {
    return this.darkMode;
  }

  constructor() {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    this.apply(stored === 'dark');
  }

  toggle(): void {
    this.apply(!this.darkMode);
  }

  private apply(dark: boolean): void {
    this.darkMode = dark;
    document.documentElement.classList.toggle('dark', dark);
    try {
      window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Private browsing / storage blocked — theme just won't persist.
    }
  }
}
