import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataTableColumn, SortDirection } from '../../shared/components/data-table/data-table.model';
import { ToastService } from '../../shared/services/toast.service';
import { EntityFormComponent } from '../entity-form/entity-form.component';
import { EntityConfig } from '../models/entity-config.model';
import { EntityKey } from '../models/entity-key.model';
import { getOperator } from '../services/entity-crud.service';
import { MapDrawService } from '../services/map-draw.service';
import { EntityRegistryService } from '../services/entity-registry.service';
import { SubmissionService } from '../services/submission.service';

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
  drawing = false;
  editing: any | null = null;

  private entityKey!: EntityKey;
  private allRows: any[] = [];
  private readonly routeSubscription: Subscription;
  private entitySubscription?: Subscription;
  private readonly drawSubscription: Subscription;

  constructor(private readonly route: ActivatedRoute, private readonly registry: EntityRegistryService, private readonly toast: ToastService, private readonly submissions: SubmissionService, private readonly mapDraw: MapDrawService) {
    // While a form is drawing on the Wilayah map, slide the drawer (and its scrim, which would swallow map clicks) away; the form stays alive underneath.
    this.drawSubscription = this.mapDraw.drawType$.subscribe(type => (this.drawing = !!type));
    this.routeSubscription = this.route.data.subscribe(data => {
      this.entityKey = data.entityKey;
      this.bindEntity();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.drawSubscription.unsubscribe();
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
    if (this.query) {
      return 'Tidak ada data yang cocok.';
    }
    return this.needsApproval ? 'Belum ada data. Klik "+ Ajukan Tambah" — data baru muncul setelah disetujui.' : 'Belum ada data. Klik "+ Tambah".';
  }

  get drawerTitle(): string {
    const label = this.config ? this.config.label.toLowerCase() : '';
    if (this.needsApproval) {
      return this.editing ? `Ajukan ubah ${label}` : `Ajukan tambah ${label}`;
    }
    return this.editing ? `Ubah ${label}` : `Tambah ${label}`;
  }

  /** Every entity now writes directly; the submission path below is kept only so approval can be switched back on per entity. */
  get needsApproval(): boolean {
    return false;
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

  /** Wilayah: add/edit become a PENDING Submission, applied only once approved (SubmissionService.review). Other entities save directly. */
  onFormSaved(value: any): void {
    const config = this.config as EntityConfig;
    if (!this.needsApproval) {
      const service = this.registry.get(this.entityKey).service;
      if (this.editing) {
        const patch: { [key: string]: any } = {};
        config.fields.forEach(f => (patch[f.name] = value[f.name]));
        service.update(this.editing.id, patch);
      } else {
        service.create(value);
      }
      this.toast.show('Data disimpan.', 'success');
      this.closeDrawer();
      return;
    }
    const submittedBy = this.requireOperator();
    if (!submittedBy) {
      return;
    }
    const label = this.labelOf({ ...(this.editing || {}), ...value });
    this.submissions.submit({
      entityKey: this.entityKey,
      mode: this.editing ? 'update' : 'create',
      targetId: this.editing ? this.editing.id : null,
      targetLabel: label,
      summary: `${this.editing ? 'Ubah' : 'Tambah'} ${config.label.toLowerCase()}: ${label}`,
      images: [],
      geometry: null,
      fieldValues: value,
      submittedBy
    });
    this.afterSubmit();
  }

  deleteCurrent(): void {
    if (!this.editing || !this.config) {
      return;
    }
    let label = this.labelOf(this.editing);
    if (label.length > 70) {
      label = label.slice(0, 70) + '…';
    }
    if (!this.needsApproval) {
      if (window.confirm(`Hapus "${label}"?`)) {
        this.registry.get(this.entityKey).service.remove(this.editing.id);
        this.toast.show('Data dihapus.', 'success');
        this.closeDrawer();
      }
      return;
    }
    const submittedBy = this.requireOperator();
    if (!submittedBy) {
      return;
    }
    if (!window.confirm(`Ajukan penghapusan "${label}"? Data baru terhapus setelah pengajuan disetujui.`)) {
      return;
    }
    this.submissions.submit({
      entityKey: this.entityKey,
      mode: 'delete',
      targetId: this.editing.id,
      targetLabel: label,
      summary: `Hapus ${this.config.label.toLowerCase()}: ${label}`,
      images: [],
      geometry: null,
      fieldValues: null,
      submittedBy
    });
    this.afterSubmit();
  }

  private requireOperator(): string {
    const name = getOperator();
    if (!name) {
      this.toast.show('Isi "Nama operator" di header terlebih dahulu — dicatat sebagai pengaju.', 'danger');
    }
    return name;
  }

  private afterSubmit(): void {
    this.toast.show('Pengajuan dikirim — menunggu persetujuan di Submission & Approval.', 'success');
    this.closeDrawer();
  }

  /** Display label of a record: its `titleField`, resolved through the FK when that field is an id reference. */
  private labelOf(record: any): string {
    const config = this.config as EntityConfig;
    const field = config.fields.find(f => f.name === config.titleField);
    const value = record[config.titleField];
    if (field && field.type === 'fk' && field.fkEntity) {
      return this.resolveFkLabel(field.fkEntity, value);
    }
    return String(value || '(tanpa nama)');
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
    const columns: DataTableColumn<any>[] = config.columns.map(col => ({
      key: col.key,
      label: col.label,
      numeric: col.numeric,
      sortable: col.sortable !== false,
      format: col.fk
        ? (row: any) => this.resolveFkLabel(col.fk as EntityKey, row[col.key])
        : col.boolean
        ? (row: any) => (row[col.key] ? 'Ya' : 'Tidak')
        : undefined
    }));
    // ERD audit columns, stamped by EntityCrudService — shown in the table only, never in the form.
    const when = (key: string) => (row: any) => (row[key] ? new Date(row[key]).toLocaleString('id-ID') : '—');
    const who = (key: string) => (row: any) => row[key] || '—';
    columns.push(
      { key: 'createdDate', label: 'Tanggal dibuat', sortable: true, format: when('createdDate') },
      { key: 'createdBy', label: 'Dibuat oleh', sortable: true, format: who('createdBy') },
      { key: 'lastModifiedBy', label: 'Diubah oleh', sortable: true, format: who('lastModifiedBy') },
      { key: 'lastModifiedDate', label: 'Tanggal diubah', sortable: true, format: when('lastModifiedDate') }
    );
    return columns;
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
