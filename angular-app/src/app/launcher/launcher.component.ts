import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGateService } from '../core/services/auth-gate.service';

interface LauncherCard {
  /** Matches the ngSwitch case in the template that picks the inline icon. */
  id: string;
  title: string;
  desc: string;
  cta: string;
  num: string;
  route: string;
  accent: 'dark' | 'blue' | 'gold' | 'green';
  /** true for sibling static sites outside this Angular app (gis-dgt/) — rendered as a plain
   *  navigation, not routed through the Angular Router. */
  external?: boolean;
}

/**
 * Ports root index.html: a #loginView/#launcherView toggle. This is a
 * COSMETIC GATE ONLY (see AuthGateService doc comment) — dashboard/
 * data-manager routes stay directly reachable by URL regardless of this
 * component's state, matching the original ("any non-empty username/password
 * is accepted... don't build real access control on top of it").
 *
 * The post-login `#launcherView` was redesigned on request to match a new
 * mockup (top navbar + split hero with a kawasan photo + numbered tool
 * cards) — see this component's `.html`/`.scss` for the new markup. The
 * pre-login form below is untouched; only the mockup's screen is affected.
 */
@Component({
  selector: 'dgt-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent {
  username = '';
  password = '';
  showForgotHint = false;
  userMenuOpen = false;

  // gis-dgt/ is still a separate static site living as a sibling folder in the same repo (not
  // part of this Angular workspace — see root CLAUDE.md) — kept as an external link. geomapping/
  // now HAS an Angular port (src/app/geomapping/, Phases 1-3 — see its own PORT_NOTES.md) and
  // routes internally like dashboard/data-manager do.
  cards: LauncherCard[] = [
    { id: 'dashboard', title: 'Dashboard DGT', desc: 'Peta kawasan dan dasbor eksekutif', cta: 'Buka dashboard', num: '01', route: '/dashboard', accent: 'dark' },
    { id: 'gis-dgt', title: 'GIS DGT', desc: 'Analisis spasial lanjutan peta kawasan', cta: 'Buka GIS DGT', num: '02', route: 'gis-dgt/', accent: 'blue', external: true },
    { id: 'data-manager', title: 'DGT Data Manager', desc: 'Manajemen dan pengolahan data tabel', cta: 'Buka data manager', num: '03', route: '/data-manager', accent: 'gold' },
    { id: 'geomapping', title: 'Geomapping', desc: 'Manajemen dan pengolahan data spasial', cta: 'Buka Geomapping', num: '04', route: '/geomapping', accent: 'green' }
  ];

  constructor(private readonly auth: AuthGateService, private readonly router: Router) {}

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  get userName(): string {
    return this.auth.getUsername();
  }

  get userInitial(): string {
    return (this.userName[0] || 'P').toUpperCase();
  }

  submit(): void {
    // Cosmetic gate only — the native `required` attributes on both fields
    // already block an empty submission, matching the original's "any
    // non-empty username/password is accepted" behavior with no error UI.
    this.auth.signIn(this.username, this.password);
  }

  toggleForgotHint(): void {
    // Cosmetic only — no backend to send a reset link to, so this just
    // surfaces a static hint, same as the original's forgotBtn handler.
    this.showForgotHint = !this.showForgotHint;
  }

  signOut(): void {
    this.username = '';
    this.password = '';
    this.showForgotHint = false;
    this.userMenuOpen = false;
    this.auth.signOut();
  }

  toggleUserMenu(ev: Event): void {
    ev.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.userMenuOpen = false;
  }

  open(card: LauncherCard): void {
    if (card.external) {
      // Plain navigation, not the Angular Router — these are separate static
      // sites outside this SPA. Relative to <base href> (set at build time
      // via --base-href), so this resolves correctly wherever the app is
      // deployed.
      window.location.href = card.route;
      return;
    }
    this.router.navigateByUrl(card.route);
  }
}
