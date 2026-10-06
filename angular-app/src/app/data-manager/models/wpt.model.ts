import { DrawnGeometry } from './drawn-geometry.model';

/**
 * Wilayah Pengembangan Transmigrasi — top-level development region. No parent entity. User-facing
 * label is "Wilayah" (see entity-configs.ts); this is also the record plotted on the Wilayah map
 * page's pins (WilayahMapComponent), hence `lat`/`lon`.
 *
 * Seeded (see data/seed-data.ts) from the real "Matriks 45 Kawasan Transmigrasi Prioritas Nasional
 * Tahun 2025" source spreadsheet, not fabricated — `kawasan`/`skpRingkasan`/`spRingkasan`/`kpb`/
 * `pusatSkp` are that sheet's own columns, added field-for-field the same way `geo` already was for
 * the original ERD (see PORT_NOTES.md).
 */
export interface Wpt {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  /** Column exists in the source ERD but had no data on any row (see data-manager/README.md). */
  geo?: string;
  /** The source spreadsheet's "KAWASAN" column — a shorter/common name, sometimes differently
   *  cased or worded than `nama` (its "WPT" column) for the same place. */
  kawasan?: string;
  /** Free-text summary of SKP sub-units under this WPT (the sheet's "SKP" column) — not a real FK
   *  list; the app's own `Skp` entities are unrelated fabricated prototype data (see PORT_NOTES.md,
   *  "Real Wilayah data import"). */
  skpRingkasan?: string;
  /** Free-text summary of named SP settlements (the sheet's "SP" column), same caveat as above. */
  spRingkasan?: string;
  /** "Y" if this WPT includes a Kawasan Perkotaan Baru (the sheet's "KPB?" column), undefined
   *  otherwise — transcribed as-is rather than normalized to a real boolean, matching this file's
   *  own source (a blank cell, not a literal "N"). */
  kpb?: string;
  /** "Y" if this WPT is flagged as a "Pusat SKP" (the sheet's "Pusat SKP?" column), same convention
   *  as `kpb`. */
  pusatSkp?: string;
  /** Real-world approximate coordinates (illustrative, same fabrication convention as the
   *  dashboard's `kawasan` array) — optional so existing/older records without a pin still render
   *  in the table, just absent from the map until set. */
  lat?: number;
  lon?: number;
  /** Shape drawn on the Wilayah map (point/line/area). Set via the form's map tools, applied on approval. */
  geometry?: DrawnGeometry | null;

  // ERD `wilayah` columns (see erd-master.model.ts header for conventions). All optional.
  address?: string;
  kecamatan?: string;
  kelurahan?: string;
  kodeProp?: string;
  kodeKab?: string;
  kodeKec?: string;
  kodeKel?: string;
  dasarPenetapan?: string;
  /** ERD enum `wilayah_type` — values aren't legible in the diagram, so free text. */
  wilayahType?: string;
  k1?: boolean;
  k2?: boolean;
  k3?: boolean;
  kapasitasMaksimum?: number;
  kkTotal?: number;
  hplTotal?: number;
  hplTerbit?: number;
  hplBelumTerbit?: number;
  hplPersentase?: number;
  shmTotal?: number;
  shmTerbit?: number;
  shmBelumTerbit?: number;
  shmPersentase?: number;
  /** ERD `wilayah_status_id` — FK to Wilayah Status. */
  wilayahStatusId?: string;
  /** ERD `wilayah_category_mapping` (many-to-many) simplified to one Wilayah Category. */
  wilayahCategoryId?: string;
  active?: boolean;

  /** FK to Program (jenis transmigrasi) this region is developed under. */
  programId?: string;
  /** FK to Satker — the work unit responsible for this region. */
  satkerId?: string;
  /** FK to Komoditi — the region's leading commodity. */
  komoditiUnggulanId?: string;
  /** FK to Komoditi — a secondary commodity. */
  komoditiPendukungId?: string;
  tanggalPenetapan?: string;
  tahunPenetapan?: number;
  luasKawasanHa?: number;
  luasLahanSiapHa?: number;
  jumlahPenduduk?: number;
  jumlahDesa?: number;
  keterangan?: string;

  // Profil Kawasan master fields (what the dashboard's Profil page shows; see entity-configs.ts tabs).
  jumlahKecamatan?: number;
  pendapatanPerKapita?: number;
  usiaProduktif?: number;
  usiaMuda?: number;
  usiaTua?: number;
  pasar?: number;
  kios?: number;
  bumdes?: number;
  lembagaEkonomiLain?: number;
  kontribusiPdrbPct?: number;
  nilaiSektorPertanianT?: number;
  unitUsahaPerorangan?: number;
  prodPertanian?: number;
  prodPerkebunan?: number;
  prodPangan?: number;
  prodPerikanan?: number;
  prodKehutanan?: number;
  mataPencaharian1Jenis?: string;
  mataPencaharian1Jumlah?: number;
  mataPencaharian2Jenis?: string;
  mataPencaharian2Jumlah?: number;
  mataPencaharian3Jenis?: string;
  mataPencaharian3Jumlah?: number;
  pendidikanSd?: number;
  pendidikanSmp?: number;
  pendidikanSma?: number;
  puskesmas?: number;
  pustu?: number;
  faskesMandiri?: number;
  faskesBelumTersedia?: string;
  desaMaju?: number;
  desaBerkembang?: number;
  desaTertinggal?: number;
  dokumenRkt?: boolean;
  dokumenRtsp?: boolean;
  dokumenRskp?: boolean;
  konektivitasInternet?: boolean;
  nilaiIntrans?: number;
  indeksInfrastruktur?: number;
  indeksKelembagaan?: number;
  indeksDukungan?: number;
  produk1Tahun?: string;
  produk1LuasHa?: number;
  produk1Produksi?: number;
  produk1Satuan?: string;
  produk1Pelaku?: number;
  produk2Tahun?: string;
  produk2LuasHa?: number;
  produk2Produksi?: number;
  produk2Satuan?: string;
  produk2Pelaku?: number;
  produk3KomoditiId?: string;
  produk3Tahun?: string;
  produk3LuasHa?: number;
  produk3Produksi?: number;
  produk3Satuan?: string;
  produk3Pelaku?: number;
  produk4KomoditiId?: string;
  produk4Tahun?: string;
  produk4LuasHa?: number;
  produk4Produksi?: number;
  produk4Satuan?: string;
  produk4Pelaku?: number;
  luasHplHa?: number;
  luasShmHa?: number;
}
