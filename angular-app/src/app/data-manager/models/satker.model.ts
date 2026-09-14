/** Org unit / position in the Kementerian Transmigrasi structure. No parent entity. */
export interface Satker {
  id: string;
  nama: string;
  level: number;
  eselon: string;
  keterangan?: string;
}
