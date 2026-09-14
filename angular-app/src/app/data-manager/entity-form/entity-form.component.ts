import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { EntityConfig } from '../models/entity-config.model';
import { FieldConfig } from '../models/field-config.model';
import { EntityRegistryService } from '../services/entity-registry.service';

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
@Component({
  selector: 'dgt-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})
export class EntityFormComponent implements OnChanges {
  @Input() config!: EntityConfig;
  @Input() record: any | null = null;
  @Output() saved = new EventEmitter<any>();

  form: FormGroup = this.fb.group({});
  rowGroups: FieldConfig[][] = [];
  fkOptions: { [fieldName: string]: Array<{ id: string; label: string }> } = {};

  constructor(private readonly fb: FormBuilder, private readonly registry: EntityRegistryService, private readonly toast: ToastService) {}

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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      this.toast.show('Periksa kembali kolom yang wajib diisi.', 'danger');
      return;
    }

    const value: any = { ...this.form.value };
    this.config.fields.forEach(field => {
      if (field.type === 'number') {
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
      const initial = raw != null ? raw : field.type === 'number' ? null : '';
      group[field.name] = [initial, this.buildValidators(field)];
    });
    this.form = this.fb.group(group);

    this.rowGroups = this.groupFields(this.config.fields);

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
    if (field.required) {
      validators.push(Validators.required);
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
