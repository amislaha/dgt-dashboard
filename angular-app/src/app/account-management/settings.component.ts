import { Component } from '@angular/core';
import { AuditService } from './audit.service';
import { AuthGateService } from '../core/services/auth-gate.service';
import { ToastService } from '../shared/services/toast.service';

interface UserSettings {
  displayName: string;
  email: string;
  language: string;
}

/** Per-sign-in-name profile settings, kept in localStorage (no backend). */
@Component({
  selector: 'dgt-am-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class SettingsComponent {
  readonly login: string;
  form: UserSettings;
  emailError = '';

  constructor(auth: AuthGateService, private readonly audit: AuditService, private readonly toast: ToastService) {
    this.login = auth.getUsername();
    this.form = { displayName: this.login, email: '', language: 'id', ...this.read() };
  }

  submit(): void {
    this.emailError = '';
    const email = this.form.email.trim();
    if (email && !/^[^@\s]+@[^@\s]+$/.test(email)) { this.emailError = 'Email tidak valid.'; return; }
    this.form.email = email;
    try { localStorage.setItem(this.key(), JSON.stringify(this.form)); } catch (e) { /* storage blocked */ }
    this.audit.log('Ubah pengaturan', this.login);
    this.toast.show('Pengaturan disimpan');
  }

  private key(): string {
    return 'dgt-account-management:settings:' + this.login;
  }

  private read(): Partial<UserSettings> {
    try {
      return JSON.parse(localStorage.getItem(this.key()) || '{}');
    } catch (e) {
      return {};
    }
  }
}
