/**
 * Wilayah Pengembangan Transmigrasi — top-level development region. No parent entity. User-facing
 * label is "Wilayah" (see entity-configs.ts); this is also the record plotted on the Wilayah map
 * page's pins (WilayahMapComponent), hence `lat`/`lon`.
 */
export interface Wpt {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  /** Column exists in the source ERD but had no data on any row (see data-manager/README.md). */
  geo?: string;
  /** Real-world approximate coordinates (illustrative, same fabrication convention as the
   *  dashboard's `kawasan` array) — optional so existing/older records without a pin still render
   *  in the table, just absent from the map until set. */
  lat?: number;
  lon?: number;
}
