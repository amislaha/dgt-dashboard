import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Kawasan, SCurve, seededRandom } from '../../services/dashboard-data.service';

/** Total national budget envelope (Rp miliar) — not tracked as its own field anywhere in the data
 *  layer, so this is one fixed illustrative figure ("Pagu DIPA 2026"). Each kawasan's own pagu below
 *  is a seeded share of it (summing back to exactly this), and its realisasi is that pagu times the
 *  kawasan's existing `anggaranPct` — so the KPI tiles, the Kurva S end-point and the per-kawasan
 *  list all tie back to the same numbers instead of being separately hand-picked. */
const PAGU_TOTAL_MILIAR = 310;

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const BULAN_PANJANG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

type Band = 'good' | 'mid' | 'low';
type BandFilter = 'all' | Band;

interface Row {
  nama: string;
  provinsi: string;
  pagu: number;
  realisasi: number;
  pct: number;
  band: Band;
}

// Chart geometry (viewBox units).
const CH = { w: 560, h: 200, left: 44, right: 548, top: 16, bottom: 170 };

/**
 * "Monitoring Program & Anggaran" — the budget page, laid out after the reference screenshot: four
 * KPI tiles, a Kurva S card (rencana vs realisasi, with the plan/realisation/deviation read-outs)
 * and a per-kawasan realisasi list split into ≥60% / 25–59% / <25% bands.
 *
 * "Periode" is the current calendar month and "sisa tahun anggaran" is counted to 31 Desember of the
 * current year, so the page rolls forward on its own. The Kurva S realisasi series is the dataset's
 * own `sCurve.realisasi`, rescaled so its value for the current month equals the realisasi computed
 * from the per-kawasan figures — all of it illustrative, like the rest of the dataset.
 */
@Component({
  selector: 'dgt-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  readonly bulan = BULAN;
  readonly ch = CH;
  readonly yTicks = [0, 25, 50, 75, 100];

  rows: Row[] = [];
  filter: BandFilter = 'all';

  paguMiliar = PAGU_TOTAL_MILIAR;
  realisasiMiliar = 0;
  penyerapanPct = 0;
  sisaHari = 0;
  hariBerjalan = 0;
  hariTahun = 365;

  tahun = new Date().getFullYear();
  periodeIdx = 0;
  periodeLabel = '';
  rencanaPct = 0;
  deviasi = 0;

  rencana: number[] = [];
  realisasi: number[] = [];

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    const kawasan = this.data.getKawasan();
    this.buildRows(kawasan);
    this.buildCalendar();
    this.buildCurve(this.data.getSCurve());
  }

  private buildRows(kawasan: Kawasan[]): void {
    const weights = kawasan.map(k => 0.5 + seededRandom('pagu-' + k.id + '-' + k.nama)());
    const wSum = weights.reduce((s, w) => s + w, 0);
    this.rows = kawasan
      .map((k, i) => {
        const pagu = (PAGU_TOTAL_MILIAR * weights[i]) / wSum;
        return {
          nama: k.nama,
          provinsi: k.provinsi,
          pagu,
          realisasi: (pagu * k.anggaranPct) / 100,
          pct: k.anggaranPct,
          band: (k.anggaranPct >= 60 ? 'good' : k.anggaranPct >= 25 ? 'mid' : 'low') as Band
        };
      })
      .sort((a, b) => a.pct - b.pct);
    this.realisasiMiliar = this.rows.reduce((s, r) => s + r.realisasi, 0);
    this.penyerapanPct = Math.round((this.realisasiMiliar / PAGU_TOTAL_MILIAR) * 100);
  }

  private buildCalendar(): void {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1).getTime();
    const endOfYear = new Date(year, 11, 31).getTime();
    this.hariTahun = Math.round((new Date(year + 1, 0, 1).getTime() - startOfYear) / 86400000);
    this.hariBerjalan = Math.round((new Date(year, now.getMonth(), now.getDate()).getTime() - startOfYear) / 86400000);
    this.sisaHari = Math.round((endOfYear - new Date(year, now.getMonth(), now.getDate()).getTime()) / 86400000);
    this.periodeIdx = now.getMonth();
    this.periodeLabel = BULAN_PANJANG[this.periodeIdx];
  }

  private buildCurve(s: SCurve): void {
    this.rencana = s.rencana.slice();
    const base = s.realisasi[this.periodeIdx] || s.realisasi.filter((v): v is number => v !== null).pop() || 1;
    const factor = this.penyerapanPct / base;
    this.realisasi = [];
    for (let i = 0; i <= this.periodeIdx; i++) {
      const v = s.realisasi[i];
      this.realisasi.push(v === null ? this.penyerapanPct : Math.min(100, Math.round(v * factor)));
    }
    this.rencanaPct = this.rencana[this.periodeIdx];
    this.deviasi = this.penyerapanPct - this.rencanaPct;
  }

  // ---------- list ----------

  count(b: BandFilter): number {
    return b === 'all' ? this.rows.length : this.rows.filter(r => r.band === b).length;
  }

  get filteredRows(): Row[] {
    return this.rows.filter(r => this.filter === 'all' || r.band === this.filter);
  }

  setFilter(f: BandFilter): void {
    this.filter = f;
  }

  // ---------- formatting ----------

  /** Indonesian decimal comma, one fraction digit. */
  d1(n: number): string {
    return n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  // ---------- chart ----------

  private x(i: number): number {
    return CH.left + (i * (CH.right - CH.left)) / 11;
  }

  y(v: number): number {
    return CH.bottom - (v / 100) * (CH.bottom - CH.top);
  }

  xAt(i: number): number {
    return this.x(i);
  }

  /** Smooth cubic path (Catmull-Rom → Bézier) through the given values at months 0..n-1. */
  private smooth(values: number[]): string {
    const pts = values.map((v, i) => [this.x(i), this.y(v)]);
    if (pts.length < 2) {
      return '';
    }
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  get rencanaPath(): string {
    return this.smooth(this.rencana);
  }

  get realisasiPath(): string {
    return this.smooth(this.realisasi);
  }

  get realisasiArea(): string {
    const last = this.realisasi.length - 1;
    return `${this.realisasiPath} L${this.x(last).toFixed(1)},${CH.bottom} L${this.x(0).toFixed(1)},${CH.bottom} Z`;
  }
}
