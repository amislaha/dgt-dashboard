import { EntityKey } from './entity-key.model';

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'fk';

/**
 * Describes one Reactive Form field for an entity's create/edit drawer.
 * Ports the `fields` array on each entry of the original `ENTITIES` config
 * object (data-manager/index.html) field-for-field, with one deliberate
 * change: `type: 'fk'` fields are a real dropdown sourced from another
 * entity's records via `fkEntity`, replacing the original's free-text
 * `<input list="...">` datalist autocomplete (see PORT_NOTES.md "FK fix").
 */
export interface FieldConfig<T = any> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** Shown under the control, matching the original's `.hint` text. */
  hint?: string;
  /** type: 'select' only. */
  options?: string[];
  /** type: 'fk' only — which entity's records populate the dropdown. */
  fkEntity?: EntityKey;
  min?: number;
  max?: number;
  /**
   * Groups fields into the same `.field-row` (2-column grid) when two fields
   * share the same `row` value, matching the original's `f.row` convention.
   */
  row?: string;
}
