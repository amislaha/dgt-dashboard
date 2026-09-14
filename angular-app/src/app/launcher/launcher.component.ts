import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGateService } from '../core/services/auth-gate.service';

interface LauncherCard {
  title: string;
  description: string;
  route: string;
  accent: string;
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

  cards: LauncherCard[] = [
    { title: 'DGT Dashboard', description: 'Situation-room DSS untuk kawasan transmigrasi.', route: '/dashboard', accent: 'primary' },
    { title: 'DGT Data Manager', description: 'CRUD data induk WPT/SKP/SP, komoditi, program, satker, personel, IKU.', route: '/data-manager', accent: 'success' }
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
    this.router.navigateByUrl(card.route);
  }
}
