import { Component } from '@angular/core';
import { Account, AccountRole, ACCOUNT_ROLES } from './account.model';
import { AccountService } from './account.service';
import { ToastService } from '../shared/services/toast.service';

type SortKey = 'id' | 'login' | 'email' | 'createdDate' | 'modifiedBy' | 'modifiedDate';
type Mode = 'view' | 'edit' | 'create';

@Component({
  selector: 'dgt-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent {
  readonly roles = ACCOUNT_ROLES;
  accounts: Account[] = [];
  search = '';
  sortKey: SortKey = 'id';
  sortDir: 1 | -1 = 1;

  drawerOpen = false;
  mode: Mode = 'create';
  form: Partial<Account> = {};
  password = '';
  errors: { login?: string; email?: string; password?: string } = {};
  pendingDelete: Account | null = null;

  constructor(private readonly svc: AccountService, private readonly toast: ToastService) {
    this.reload();
  }

  get rows(): Account[] {
    const q = this.search.trim().toLowerCase();
    const k = this.sortKey;
    return this.accounts
      .filter(a => !q || a.login.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) ||
        a.roles.some(r => r.toLowerCase().includes(q)))
      .sort((a, b) => {
        const av: string | number = a[k] == null ? '' : (a[k] as string | number);
        const bv: string | number = b[k] == null ? '' : (b[k] as string | number);
        return (av < bv ? -1 : av > bv ? 1 : 0) * this.sortDir;
      });
  }

  get drawerTitle(): string {
    return this.mode === 'create' ? 'Buat akun baru' : this.mode === 'edit' ? 'Ubah akun' : 'Detail akun';
  }

  sortBy(k: SortKey): void {
    this.sortDir = this.sortKey === k ? (this.sortDir === 1 ? -1 : 1) : 1;
    this.sortKey = k;
  }

  sortIcon(k: SortKey): string {
    return this.sortKey !== k ? '⇅' : this.sortDir === 1 ? '▲' : '▼';
  }

  openDrawer(mode: Mode, acc?: Account): void {
    this.mode = mode;
    this.errors = {};
    this.password = '';
    this.form = acc ? { ...acc, roles: [...acc.roles] } : { login: '', email: '', activated: true, language: 'id', roles: ['ROLE_USER'] };
    this.drawerOpen = true;
  }

  hasRole(r: AccountRole): boolean {
    return (this.form.roles || []).indexOf(r) >= 0;
  }

  toggleRole(r: AccountRole): void {
    if (this.mode === 'view') { return; }
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

    // Password is validated but deliberately never stored: this tool has no backend, and the
    // launcher gate doesn't check credentials, so persisting one would only be a plaintext liability.
    this.svc.save({ ...this.form, login, email } as Account);
    this.toast.show(this.mode === 'create' ? 'Akun dibuat' : 'Akun diperbarui');
    this.drawerOpen = false;
    this.reload();
  }

  confirmDelete(): void {
    if (!this.pendingDelete) { return; }
    this.svc.remove(this.pendingDelete.id);
    this.toast.show('Akun dihapus', 'danger');
    this.pendingDelete = null;
    this.reload();
  }

  private reload(): void {
    this.accounts = this.svc.list();
  }
}
