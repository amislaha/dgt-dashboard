/** Wilayah Pengembangan Transmigrasi — top-level development region. No parent entity. */
export interface Wpt {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  /** Column exists in the source ERD but had no data on any row (see data-manager/README.md). */
  geo?: string;
}
