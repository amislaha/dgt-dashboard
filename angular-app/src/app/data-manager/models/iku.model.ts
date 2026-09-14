/** Indikator Kinerja Utama — key performance indicator owned by a satker/direktorat. */
export interface Iku {
  id: string;
  kode?: string;
  satuan?: 'Indeks' | 'Persen' | 'Nilai';
  /**
   * Real FK to `Satker.id`. Left `undefined` on every seed row here on
   * purpose: the ERD's free-text "Satker" column for IKU uses person/role
   * titles ("Direktur Pembangunan Kawasan Transmigrasi (PKT)") while the
   * Satker entity uses org-unit names ("Direktorat Pembangunan Kawasan
   * Transmigrasi") — they don't string-match, a known gap documented in
   * data-manager/README.md. Required going forward in the form (see
   * config/entity-configs.ts) so reconciling a row means picking a real
   * Satker record, same as the original's behaviour for this field.
   */
  satkerId?: string;
  /** Original free-text Satker value from the ERD, kept for display/reconciliation. */
  satkerLabel?: string;
  /** Real FK to `Program.id` — only set on the 2 seed rows that had "Jenis Program" filled in. */
  programId?: string;
  indikator: string;
  pic?: string;
  sasaranStrategis?: string;
}
