import { EntityKey } from './entity-key.model';

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'fk' | 'boolean' | 'date' | 'geometry' | 'color';

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
  /** Starts a new tab in the form with this label (put it on the first field of the tab). */
  section?: string;
  min?: number;
  /** type: 'number' only — `step` attribute (e.g. 0.01 for the ERD's decimal columns). */
  step?: number;
  /** Initial value for a new record (an existing record's own value always wins). */
  defaultValue?: any;
  max?: number;
  /**
   * Groups fields into the same `.field-row` (2-column grid) when two fields
   * share the same `row` value, matching the original's `f.row` convention.
   */
  row?: string;
  /** Shown but not editable (e.g. the record id). Never trimmed/required. */
  readonly?: boolean;
  /** Monospace control (certificate numbers, codes). */
  mono?: boolean;
  /** type: 'select' — value/label pairs built at runtime, used instead of `options`. */
  choices?: Array<{ value: string; label: string }>;
  /** A unit dropdown rendered inside the same control (e.g. 5 [ha]); stored as its own field `name`. */
  unit?: { name: string; options: string[]; defaultValue?: string };
  /** Only shown (and only saved) while another field holds one of these values. */
  showWhen?: { field: string; equals: string[] };
  /** type: 'number' — names a `geometry` field; the hint shows that shape's computed area in ha. */
  areaFrom?: string;
}
