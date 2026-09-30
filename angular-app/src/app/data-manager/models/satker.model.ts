/** Org unit / position in the Kementerian Transmigrasi structure. No parent entity. */
export interface Satker {
  id: string;
  nama: string;
  level: number;
  eselon: string;
  keterangan?: string;
  /** ERD `satker.parent_id` — self-reference to the unit above this one. */
  parentId?: string;
  /** ERD `satker.active`. */
  active?: boolean;
}
