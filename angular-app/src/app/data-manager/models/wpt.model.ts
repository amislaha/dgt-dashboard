/**
 * Wilayah Pengembangan Transmigrasi — top-level development region. No parent entity. User-facing
 * label is "Wilayah" (see entity-configs.ts); this is also the record plotted on the Wilayah map
 * page's pins (WilayahMapComponent), hence `lat`/`lon`.
 *
 * Seeded (see data/seed-data.ts) from the real "Matriks 45 Kawasan Transmigrasi Prioritas Nasional
 * Tahun 2025" source spreadsheet, not fabricated — `kawasan`/`skpRingkasan`/`spRingkasan`/`kpb`/
 * `pusatSkp` are that sheet's own columns, added field-for-field the same way `geo` already was for
 * the original ERD (see PORT_NOTES.md).
 */
export interface Wpt {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  /** Column exists in the source ERD but had no data on any row (see data-manager/README.md). */
  geo?: string;
  /** The source spreadsheet's "KAWASAN" column — a shorter/common name, sometimes differently
   *  cased or worded than `nama` (its "WPT" column) for the same place. */
  kawasan?: string;
  /** Free-text summary of SKP sub-units under this WPT (the sheet's "SKP" column) — not a real FK
   *  list; the app's own `Skp` entities are unrelated fabricated prototype data (see PORT_NOTES.md,
   *  "Real Wilayah data import"). */
  skpRingkasan?: string;
  /** Free-text summary of named SP settlements (the sheet's "SP" column), same caveat as above. */
  spRingkasan?: string;
  /** "Y" if this WPT includes a Kawasan Perkotaan Baru (the sheet's "KPB?" column), undefined
   *  otherwise — transcribed as-is rather than normalized to a real boolean, matching this file's
   *  own source (a blank cell, not a literal "N"). */
  kpb?: string;
  /** "Y" if this WPT is flagged as a "Pusat SKP" (the sheet's "Pusat SKP?" column), same convention
   *  as `kpb`. */
  pusatSkp?: string;
  /** Real-world approximate coordinates (illustrative, same fabrication convention as the
   *  dashboard's `kawasan` array) — optional so existing/older records without a pin still render
   *  in the table, just absent from the map until set. */
  lat?: number;
  lon?: number;
}
