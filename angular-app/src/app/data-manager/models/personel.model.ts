/** Staff record. */
export interface Personel {
  id: string;
  nama: string;
  nip: string;
  golongan: string;
  jabatan: string;
  /**
   * Real FK to `Satker.id` (fixed from the original's name-string soft
   * match). Resolves cleanly for all seed rows here, unlike Iku.satkerId
   * below — see PORT_NOTES.md.
   */
  satkerId: string;
}
