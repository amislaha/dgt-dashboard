/** Satuan Kawasan Pengembangan — sub-region within one WPT. */
export interface Skp {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  /**
   * Real FK to `Wpt.id`. The original stored this as a plain `indukWpt` name
   * string matched only by autocomplete, no enforced relationship — fixed
   * here to a real id reference (see PORT_NOTES.md "FK fix").
   */
  indukWptId: string;
  /** Free-text summary of member SPs, carried over as-is from the ERD. */
  cakupanSp?: string;
}
