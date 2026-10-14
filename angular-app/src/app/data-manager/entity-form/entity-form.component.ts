import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { DrawGeometryType, DrawnGeometry, geometryAreaHa, geometryPointCount } from '../models/drawn-geometry.model';
import { EntityConfig } from '../models/entity-config.model';
import { FieldConfig } from '../models/field-config.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { MapDrawService } from '../services/map-draw.service';

/**
 * Generic Reactive Form driven by one entity's `FieldConfig[]` (the port
 * spec's "generic reusable EntityFormComponent"). Ports the original
 * `openForm()`/`saveForm()` (data-manager/index.html): builds one control per
 * field, groups fields sharing the same `row` value into a 2-column
 * `.field-row` (see `groupFields`), and — for `type: 'fk'` fields — renders a
 * real `<select>` sourced from the referenced entity's current records
 * instead of the original's free-text `<input list="...">` autocomplete
 * (the FK fix, see PORT_NOTES.md).
 *
 * Recreated by the parent `EntityListComponent` (`*ngIf="drawerOpen"`) each
 * time the drawer opens, so `ngOnChanges` only ever needs to handle the
 * initial `config`/`record` inputs, not live re-binding mid-edit.
 */
/** Palette offered by `color` fields (map fill colours). */
export const COLOR_SWATCHES = ['#b2293d', '#e8961e', '#1fa34a', '#1497b8', '#0b62a8', '#c9a063'];

function formatNumber(value: number, digits: number): string {
  return value.toLocaleString('id-ID', { maximumFractionDigits: digits });
}

@Component({
  selector: 'dgt-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})
export class EntityFormComponent implements OnChanges, OnDestroy {
  @Input() config!: EntityConfig;
  @Input() record: any | null = null;
  @Output() saved = new EventEmitter<any>();

  form: FormGroup = this.fb.group({});
  /** One tab per `FieldConfig.section` (a single unlabeled tab — no tab strip — when no field has one). */
  tabs: Array<{ label: string; groups: FieldConfig[][] }> = [];
  activeTab = 0;
  fkOptions: { [fieldName: string]: Array<{ id: string; label: string }> } = {};
  /** `select` options as value/label pairs, from `choices` or `options` — plus the record's current value when it isn't one of them, so older free-text data still shows. */
  selectOptions: { [fieldName: string]: Array<{ value: string; label: string }> } = {};
  readonly swatches = COLOR_SWATCHES;

  private drawSub?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly registry: EntityRegistryService,
    private readonly toast: ToastService,
    private readonly mapDraw: MapDrawService
  ) {}

  ngOnDestroy(): void {
    this.stopListeningForDraw();
    this.mapDraw.cancel();
  }

  /** `geometry` fields: start drawing on the page's shared map; the result lands in this control. */
  startDraw(field: FieldConfig, type: DrawGeometryType): void {
    this.stopListeningForDraw();
    this.drawSub = this.mapDraw.result$.subscribe(geometry => {
      const control = this.form.get(field.name);
      if (control) {
        control.setValue(geometry);
        control.markAsDirty();
      }
      this.stopListeningForDraw();
    });
    this.mapDraw.start(type);
  }

  clearGeometry(field: FieldConfig): void {
    this.stopListeningForDraw();
    this.mapDraw.cancel();
    const control = this.form.get(field.name);
    if (control) {
      control.setValue(null);
    }
  }

  geometryTitle(g: DrawnGeometry): string {
    return g.type === 'Point' ? 'Titik tersimpan' : g.type === 'LineString' ? 'Garis tersimpan' : 'Poligon tersimpan';
  }

  geometryDetail(g: DrawnGeometry): string {
    if (g.type === 'Point') {
      return `${formatNumber(g.coordinates[1], 5)}, ${formatNumber(g.coordinates[0], 5)}`;
    }
    const points = `${geometryPointCount(g)} titik`;
    return g.type === 'Polygon' ? `${points} · ${formatNumber(geometryAreaHa(g), 1)} ha` : points;
  }

  /** `areaFrom` hint: area of the named geometry field, or '' when it holds no polygon. */
  areaHint(field: FieldConfig): string {
    const control = field.areaFrom ? this.form.get(field.areaFrom) : null;
    const ha = control ? geometryAreaHa(control.value) : 0;
    return ha ? formatNumber(ha, 1) : '';
  }

  setColor(field: FieldConfig, color: string): void {
    const control = this.form.get(field.name)!;
    control.setValue(color);
    control.markAsDirty();
  }

  sameColor(a: string | null, b: string): boolean {
    return !!a && a.toLowerCase() === b.toLowerCase();
  }

  /** Fields hidden by `showWhen` drop out of the layout and out of the saved value. */
  isVisible(field: FieldConfig): boolean {
    if (!field.showWhen) {
      return true;
    }
    const control = this.form.get(field.showWhen.field);
    return !!control && field.showWhen.equals.indexOf(control.value) !== -1;
  }

  visibleIn(group: FieldConfig[]): FieldConfig[] {
    return group.filter(field => this.isVisible(field));
  }

  private stopListeningForDraw(): void {
    if (this.drawSub) {
      this.drawSub.unsubscribe();
      this.drawSub = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config || changes.record) {
      this.buildForm();
    }
  }

  fieldInvalid(field: FieldConfig): boolean {
    const control = this.form.get(field.name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    const blocking = this.config.fields.some(field => this.isVisible(field) && this.form.get(field.name)!.invalid);
    if (blocking) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      this.showFirstInvalidTab();
      this.toast.show('Periksa kembali kolom yang wajib diisi.', 'danger');
      return;
    }

    const value: any = { ...this.form.value };
    this.config.fields.forEach(field => {
      if (!this.isVisible(field)) {
        value[field.name] = undefined;
      } else if (field.readonly) {
        // shown only — passed through untouched
      } else if (field.type === 'geometry') {
        value[field.name] = value[field.name] || undefined;
      } else if (field.type === 'number') {
        value[field.name] = value[field.name] === '' || value[field.name] == null ? undefined : Number(value[field.name]);
      } else if (typeof value[field.name] === 'string') {
        const trimmed = value[field.name].trim();
        value[field.name] = trimmed === '' && !field.required ? undefined : trimmed;
      }
    });
    this.saved.emit(value);
  }

  private buildForm(): void {
    const group: { [key: string]: any } = {};
    this.config.fields.forEach(field => {
      const raw = this.record ? this.record[field.name] : undefined;
      const empty = field.type === 'number' || field.type === 'geometry' ? null : field.type === 'boolean' ? false : '';
      const initial = raw != null ? raw : !this.record && field.defaultValue !== undefined ? field.defaultValue : empty;
      group[field.name] = [initial, this.buildValidators(field)];
      if (field.unit) {
        const unitRaw = this.record ? this.record[field.unit.name] : undefined;
        group[field.unit.name] = [unitRaw != null ? unitRaw : field.unit.defaultValue || field.unit.options[0]];
      }
    });
    this.form = this.fb.group(group);

    this.tabs = this.buildTabs(this.config.fields);
    this.activeTab = 0;

    this.selectOptions = {};
    this.config.fields.forEach(field => {
      if (field.type === 'select') {
        const opts = field.choices ? [...field.choices] : (field.options || []).map(o => ({ value: o, label: o }));
        const current = this.form.get(field.name)!.value;
        if (current && !opts.some(o => o.value === current)) {
          opts.push({ value: current, label: current });
        }
        this.selectOptions[field.name] = opts;
      }
    });

    this.fkOptions = {};
    this.config.fields.forEach(field => {
      if (field.type === 'fk' && field.fkEntity) {
        const entry = this.registry.get(field.fkEntity);
        this.fkOptions[field.name] = entry.service.list().map(r => ({ id: r.id, label: String(r[entry.config.titleField]) }));
      }
    });
  }

  private buildValidators(field: FieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required && !field.readonly) {
      validators.push(Validators.required);
    }
    if (field.type === 'color') {
      validators.push(Validators.pattern(/^#[0-9a-fA-F]{6}$/));
    }
    if (field.type === 'number') {
      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }
      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }
    }
    return validators;
  }

  tabHasErrors(index: number): boolean {
    return this.tabs[index].groups.some(group => this.visibleIn(group).some(field => this.fieldInvalid(field)));
  }

  /** Booleans always hold an answer, so they count as filled. */
  tabFillCount(index: number): { filled: number; total: number } {
    const fields = ([] as FieldConfig[]).concat(...this.tabs[index].groups);
    const filled = fields.filter(field => {
      const value = this.form.get(field.name)!.value;
      return field.type === 'boolean' || (value != null && String(value).trim() !== '');
    }).length;
    return { filled, total: fields.length };
  }

  tabStatus(index: number): 'full' | 'partial' | 'empty' {
    const { filled, total } = this.tabFillCount(index);
    return filled === 0 ? 'empty' : filled === total ? 'full' : 'partial';
  }

  private showFirstInvalidTab(): void {
    const first = this.tabs.findIndex((_, i) => this.tabHasErrors(i));
    if (first !== -1) {
      this.activeTab = first;
    }
  }

  /** A field's `section` starts a new tab; fields after it without one stay in that tab. */
  private buildTabs(fields: FieldConfig[]): Array<{ label: string; groups: FieldConfig[][] }> {
    const sections: Array<{ label: string; fields: FieldConfig[] }> = [];
    fields.forEach(field => {
      if (field.section || !sections.length) {
        sections.push({ label: field.section || '', fields: [] });
      }
      sections[sections.length - 1].fields.push(field);
    });
    return sections.map(section => ({ label: section.label, groups: this.groupFields(section.fields) }));
  }

  /** Groups fields sharing the same `row` key so the template can render them 2-up, matching the original's `f.row` bucketing in `openForm()`. */
  private groupFields(fields: FieldConfig[]): FieldConfig[][] {
    const buckets: { [key: string]: FieldConfig[] } = {};
    const order: string[] = [];
    fields.forEach(field => {
      const key = field.row || `_${field.name}`;
      if (!buckets[key]) {
        buckets[key] = [];
        order.push(key);
      }
      buckets[key].push(field);
    });
    return order.map(key => buckets[key]);
  }
}
