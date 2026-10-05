import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ENTITY_LABELS, EntityKind, EntityStoreService, SimpleEntity } from './entity-store.service';
import { ToastService } from '../shared/services/toast.service';

/** List for the Entities menu (User Group / Application); the kind comes from route data. */
@Component({
  selector: 'dgt-am-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class EntityListComponent {
  readonly kind: EntityKind;
  readonly label: string;
  rows: SimpleEntity[] = [];
  search = '';
  pendingDelete: SimpleEntity | null = null;

  constructor(route: ActivatedRoute, private readonly store: EntityStoreService, private readonly toast: ToastService) {
    this.kind = route.snapshot.data.kind;
    this.label = ENTITY_LABELS[this.kind];
    this.reload();
  }

  get filtered(): SimpleEntity[] {
    const q = this.search.trim().toLowerCase();
    return this.rows.filter(e => !q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  }

  confirmDelete(): void {
    if (!this.pendingDelete) { return; }
    this.store.remove(this.kind, this.pendingDelete);
    this.toast.show(this.label + ' dihapus', 'danger');
    this.pendingDelete = null;
    this.reload();
  }

  private reload(): void {
    this.rows = this.store.list(this.kind);
  }
}
