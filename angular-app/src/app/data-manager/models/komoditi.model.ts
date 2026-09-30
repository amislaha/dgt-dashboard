/** Commodity category. No parent entity. */
export interface Komoditi {
  id: string;
  nama: string;
  /** ERD `komoditas` columns beyond the name (code/description/sequence/active). */
  code?: string;
  description?: string;
  sequence?: number;
  active?: boolean;
}
