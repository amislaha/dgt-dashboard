/**
 * One profile indicator value for a Wilayah (sheet "Profil" of the import template: ID Wilayah,
 * Kategori Profil, Sub Kategori, Indikator, Nilai, Satuan). The category / group / measure are FKs
 * to the Profil Category / Group / Measure lookups. `keterangan` carries the sub-dimension of an
 * indicator that repeats (e.g. which occupation, commodity or sector the value is for).
 */
export interface ProfilWilayah {
  id: string;
  wilayahId: string;
  categoryId: string;
  groupId: string;
  measureId: string;
  nilai?: number;
  satuan?: string;
  keterangan?: string;
}
