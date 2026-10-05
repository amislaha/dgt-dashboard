import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AccountRole, ACCOUNT_ROLES } from './account.model';
import { AccountService } from './account.service';
import { ToastService } from '../shared/services/toast.service';

type Mode = 'view' | 'edit' | 'create';

/** One page for all three modes, picked from the route: `new`, `:id` (view), `:id/edit`. */
@Component({
  selector: 'dgt-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountFormComponent {
  readonly roles = ACCOUNT_ROLES;
  mode: Mode;
  form: Partial<Account>;
  password = '';
  errors: { login?: string; email?: string; password?: string } = {};

  constructor(route: ActivatedRoute, private readonly router: Router,
              private readonly svc: AccountService, private readonly toast: ToastService) {
    const id = Number(route.snapshot.paramMap.get('id'));
    const existing = id ? this.svc.list().find(a => a.id === id) : undefined;
    if (id && !existing) {
      this.router.navigateByUrl('/account-management');
    }
    this.mode = !id ? 'create' : route.snapshot.url.some(s => s.path === 'edit') ? 'edit' : 'view';
    this.form = existing
      ? { ...existing, roles: [...existing.roles] }
      : { login: '', email: '', activated: true, language: 'id', roles: ['ROLE_USER'] };
  }

  get title(): string {
    return this.mode === 'create' ? 'Buat pengguna baru' : this.mode === 'edit' ? 'Ubah pengguna' : 'Detail pengguna';
  }

  hasRole(r: AccountRole): boolean {
    return (this.form.roles || []).indexOf(r) >= 0;
  }

  toggleRole(r: AccountRole): void {
    const cur = this.form.roles || [];
    this.form.roles = this.hasRole(r) ? cur.filter(x => x !== r) : [...cur, r];
  }

  submit(): void {
    const login = (this.form.login || '').trim();
    const email = (this.form.email || '').trim();
    this.errors = {};
    if (!/^[\w.@-]{3,50}$/.test(login)) { this.errors.login = 'Login 3–50 karakter (huruf, angka, . _ - @).'; }
    else if (this.svc.isTaken('login', login, this.form.id)) { this.errors.login = 'Login sudah dipakai.'; }
    if (!/^[^@\s]+@[^@\s]+$/.test(email)) { this.errors.email = 'Email tidak valid.'; }
    else if (this.svc.isTaken('email', email, this.form.id)) { this.errors.email = 'Email sudah dipakai.'; }
    if (this.mode === 'create' && this.password.length < 6) { this.errors.password = 'Kata sandi minimal 6 karakter.'; }
    if (this.errors.login || this.errors.email || this.errors.password) { return; }

    // Password is validated but deliberately never stored: no backend, and the launcher gate
    // doesn't check credentials, so persisting one would only be a plaintext liability.
    this.svc.save({ ...this.form, login, email } as Account);
    this.toast.show(this.mode === 'create' ? 'Akun dibuat' : 'Akun diperbarui');
    this.router.navigateByUrl('/account-management');
  }
}
