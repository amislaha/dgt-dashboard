import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { WILAYAH_CHILD_CONFIG_MAP, WILAYAH_CHILD_CONFIGS } from '../../config/wilayah-child-configs';
import { EntityFormComponent } from '../../entity-form/entity-form.component';
import { EntityConfig } from '../../models/entity-config.model';
import { EntityKey } from '../../models/entity-key.model';
import { FieldConfig } from '../../models/field-config.model';
import { ChildResolver, WilayahChildConfig, WilayahChildKey, WilayahChildRecord } from '../../models/wilayah-child.model';
import { Wpt } from '../../models/wpt.model';
import { EntityRegistryService } from '../../services/entity-registry.service';
import { MapDrawService } from '../../services/map-draw.service';
import { WilayahChildService } from '../../services/wilayah-child.service';

type TabKey = 'umum' | WilayahChildKey;

/** "Umum" tab: the kawasan's own fields. Everything else on Wpt stays stored as-is (only these are patched on save). */
const BASIC_FIELDS: FieldConfig[] = [
  { name: 'id', label: 'ID', type: 'text', readonly: true, mono: true, placeholder: 'Dibuat otomatis' },
  { name: 'parentId', label: 'Induk', type: 'select', placeholder: 'Tanpa induk' },
  { name: 'wilayahType', label: 'Tipe wilayah', type: 'select', options: ['KT', 'SKP', 'SP'], defaultValue: 'KT', row: 'type' },
  { name: 'wilayahStatusId', label: 'Status wilayah', type: 'fk', fkEntity: 'wilayahStatus', row: 'type' },
  { name: 'nama', label: 'Nama', type: 'text', required: true },
  { name: 'description', label: 'Deskripsi', type: 'textarea' },
  { name: 'address', label: 'Alamat', type: 'text' },
  { name: 'provinsi', label: 'Provinsi', type: 'text', required: true, row: 'adm' },
  { name: 'kabupaten', label: 'Kabupaten/Kota', type: 'text', required: true, row: 'adm' },
  { name: 'dasarPenetapan', label: 'Dasar penetapan', type: 'text', placeholder: 'SK-001', row: 'cap' },
  { name: 'kapasitasMaksimum', label: 'Kapasitas maksimum (KK)', type: 'number', min: 0, step: 1, row: 'cap' },
  { name: 'geometry', label: 'Geometri', type: 'geometry' },
  { name: 'color', label: 'Warna di peta', type: 'color', defaultValue: '#e8961e' }
];

const STATUS_TONE: { [status: string]: string } = { Terbit: 'good', Diproses: 'warn', Menunggu: 'muted' };

/**
 * Wilayah side-panel editor (replaces the generic inline form for this one entity): an "Umum" tab with
 * the kawasan's own fields, then one tab per per-kawasan list (WILAYAH_CHILD_CONFIGS). A list tab shows
 * a table; a row (or "+ Tambah") opens that record's detail page in the same panel, with breadcrumb,
 * a 2-column form and a Hapus / Batal / Simpan footer.
 */
@Component({
  selector: 'dgt-wilayah-editor',
  templateUrl: './wilayah-editor.component.html',
  styleUrls: ['./wilayah-editor.component.scss']
})
export class WilayahEditorComponent implements OnChanges, OnDestroy {
  /** The kawasan being edited; null = new kawasan (only "Umum" is available until it's saved). */
  @Input() record: Wpt | null = null;
  @Output() closed = new EventEmitter<void>();
  /** Emitted after a new kawasan is created, so the host can select it on the map. */
  @Output() created = new EventEmitter<Wpt>();

  @ViewChild('basicForm', { static: false }) basicForm?: EntityFormComponent;
  @ViewChild('childForm', { static: false }) childForm?: EntityFormComponent;

  readonly childConfigs = WILAYAH_CHILD_CONFIGS;
  basicConfig: EntityConfig = { key: 'wpt', label: 'Wilayah', sub: '', idPrefix: 'wpt', titleField: 'nama', columns: [], fields: BASIC_FIELDS };

  current: Wpt | null = null;
  tab: TabKey = 'umum';
  rows: WilayahChildRecord[] = [];
  yearFilter = '';
  years: string[] = [];
  /** Detail page: `open` with `item` null = adding a new record. */
  detail: { open: boolean; item: WilayahChildRecord | null } = { open: false, item: null };
  detailConfig: EntityConfig | null = null;
  lastOpenedId: string | null = null;
  counts: { [key: string]: number } = {};

  readonly resolver: ChildResolver = {
    name: (entity, id) => this.nameOf(entity, id),
    child: (key, id) => this.children.get(key, id)
  };

  private readonly sub: Subscription;

  constructor(
    private readonly registry: EntityRegistryService,
    private readonly children: WilayahChildService,
    private readonly mapDraw: MapDrawService,
    private readonly toast: ToastService
  ) {
    this.sub = this.children.changes$.subscribe(() => this.refreshRows());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.record) {
      this.current = this.record;
      this.basicConfig = { ...this.basicConfig, fields: this.basicFields() };
      this.tab = 'umum';
      this.closeDetail();
      this.refreshRows();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.mapDraw.clearPreview();
  }

  get config(): WilayahChildConfig | null {
    return this.tab === 'umum' ? null : WILAYAH_CHILD_CONFIG_MAP[this.tab];
  }

  get title(): string {
    return this.current ? this.current.kawasan || this.current.nama : 'Kawasan baru';
  }

  get visibleRows(): WilayahChildRecord[] {
    const config = this.config;
    return this.yearFilter && config && config.year ? this.rows.filter(row => config.year!(row) === this.yearFilter) : this.rows;
  }

  get detailTitle(): string {
    const config = this.config as WilayahChildConfig;
    return this.detail.item ? config.title(this.detail.item, this.resolver) : `${capitalize(config.noun)} baru`;
  }

  get detailSubtitle(): string {
    const config = this.config as WilayahChildConfig;
    return this.detail.item && config.subtitle ? config.subtitle(this.detail.item, this.resolver) : '';
  }

  get detailColor(): string | null {
    const config = this.config as WilayahChildConfig;
    return this.detail.item && config.colorField ? this.detail.item[config.colorField] || null : null;
  }

  get detailStatus(): string | null {
    const config = this.config as WilayahChildConfig;
    return this.detail.item && config.statusField ? this.detail.item[config.statusField] || null : null;
  }

  /** Footer applies to the "Umum" form or an open detail page; a list has none. */
  get showFooter(): boolean {
    return this.tab === 'umum' || this.detail.open;
  }

  get deleteLabel(): string {
    return this.tab === 'umum' ? 'Hapus kawasan' : `Hapus ${(this.config as WilayahChildConfig).noun}`;
  }

  get canDelete(): boolean {
    return this.tab === 'umum' ? !!this.current : !!this.detail.item;
  }

  /** Name column takes the slack; the rest size to their content; last track is the chevron. */
  get gridColumns(): string {
    const config = this.config;
    if (!config) {
      return '';
    }
    return config.columns.map(c => (c.primary ? 'minmax(0, 2.4fr)' : 'minmax(0, 1fr)')).join(' ') + ' 20px';
  }

  tone(status: string): string {
    return STATUS_TONE[status] || 'muted';
  }

  /** The tab strip scrolls sideways without a scrollbar: a vertical wheel scrolls it horizontally. */
  onTabsWheel(event: WheelEvent, strip: HTMLElement): void {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX) && strip.scrollWidth > strip.clientWidth) {
      strip.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  /** Keeps a clicked tab fully in view (it may sit half outside the scrolled strip). */
  reveal(event: Event): void {
    const tab = event.currentTarget as HTMLElement | null;
    if (tab && tab.scrollIntoView) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  selectTab(tab: TabKey): void {
    if (tab !== 'umum' && !this.current) {
      return;
    }
    this.tab = tab;
    this.yearFilter = '';
    this.closeDetail();
    this.refreshRows();
  }

  openDetail(item: WilayahChildRecord | null): void {
    const config = this.config as WilayahChildConfig;
    this.detail = { open: true, item };
    this.detailConfig = { key: 'wpt', label: config.tab, sub: '', idPrefix: '', titleField: 'id', columns: [], fields: this.withChoices(config.fields) };
    if (item) {
      this.lastOpenedId = item.id;
    }
    this.mapDraw.showPreview(item && item.geometry ? item.geometry : null);
  }

  closeDetail(): void {
    this.detail = { open: false, item: null };
    this.detailConfig = null;
    this.mapDraw.clearPreview();
  }

  cancel(): void {
    if (this.detail.open) {
      this.closeDetail();
    } else {
      this.closed.emit();
    }
  }

  save(): void {
    const form = this.tab === 'umum' ? this.basicForm : this.childForm;
    if (form) {
      form.submit();
    }
  }

  saveBasic(value: any): void {
    const service = this.registry.get('wpt').service;
    const patch: { [key: string]: any } = {};
    BASIC_FIELDS.filter(f => f.name !== 'id').forEach(f => (patch[f.name] = value[f.name]));
    if (this.current) {
      this.current = service.update(this.current.id, patch) as Wpt;
      this.toast.show('Kawasan disimpan.', 'success');
    } else {
      this.current = service.create(patch as any) as Wpt;
      this.basicConfig = { ...this.basicConfig, fields: this.basicFields() };
      this.toast.show('Kawasan ditambahkan — tab lain kini bisa diisi.', 'success');
      this.created.emit(this.current);
    }
    this.refreshRows();
  }

  saveChild(value: any): void {
    const current = this.current as Wpt;
    const config = this.config as WilayahChildConfig;
    if (config.key === 'target' && value.budgetPercentage == null && value.budgetTarget && value.budgetRealization != null) {
      value.budgetPercentage = Math.round((value.budgetRealization / value.budgetTarget) * 10000) / 100;
    }
    const saved = this.children.save(config.key, current.id, this.detail.item ? this.detail.item.id : null, value);
    this.lastOpenedId = saved.id;
    this.toast.show(`${capitalize(config.noun)} disimpan.`, 'success');
    this.closeDetail();
  }

  deleteCurrent(): void {
    if (this.tab === 'umum') {
      const current = this.current;
      if (current && window.confirm(`Hapus kawasan "${this.title}" beserta semua datanya (HPL, SHM, KK, …)?`)) {
        this.children.removeAllFor(current.id);
        this.registry.get('wpt').service.remove(current.id);
        this.toast.show('Kawasan dihapus.', 'success');
        this.closed.emit();
      }
      return;
    }
    const config = this.config as WilayahChildConfig;
    const item = this.detail.item;
    if (item && window.confirm(`Hapus ${config.noun} "${this.detailTitle}"?`)) {
      this.children.remove(config.key, item.id);
      this.toast.show(`${capitalize(config.noun)} dihapus.`, 'success');
      this.closeDetail();
    }
  }

  cell(row: WilayahChildRecord, column: { value: (row: WilayahChildRecord, r: ChildResolver) => string }): string {
    return column.value(row, this.resolver);
  }

  secondary(row: WilayahChildRecord, column: { secondary?: (row: WilayahChildRecord, r: ChildResolver) => string }): string {
    return column.secondary ? column.secondary(row, this.resolver) : '';
  }

  trackById(_: number, row: WilayahChildRecord): string {
    return row.id;
  }

  private refreshRows(): void {
    this.counts = {};
    if (!this.current) {
      this.rows = [];
      this.years = [];
      return;
    }
    const id = this.current.id;
    this.childConfigs.forEach(c => (this.counts[c.key] = this.children.count(c.key, id)));
    const config = this.config;
    if (!config) {
      return;
    }
    const rows = [...this.children.list(config.key, id)];
    this.rows = config.sort ? rows.sort(config.sort) : rows;
    const years = config.year ? this.rows.map(config.year).filter(Boolean) : [];
    this.years = Array.from(new Set(years)).sort().reverse();
    if (this.yearFilter && this.years.indexOf(this.yearFilter) === -1) {
      this.yearFilter = '';
    }
  }

  /** Fills the `select` fields whose options are runtime data (other kawasan, this kawasan's SHM, IKU definitions). */
  private withChoices(fields: FieldConfig[]): FieldConfig[] {
    const current = this.current as Wpt;
    return fields.map(field => {
      if (field.name === 'shmId') {
        return { ...field, choices: this.children.list('shm', current.id).map(s => ({ value: s.id, label: s.nomor || s.id })) };
      }
      if (field.name === 'ikuDefinitionId') {
        return { ...field, choices: this.registry.get('ikuDefinition').service.list().map(d => ({ value: d.id, label: this.nameOf('ikuDefinition', d.id) })) };
      }
      return field;
    });
  }

  private basicFields(): FieldConfig[] {
    const selfId = this.current ? this.current.id : null;
    const parents = this.registry
      .get('wpt')
      .service.list()
      .filter(w => w.id !== selfId)
      .map(w => ({ value: w.id, label: w.kawasan || w.nama }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return BASIC_FIELDS.map(f => (f.name === 'parentId' ? { ...f, choices: parents } : f));
  }

  private nameOf(entity: EntityKey, id: string | null | undefined): string {
    if (!id) {
      return '—';
    }
    const entry = this.registry.get(entity);
    const record = entry.service.get(id);
    if (!record) {
      return `⚠ tidak ditemukan (${id})`;
    }
    if (entity === 'ikuDefinition') {
      const indicator = this.registry.get('iku').service.get(record.ikuIndicatorId);
      const name = indicator ? indicator.indikator : record.ikuIndicatorId;
      return record.referenceYear ? `${name} (${record.referenceYear})` : String(name);
    }
    return String(record[entry.config.titleField]);
  }
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
