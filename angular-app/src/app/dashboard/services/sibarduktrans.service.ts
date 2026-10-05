import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Data source for the "Data Transmigran" module — mirrors the four statistics on
 * https://sibarduktrans.transmigrasi.go.id/dataTransmigran (Sibarduktrans, Sistem Informasi
 * Penataan Persebaran Penduduk di Kawasan Transmigrasi).
 *
 * THERE IS NO API YET. Every method returns an Observable of illustrative sample data shaped like
 * the figures on that page (province lists and proportions are copied from what the page showed;
 * other years are seeded scalings of it). The Observable return type is deliberate: when the real
 * endpoints exist, only the method bodies here change (e.g. to `this.http.get(...)`), not the
 * component that consumes them.
 */
export type SibUnit = 'KK' | 'Jiwa';

export interface PeriodeStat {
  tahun: number;
  tpsTpa: number;
  tps: number;
  tpa: number;
}

export interface ProvinsiStat {
  nama: string;
  nilai: number;
  /** Share of the year's total, 0–100 (one decimal). */
  pct: number;
}

export interface UmurStat {
  label: string;
  nilai: number;
  pct: number;
  color: string;
}

export const SIB_TAHUN = [2026, 2025, 2024, 2023, 2022];

/** Rough persons-per-KK used to turn KK figures into Jiwa. */
const JIWA_PER_KK = 3.4;

/** Per-year scaling of the 2026 base figures. */
const YEAR_FACTOR: { [tahun: number]: number } = { 2026: 1, 2025: 1.3, 2024: 0.8, 2023: 1.8, 2022: 14 };

/** KK per period type, by year (the page's "Per Periode" chart: TPS dan TPA / TPS / TPA). */
const PERIODE_KK: PeriodeStat[] = [
  { tahun: 2022, tpsTpa: 2150, tps: 1240, tpa: 910 },
  { tahun: 2023, tpsTpa: 24, tps: 4, tpa: 17 },
  { tahun: 2024, tpsTpa: 14, tps: 2, tpa: 8 },
  { tahun: 2025, tpsTpa: 11, tps: 2, tpa: 12 },
  { tahun: 2026, tpsTpa: 3, tps: 1, tpa: 1 }
];

/** Origin provinces (2026 base, KK). */
const ASAL_KK: Array<[string, number]> = [
  ['JAWA TENGAH', 20], ['DAERAH ISTIMEWA YOGYAKARTA', 16], ['JAWA TIMUR', 25], ['BANTEN', 6], ['LAMPUNG', 10],
  ['JAWA BARAT', 14], ['DKI JAKARTA', 5], ['BALI', 3], ['NUSA TENGGARA BARAT', 2], ['SUMATERA SELATAN', 4]
];

/** Destination provinces (2026 base, KK) — same set and order as the page's chart. */
const TUJUAN_KK: Array<[string, number]> = [
  ['SUMATERA BARAT', 10], ['KALIMANTAN BARAT', 9], ['SULAWESI TENGGARA', 1], ['KALIMANTAN SELATAN', 4], ['SULAWESI TENGAH', 10],
  ['KALIMANTAN TIMUR', 22], ['MALUKU', 1], ['KALIMANTAN TENGAH', 14], ['KALIMANTAN UTARA', 10], ['PAPUA SELATAN', 0],
  ['PAPUA', 2], ['SULAWESI BARAT', 3], ['MALUKU UTARA', 2], ['SULAWESI SELATAN', 15], ['SULAWESI UTARA', 2],
  ['PAPUA BARAT', 2], ['ACEH', 1], ['GORONTALO', 0], ['RIAU', 13], ['JAMBI', 3], ['SUMATERA SELATAN', 16],
  ['BENGKULU', 3], ['KEPULAUAN BANGKA BELITUNG', 0], ['NUSA TENGGARA BARAT', 1], ['NUSA TENGGARA TIMUR', 0]
];

/** "Jumlah Animo Transmigrasi" (KK) — the page's counter reads 0 until its API loads, so this is a made-up sample. */
const ANIMO_KK = 18420;

/** Age-group shares (%), as on the page (Dewasa takes the remainder so they sum to 100). */
const UMUR: Array<{ label: string; pct: number; color: string }> = [
  { label: 'Bayi dan Balita (0 - 4 tahun 11 bulan)', pct: 1.3, color: '#a78bfa' },
  { label: 'Anak-anak (5 tahun - 10 tahun)', pct: 0, color: '#38a3e8' },
  { label: 'Remaja (11 tahun - 18 tahun)', pct: 0, color: '#e5262c' },
  { label: 'Dewasa (19 tahun - 60 tahun)', pct: 98.1, color: '#fbbf24' },
  { label: 'Lansia (61 tahun dst)', pct: 0.6, color: '#2f9e6a' }
];

@Injectable({ providedIn: 'root' })
export class SibarduktransService {
  /** "Jumlah Animo Transmigrasi" — total registered interest in transmigration. */
  getJumlahAnimo(unit: SibUnit): Observable<number> {
    return of(Math.round(ANIMO_KK * (unit === 'Jiwa' ? JIWA_PER_KK : 1)));
  }

  /** "Statistik Jumlah Transmigran Per Periode". */
  getPeriode(unit: SibUnit): Observable<PeriodeStat[]> {
    const k = unit === 'Jiwa' ? JIWA_PER_KK : 1;
    return of(
      PERIODE_KK.map(p => ({
        tahun: p.tahun,
        tpsTpa: Math.round(p.tpsTpa * k),
        tps: Math.round(p.tps * k),
        tpa: Math.round(p.tpa * k)
      }))
    );
  }

  /** "Statistik Jumlah Transmigran Per Provinsi Asal". */
  getPerProvinsiAsal(tahun: number, unit: SibUnit): Observable<ProvinsiStat[]> {
    return of(this.withShare(ASAL_KK, tahun, unit));
  }

  /** "Statistik Jumlah Transmigran Per Provinsi Tujuan". */
  getPerProvinsiTujuan(tahun: number, unit: SibUnit): Observable<ProvinsiStat[]> {
    return of(this.withShare(TUJUAN_KK, tahun, unit));
  }

  /** "Statistik Jumlah Transmigran Per Kelompok Umur". */
  getPerKelompokUmur(tahun: number, unit: SibUnit): Observable<UmurStat[]> {
    const total = this.scale(TUJUAN_KK.reduce((s, r) => s + r[1], 0), tahun, unit);
    return of(UMUR.map(u => ({ label: u.label, pct: u.pct, color: u.color, nilai: Math.round((total * u.pct) / 100) })));
  }

  private scale(kk: number, tahun: number, unit: SibUnit): number {
    return Math.round(kk * (YEAR_FACTOR[tahun] || 1) * (unit === 'Jiwa' ? JIWA_PER_KK : 1));
  }

  private withShare(rows: Array<[string, number]>, tahun: number, unit: SibUnit): ProvinsiStat[] {
    const scaled = rows.map(([nama, kk]) => ({ nama, nilai: this.scale(kk, tahun, unit) }));
    const total = scaled.reduce((s, r) => s + r.nilai, 0) || 1;
    return scaled.map(r => ({ ...r, pct: Math.round((r.nilai / total) * 1000) / 10 }));
  }
}
