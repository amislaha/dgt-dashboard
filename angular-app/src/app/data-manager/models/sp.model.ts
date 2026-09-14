/** Satuan Permukiman — settlement unit within one SKP. */
export interface Sp {
  id: string;
  nama: string;
  jenisStatus: string;
  provinsi: string;
  kabupaten: string;
  /**
   * Real FK to `Skp.id` / `Wpt.id` (fixed from the original's name-string
   * soft match, see PORT_NOTES.md). Nullable because the source ERD's
   * "SP 1 Timika" row references "SKP A Timika" / "WPT Timika", neither of
   * which exists as a record in the WPT/SKP sheets (data-manager/README.md
   * "Known data-quality gaps") — left unresolved rather than invented.
   */
  indukSkpId: string | null;
  indukWptId: string | null;
  kk?: number;
}
