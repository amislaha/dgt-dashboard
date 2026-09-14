import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTableColumn, SortDirection } from '../../shared/components/data-table/data-table.model';
import { ToastService } from '../../shared/services/toast.service';
import { EntityFormComponent } from '../entity-form/entity-form.component';
import { EntityConfig } from '../models/entity-config.model';
import { EntityKey } from '../models/entity-key.model';
import { EntityRegistryService } from '../services/entity-registry.service';

/**
 * Generic list view shared by all 8 entities (the port spec's "generic
 * reusable EntityListComponent" option, chosen over 8 hand-written list
 * components — see PORT_NOTES.md). Reads `entityKey` from the active route's
 * `data`, looks up `{ config, service }` from `EntityRegistryService`, and
 * ports the original's per-tab `render()` + `filteredRows()` + `deleteRow()`
 * logic (data-manager/index.html) generically off that config.
 *
 * Create/edit both open the same `dgt-drawer` (`openCreate`/`openEdit`,
 * matching the original's single drawer reused for add vs. edit). Delete
 * lives as a "Hapus" button in the drawer footer next to Batal/Simpan rather
 * than a per-row icon in the table, because the shared `dgt-data-table`
 * (deliberately not modified — see task scope) only supports a whole-row
 * click and plain-text cells, not a per-row action slot.
 */
@Component({
  selector: 'dgt-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss']
})
export class EntityListComponent implements OnDestroy {
  @ViewChild(EntityFormComponent, { static: false }) formComponent?: EntityFormComponent;

  config: EntityConfig | null = null;
  columns: DataTableColumn<any>[] = [];
  rows: any[] = [];
  query = '';
  sortKey: string | null = null;
  sortDir: SortDirection = 'asc';

  drawerOpen = false;
  editing: any | null = null;

  private entityKey!: EntityKey;
  private allRows: any[] = [];
  private readonly routeSubscription: Subscription;
  private entitySubscription?: Subscription;

  constructor(private readonly route: ActivatedRoute, private readonly registry: EntityRegistryService, private readonly toast: ToastService) {
    this.routeSubscription = this.route.data.subscribe(data => {
      this.entityKey = data.entityKey;
      this.bindEntity();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }
  }

  onSearch(value: string): void {
    this.query = value;
    this.applyFilterAndSort();
  }

  onSort(event: { key: string; dir: SortDirection }): void {
    this.sortKey = event.key;
    this.sortDir = event.dir;
    this.applyFilterAndSort();
  }

  get emptyLabel(): string {
    return this.query ? 'Tidak ada data yang cocok.' : 'Belum ada data. Klik "+ Tambah" untuk membuat entri pertama.';
  }

  get drawerTitle(): string {
    const label = this.config ? this.config.label.toLowerCase() : '';
    return this.editing ? `Ubah ${label}` : `Tambah ${label}`;
  }

  openCreate(): void {
    this.editing = null;
    this.drawerOpen = true;
  }

  openEdit(row: any): void {
    this.editing = row;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editing = null;
  }

  submitForm(): void {
    if (this.formComponent) {
      this.formComponent.submit();
    }
  }

  onFormSaved(value: any): void {
    const entry = this.registry.get(this.entityKey);
    if (this.editing) {
      entry.service.update(this.editing.id, value);
    } else {
      entry.service.create(value);
    }
    this.toast.show('Data disimpan.', 'success');
    this.closeDrawer();
  }

  deleteCurrent(): void {
    if (!this.editing || !this.config) {
      return;
    }
    const entry = this.registry.get(this.entityKey);
    let label = String(this.editing[this.config.titleField] || '(tanpa nama)');
    if (label.length > 70) {
      label = label.slice(0, 70) + '…';
    }
    if (!window.confirm(`Hapus "${label}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    entry.service.remove(this.editing.id);
    this.toast.show('Data dihapus.', 'danger');
    this.closeDrawer();
  }

  /** Resolves an `fk` column's stored id to the referenced record's display label. */
  resolveFkLabel(fkEntity: EntityKey, id: string | null | undefined): string {
    if (!id) {
      return '—';
    }
    const entry = this.registry.get(fkEntity);
    const record = entry.service.get(id);
    return record ? String(record[entry.config.titleField]) : `⚠ tidak ditemukan (${id})`;
  }

  private bindEntity(): void {
    if (this.entitySubscription) {
      this.entitySubscription.unsubscribe();
    }
    const entry = this.registry.get(this.entityKey);
    this.config = entry.config;
    this.columns = this.buildColumns(entry.config);
    this.query = '';
    this.sortKey = null;
    this.sortDir = 'asc';
    this.closeDrawer();
    this.entitySubscription = entry.service.changes.subscribe(list => {
      this.allRows = list;
      this.applyFilterAndSort();
    });
  }

  private buildColumns(config: EntityConfig): DataTableColumn<any>[] {
    return config.columns.map(col => ({
      key: col.key,
      label: col.label,
      numeric: col.numeric,
      sortable: col.sortable !== false,
      format: col.fk ? (row: any) => this.resolveFkLabel(col.fk as EntityKey, row[col.key]) : undefined
    }));
  }

  private applyFilterAndSort(): void {
    const q = this.query.trim().toLowerCase();
    let rows = !q
      ? this.allRows
      : this.allRows.filter(row =>
          Object.keys(row).some(key => String(row[key] == null ? '' : row[key]).toLowerCase().indexOf(q) !== -1)
        );

    if (this.sortKey) {
      const key = this.sortKey;
      const dir = this.sortDir === 'asc' ? 1 : -1;
      // Sort an `fk` column by its resolved display label, not the raw stored id.
      const fkColumn = this.config && this.config.columns.find(c => c.key === key && c.fk);
      const sortValue = fkColumn ? (row: any) => this.resolveFkLabel(fkColumn.fk as EntityKey, row[key]) : (row: any) => row[key];
      rows = [...rows].sort((a, b) => {
        const av = sortValue(a);
        const bv = sortValue(b);
        if (av == null && bv == null) {
          return 0;
        }
        if (av == null) {
          return -1 * dir;
        }
        if (bv == null) {
          return 1 * dir;
        }
        return av > bv ? dir : av < bv ? -dir : 0;
      });
    }
    this.rows = rows;
  }
}
