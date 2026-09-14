import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGateService } from '../core/services/auth-gate.service';

interface LauncherCard {
  title: string;
  description: string;
  route: string;
  accent: string;
  /** true for sibling static sites outside this Angular app (gis-dgt/, geomapping/) —
   *  rendered as a plain <a href>, not routed through the Angular Router. */
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
  error = '';

  // gis-dgt/ and geomapping/ are separate static sites living as sibling
  // folders in the same repo (not part of this Angular workspace — see root
  // CLAUDE.md) — kept here as external links so the launcher stays the one
  // place that lists every tool, matching the original static launcher's
  // 4-card grid (dashboard/index.html's port replaced only cards 1-2).
  cards: LauncherCard[] = [
    { title: 'DGT Dashboard', description: 'Situation-room DSS untuk kawasan transmigrasi.', route: '/dashboard', accent: 'primary' },
    { title: 'DGT Data Manager', description: 'CRUD data induk WPT/SKP/SP, komoditi, program, satker, personel, IKU.', route: '/data-manager', accent: 'success' },
    { title: 'GIS DGT', description: 'Coming soon — placeholder page, belum ada tool di baliknya.', route: 'gis-dgt/', accent: 'warning', external: true },
    { title: 'GEOMAPPING', description: 'Data manager geospasial: gambar, klasifikasi, dan simpan objek peta.', route: 'geomapping/', accent: 'info', external: true }
  ];

  constructor(private readonly auth: AuthGateService, private readonly router: Router) {}

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  submit(): void {
    if (this.auth.signIn(this.username, this.password)) {
      this.error = '';
    } else {
      this.error = 'Masukkan username dan password.';
    }
  }

  signOut(): void {
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
