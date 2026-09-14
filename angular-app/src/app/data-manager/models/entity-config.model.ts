import { EntityKey } from './entity-key.model';
import { FieldConfig } from './field-config.model';

/**
 * One list column. Ports the original `columns` array. When `fk` is set the
 * raw id value in that column is resolved through `EntityRegistryService` to
 * the referenced record's `titleField` for display (see
 * EntityListComponent.resolveFkLabel) — the id itself is never shown to the
 * user, matching the original showing the human-readable name.
 */
export interface EntityColumnConfig<T = any> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  fk?: EntityKey;
}

/**
 * Config-object-driven entity description, the direct port of one entry in
 * the original `ENTITIES` object (data-manager/index.html lines ~438-568).
 * `EntityListComponent`/`EntityFormComponent` are generic components driven
 * entirely by this config plus `EntityCrudService`, rather than one
 * hand-written component pair per entity — see PORT_NOTES.md.
 */
export interface EntityConfig<T extends { id: string } = any> {
  key: EntityKey;
  label: string;
  sub: string;
  idPrefix: string;
  titleField: keyof T & string;
  columns: EntityColumnConfig<T>[];
  fields: FieldConfig<T>[];
}
