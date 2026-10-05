import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGateService } from '../core/services/auth-gate.service';

/** Header (emblem + Entities / Administration / Account menus) shared by every Account Management page. */
@Component({
  selector: 'dgt-account-shell',
  templateUrl: './account-shell.component.html',
  styleUrls: ['./account-shell.component.scss']
})
export class AccountShellComponent {
  constructor(private readonly auth: AuthGateService, private readonly router: Router) {}

  get userName(): string {
    return this.auth.getUsername();
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
