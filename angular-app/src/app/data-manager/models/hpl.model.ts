import { DrawnGeometry } from './drawn-geometry.model';

export const HPL_GENERASI = ['Dirjen Agraria (s.d. 1989)', 'BPN awal (1990–1999)', 'BPN & ATR/BPN (2000–2025)', 'Tidak diketahui'];
export const HPL_DOKUMEN = ['Ada', 'Tidak ada'];
export const HPL_INVENTARISASI = ['Belum', 'Rencana 2026', 'Sudah'];
export const HPL_PRIORITAS = ['Tinggi', 'Sedang', 'Rendah'];

/**
 * One HPL (Hak Pengelolaan) lokasi, managed on its own "HPL" page rather than under a kawasan —
 * columns follow the Daftar Induk HPL Transmigrasi (nomor/tahun/generasi SK, luas, sertifikat,
 * peta, inventarisasi, prioritas). `wilayahId` optionally ties it to a kawasan, but an HPL stands on
 * its own. Read by the dashboard's "HPL Transmigrasi" overview (same localStorage key).
 *
 * Not the same list as the Wilayah editor's per-kawasan "HPL" tab (WilayahChildService), which
 * predates this page and is kept as-is.
 */
export interface Hpl {
  id: string;
  nomorSk: string;
  tahunSk?: number;
  generasi?: string;
  /** Optional link to the kawasan this HPL lies in. */
  wilayahId?: string;
  provinsi: string;
  kabupaten: string;
  /** Luas HPL (ha). */
  luas?: number;
  /** Is the SK document on file ("Ada" / "Tidak ada"). */
  dokumenSk?: string;
  jumlahSertifikat?: number;
  /** Certified area (ha); the dashboard caps it at `luas`. */
  luasSertifikat?: number;
  /** Certificates whose original is missing (only a scan, or nothing). */
  sertifikatAsliHilang?: number;
  adaPeta?: boolean;
  inventarisasi?: string;
  prioritas?: string;
  description?: string;
  lat?: number;
  lon?: number;
  geometry?: DrawnGeometry | null;
  color?: string;
}
