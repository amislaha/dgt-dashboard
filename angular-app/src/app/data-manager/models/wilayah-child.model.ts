import { EntityKey } from './entity-key.model';
import { FieldConfig } from './field-config.model';

/** The per-kawasan record lists shown as tabs in the Wilayah editor (after "Umum"). */
export type WilayahChildKey = 'kategori' | 'hpl' | 'shm' | 'kk' | 'profil' | 'produk' | 'psu' | 'iku' | 'rekomendasi' | 'target';

/** One record of a child list. `wilayahId` points at the owning Wpt. */
export interface WilayahChildRecord {
  id: string;
  wilayahId: string;
  [field: string]: any;
}

/** Looks up display names for ids held by child records (FKs into master data, or sibling child records). */
export interface ChildResolver {
  name(entity: EntityKey, id: string | null | undefined): string;
  child(key: WilayahChildKey, id: string | null | undefined): WilayahChildRecord | undefined;
}

export interface WilayahChildColumn {
  label: string;
  value: (row: WilayahChildRecord, r: ChildResolver) => string;
  /** The row's name cell: bold, with the colour square / secondary text beside it. */
  primary?: boolean;
  secondary?: (row: WilayahChildRecord, r: ChildResolver) => string;
  numeric?: boolean;
  muted?: boolean;
  /** Rendered as a coloured status dot + label. */
  status?: boolean;
}

export interface WilayahChildConfig {
  key: WilayahChildKey;
  /** Tab label. */
  tab: string;
  /** Used in buttons: "Tambah {noun}", "Hapus {noun}". */
  noun: string;
  /** Heading above the list. */
  heading: string;
  /** "3 sertifikat · 1.240 ha" under the heading. */
  summary: (rows: WilayahChildRecord[]) => string;
  /** Detail page title. */
  title: (row: WilayahChildRecord, r: ChildResolver) => string;
  /** Muted text next to the detail title, e.g. "Peternakan · 2026". */
  subtitle?: (row: WilayahChildRecord, r: ChildResolver) => string;
  /** Title in monospace (certificate numbers). */
  mono?: boolean;
  colorField?: string;
  statusField?: string;
  /** Adds a "Semua tahun" filter over this year. */
  year?: (row: WilayahChildRecord) => string;
  sort?: (a: WilayahChildRecord, b: WilayahChildRecord) => number;
  columns: WilayahChildColumn[];
  fields: FieldConfig[];
  /** Records live in this registry entity instead of the editor's own store (it already has a `wilayahId`). */
  entity?: EntityKey;
}
