/**
 * One leading-product record for a Wilayah (sheet "Produk" of the import template: ID Wilayah,
 * Tahun, Sektor, Komoditas, Luas Area, Satuan Luas, Produksi, Satuan Produksi). `sektorId` is an FK
 * to Produk Jenis and `komoditiId` to Komoditas. For livestock the production unit is EKOR, not TON.
 */
export interface ProdukWilayah {
  id: string;
  wilayahId: string;
  /** 4-digit year as text, per the template. */
  tahun: string;
  sektorId: string;
  komoditiId: string;
  luasArea?: number;
  satuanLuas?: string;
  produksi?: number;
  satuanProduksi?: string;
  keterangan?: string;
}
