import { Component } from '@angular/core';
import { Account } from './account.model';
import { AccountService } from './account.service';
import { ToastService } from '../shared/services/toast.service';

type SortKey = 'id' | 'login' | 'email' | 'createdDate' | 'modifiedBy' | 'modifiedDate';

/** Account list. Create/view/edit each live on their own page (AccountFormComponent). */
@Component({
  selector: 'dgt-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent {
  accounts: Account[] = [];
  search = '';
  sortKey: SortKey = 'id';
  sortDir: 1 | -1 = 1;
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

  sortBy(k: SortKey): void {
    this.sortDir = this.sortKey === k ? (this.sortDir === 1 ? -1 : 1) : 1;
    this.sortKey = k;
  }

  sortIcon(k: SortKey): string {
    return this.sortKey !== k ? '⇅' : this.sortDir === 1 ? '▲' : '▼';
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
