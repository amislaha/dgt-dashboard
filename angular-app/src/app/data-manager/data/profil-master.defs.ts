import { ProdukJenis, ProfilCategory, ProfilGroup, ProfilMeasure, WilayahStatus } from '../models/erd-master.model';

/**
 * Seed definitions for the Profil / Produk lookup tables (Wilayah Status, Profil Category / Group /
 * Measure, Produk Jenis). They are the indicator catalogue that follows the "To fill" import template
 * (Kategori Profil > Sub Kategori > Indikator + Satuan). The per-wilayah values themselves are plain
 * fields on the Wilayah record and its form tabs (Demografi, Ekonomi, Sosial, Perencanaan & Indeks,
 * Produk Unggulan), not rows in a separate transaction table.
 * Ids are positional (pfc1.., pfg1.., pfm1.., pdj1.., wst1..).
 */

/** The five land-legality statuses used by the dashboard's `statusHpl`, in the same order. */
export const STATUS_HPL_NAMES = ['Ada SK HPL', 'Bersertifikat HPL', 'Terinventarisasi Ulang', 'Tervaluasi HPL', 'Tersertifikat SHM'];

export const WILAYAH_STATUS_SEED: WilayahStatus[] = STATUS_HPL_NAMES.map((name, i) => ({
  id: 'wst' + (i + 1),
  code: 'HPL-0' + (i + 1),
  name,
  description: 'Status legalitas lahan (HPL/SHM) kawasan',
  sequence: i + 1,
  active: true
}));

const CATEGORY_DEFS: Array<[string, string]> = [
  ['DEM', 'Demografi'], ['EKO', 'Ekonomi'], ['SOS', 'Sosial'], ['PRC', 'Perencanaan'], ['IDX', 'Indeks'], ['WIL', 'Wilayah'], ['LEG', 'Legalitas Lahan']
];

/** [category number (1-based), sub-category name]. */
const GROUP_DEFS: Array<[number, string]> = [
  [1, 'Struktur usia'],
  [2, 'Sarana & prasarana ekonomi'], [2, 'Kelembagaan ekonomi'], [2, 'Pendapatan'], [2, 'Mata pencaharian'],
  [2, 'Produk unggulan'], [2, 'Kontribusi ekonomi'], [2, 'Produktivitas sektor'],
  [3, 'Pendidikan'], [3, 'Kesehatan'], [3, 'Status desa (IDM)'],
  [4, 'Dokumen perencanaan'], [4, 'Konektivitas digital'],
  [5, 'Intrans'], [5, 'Kesiapan infrastruktur'], [5, 'Kelembagaan'], [5, 'Dukungan investasi'],
  [6, 'Administrasi'],
  [7, 'HPL'], [7, 'SHM']
];

/** [code, group number (1-based), indicator, unit]. Measure number = position + 1. */
export const MEASURE_DEFS: Array<[string, number, string, string]> = [
  ['DEM-01', 1, 'Penduduk usia produktif (15-65)', 'jiwa'],
  ['DEM-02', 1, 'Penduduk usia < 15 tahun', 'jiwa'],
  ['DEM-03', 1, 'Penduduk usia > 65 tahun', 'jiwa'],
  ['EKO-01', 2, 'Jumlah pasar', 'unit'],
  ['EKO-02', 2, 'Jumlah kios', 'unit'],
  ['EKO-03', 3, 'Jumlah Bumdes', 'unit'],
  ['EKO-04', 3, 'Jumlah lembaga ekonomi lain', 'unit'],
  ['EKO-05', 4, 'Pendapatan per kapita', 'Rp/bulan'],
  ['EKO-06', 5, 'Penduduk menurut mata pencaharian', 'orang'],
  ['EKO-07', 6, 'Pelaku usaha komoditas unggulan', 'orang'],
  ['EKO-08', 7, 'Kontribusi sektor PDRB ke kabupaten', '%'],
  ['EKO-09', 7, 'Nilai Sektor Pertanian, Kehutanan & Perikanan', 'Rp T'],
  ['EKO-10', 7, 'Unit Usaha Perorangan (SP 2023)', 'unit'],
  ['EKO-11', 8, 'Produktivitas sektor', 't/Ha'],
  ['SOS-01', 9, 'Jumlah SD', 'satuan pendidikan'],
  ['SOS-02', 9, 'Jumlah SMP/setara', 'satuan pendidikan'],
  ['SOS-03', 9, 'Jumlah SMA/setara', 'satuan pendidikan'],
  ['SOS-04', 10, 'Jumlah Puskesmas', 'unit'],
  ['SOS-05', 10, 'Jumlah Pustu', 'unit'],
  ['SOS-06', 10, 'Jumlah fasilitas kesehatan mandiri', 'unit'],
  ['SOS-07', 10, 'Jenis fasilitas kesehatan belum tersedia', 'jenis'],
  ['SOS-08', 11, 'Jumlah desa maju', 'desa'],
  ['SOS-09', 11, 'Jumlah desa berkembang', 'desa'],
  ['SOS-10', 11, 'Jumlah desa tertinggal', 'desa'],
  ['PRC-01', 12, 'Dokumen perencanaan tersedia (1 = ada, 0 = belum)', '1/0'],
  ['PRC-02', 13, 'Konektivitas internet tersedia (1 = ada, 0 = belum)', '1/0'],
  ['IDX-01', 14, 'Nilai Intrans', 'skala 0-100'],
  ['IDX-02', 15, 'Indeks kesiapan infrastruktur', 'skala 1-5'],
  ['IDX-03', 16, 'Indeks kelembagaan', 'skala 1-5'],
  ['IDX-04', 17, 'Indeks dukungan investasi', 'skala 1-5'],
  ['WIL-01', 18, 'Jumlah kecamatan/distrik', 'distrik'],
  ['LEG-01', 19, 'Luas HPL', 'ha'],
  ['LEG-02', 20, 'Luas SHM', 'ha']
];

export const PROFIL_CATEGORY_SEED: ProfilCategory[] = CATEGORY_DEFS.map(([code, name], i) => ({
  id: 'pfc' + (i + 1), code, name, sequence: i + 1, active: true
}));

export const PROFIL_GROUP_SEED: ProfilGroup[] = GROUP_DEFS.map(([cat, name], i) => ({
  id: 'pfg' + (i + 1), code: CATEGORY_DEFS[cat - 1][0] + '-G' + (i + 1), name, categoryId: 'pfc' + cat, sequence: i + 1, active: true
}));

export const PROFIL_MEASURE_SEED: ProfilMeasure[] = MEASURE_DEFS.map(([code, group, name, unit], i) => ({
  id: 'pfm' + (i + 1),
  code,
  name,
  description: CATEGORY_DEFS[GROUP_DEFS[group - 1][0] - 1][1] + ' > ' + GROUP_DEFS[group - 1][1] + ' (' + unit + ')',
  sequence: i + 1,
  active: true
}));

export const PRODUK_JENIS_SEED: ProdukJenis[] = ['Pangan', 'Peternakan', 'Perkebunan', 'Pertambangan'].map((name, i) => ({
  id: 'pdj' + (i + 1), code: 'PJ-0' + (i + 1), name, sequence: i + 1, active: true
}));
