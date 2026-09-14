import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGateService } from '../core/services/auth-gate.service';

interface LauncherCard {
  /** Matches the ngSwitch case in the template that picks the inline icon. */
  id: string;
  title: string;
  cta: string;
  num: string;
  route: string;
  accent: 'primary' | 'series2' | 'gold' | 'geo';
  /** true for sibling static sites outside this Angular app (gis-dgt/, geomapping/) —
   *  rendered as a plain navigation, not routed through the Angular Router. */
  external?: boolean;
}

/**
 * Ports root index.html: a #loginView/#launcherView toggle. This is a
 * COSMETIC GATE ONLY (see AuthGateService doc comment) — dashboard/
 * data-manager routes stay directly reachable by URL regardless of this
 * component's state, matching the original ("any non-empty username/password
 * is accepted... don't build real access control on top of it").
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

  // gis-dgt/ and geomapping/ are separate static sites living as sibling
  // folders in the same repo (not part of this Angular workspace — see root
  // CLAUDE.md) — kept here as external links so the launcher stays the one
  // place that lists every tool, matching the original static launcher's
  // 4-card grid.
  cards: LauncherCard[] = [
    { id: 'dashboard', title: 'Dashboard DGT', cta: 'Buka dashboard', num: '01', route: '/dashboard', accent: 'primary' },
    { id: 'data-manager', title: 'DGT Data Manager', cta: 'Buka data manager', num: '02', route: '/data-manager', accent: 'series2' },
    { id: 'gis-dgt', title: 'GIS DGT', cta: 'Buka GIS DGT', num: '03', route: 'gis-dgt/', accent: 'gold', external: true },
    { id: 'geomapping', title: 'GEOMAPPING', cta: 'Buka GEOMAPPING', num: '04', route: 'geomapping/', accent: 'geo', external: true }
  ];

  constructor(private readonly auth: AuthGateService, private readonly router: Router) {}

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
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
    this.auth.signOut();
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
