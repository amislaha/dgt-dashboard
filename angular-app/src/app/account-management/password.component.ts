import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { AuditService } from './audit.service';
import { AuthGateService } from '../core/services/auth-gate.service';
import { ToastService } from '../shared/services/toast.service';

/**
 * Serves both "Password" (own, route data `manage: false`) and "Manage user password" (pick any
 * account, `manage: true`). No password is stored or verified anywhere — this prototype has no
 * backend and the launcher gate accepts any credentials — so submitting validates the input,
 * stamps the account's modified-by/date, and writes an audit entry. Nothing more.
 */
@Component({
  selector: 'dgt-am-password',
  templateUrl: './password.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class PasswordComponent {
  readonly manage: boolean;
  accounts: Account[] = [];
  accountId: number | null = null;
  password = '';
  confirm = '';
  errors: { account?: string; password?: string; confirm?: string } = {};

  constructor(route: ActivatedRoute, private readonly svc: AccountService, private readonly audit: AuditService,
              private readonly auth: AuthGateService, private readonly toast: ToastService) {
    this.manage = !!route.snapshot.data.manage;
    if (this.manage) {
      this.accounts = this.svc.list();
    }
  }

  submit(): void {
    this.errors = {};
    if (this.manage && !this.accountId) { this.errors.account = 'Pilih pengguna.'; }
    if (this.password.length < 6) { this.errors.password = 'Kata sandi minimal 6 karakter.'; }
    if (this.confirm !== this.password) { this.errors.confirm = 'Konfirmasi tidak sama.'; }
    if (this.errors.account || this.errors.password || this.errors.confirm) { return; }

    let target = this.auth.getUsername();
    if (this.manage) {
      const acc = this.accounts.find(a => a.id === Number(this.accountId));
      target = acc ? acc.login : target;
      this.svc.touch(Number(this.accountId));
    }
    this.audit.log(this.manage ? 'Atur ulang kata sandi' : 'Ubah kata sandi', target);
    this.toast.show('Kata sandi diperbarui');
    this.password = this.confirm = '';
    this.accountId = null;
  }
}
