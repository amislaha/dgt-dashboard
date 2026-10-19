import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HplAgg, HplGroup, HplOverviewService, HplRow } from '../../services/hpl-overview.service';

interface Kpi {
  label: string;
  value: string;
  icon: string;
  /** Delta vs nasional, already formatted; null when the scope is nasional itself. */
  delta: string | null;
  neg: boolean;
  /** 'poin' deltas get a trend arrow, absolute ones don't. */
  isPct: boolean;
  sub: string;
}

interface SummaryCard {
  title: string;
  value: string;
  bmLabel: string;
  bmValue: string;
  tone: 'good' | 'bad' | 'info';
  note: string;
}

interface StackSeg {
  label: string;
  luas: number;
  color: string;
}

interface ChartBar {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  py: number;
  label: string;
  title: string;
}

/**
 * "HPL Transmigrasi" — Executive Overview of HPL (Hak Pengelolaan) lokasi, laid out after the
 * "Pusat Kendali HPL Transmigrasi" overview: a provinsi/kabupaten scope filter, five KPIs compared
 * against the national figure, a luas-vs-% bersertifikat combo chart (by wilayah or SK generation),
 * an executive summary, and field-readiness (inventarisasi + peta) bars.
 *
 * Data comes from the Data Manager's "HPL" page (see HplOverviewService).
 */
@Component({
  selector: 'dgt-hpl',
  templateUrl: './hpl.component.html',
  styleUrls: ['./hpl.component.scss']
})
export class HplComponent implements OnInit, OnDestroy {
  provinsiOptions: string[] = [];
  kabupatenOptions: string[] = [];

  prov = '';
  kab = '';
  dim: 'wil' | 'gen' = 'wil';

  scopeLabel = 'Nasional';
  kpis: Kpi[] = [];
  summary: SummaryCard[] = [];
  inventarisasi: StackSeg[] = [];
  peta: StackSeg[] = [];
  totalLuas = 0;

  chartTitle = '';
  chartSub = '';
  readonly chart = { w: 760, h: 300, ml: 54, mr: 46, mt: 14, mb: 58 };
  ticks: Array<{ y: number; left: string; right: string }> = [];
  bars: ChartBar[] = [];
  linePoints = '';

  private all: HplRow[] = [];
  private sub?: Subscription;

  constructor(private readonly hpl: HplOverviewService) {}

  ngOnInit(): void {
    this.sub = this.hpl.rows().subscribe(rows => {
      this.all = rows;
      this.provinsiOptions = this.hpl.provinsiOf(rows);
      if (this.prov && this.provinsiOptions.indexOf(this.prov) === -1) {
        this.prov = '';
        this.kab = '';
      }
      this.kabupatenOptions = this.hpl.kabupatenOf(rows, this.prov);
      this.recompute();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onProv(): void {
    this.kab = '';
    this.kabupatenOptions = this.hpl.kabupatenOf(this.all, this.prov);
    this.recompute();
  }

  setDim(d: 'wil' | 'gen'): void {
    this.dim = d;
    this.recompute();
  }

  recompute(): void {
    const rows = this.all.filter(r => (!this.prov || r.prov === this.prov) && (!this.kab || r.kab === this.kab));
    const o = this.hpl.agg(rows);
    const nas = this.hpl.agg(this.all);
    const scoped = !!this.prov;
    this.scopeLabel = this.kab ? `${this.kab}, ${this.prov}` : this.prov || 'Nasional';
    this.totalLuas = o.luas;

    this.kpis = this.buildKpis(o, nas, scoped);
    this.summary = this.buildSummary(o, nas, scoped);

    this.inventarisasi = [
      { label: 'Sudah', luas: o.linv, color: 'var(--good)' },
      { label: 'Rencana 2026', luas: o.rinv, color: 'var(--warn)' },
      { label: 'Belum', luas: o.luas - o.linv - o.rinv, color: 'var(--border)' }
    ];
    this.peta = [
      { label: 'Ada peta', luas: o.lpeta, color: 'var(--series-2)' },
      { label: 'Belum ditemukan', luas: o.luas - o.lpeta, color: 'var(--border)' }
    ];

    let groups: HplGroup[];
    if (this.dim === 'gen') {
      groups = this.hpl.byGenerasi(rows);
      this.chartTitle = 'Luas HPL & Sertifikasi per Generasi SK';
      this.chartSub = `Generasi penerbit SK · ${this.scopeLabel}`;
    } else {
      groups = this.hpl.byWilayah(rows, scoped);
      this.chartTitle = 'Luas HPL & Tingkat Sertifikasi';
      this.chartSub = `12 ${scoped ? 'kabupaten' : 'provinsi'} terluas · ${this.scopeLabel}`;
    }
    this.buildChart(groups);
  }

  fmt(v: number, d = 0): string {
    return v.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  pct(a: number, b: number, d = 1): string {
    return b ? this.fmt((100 * a) / b, d) + '%' : '–';
  }

  segWidth(s: StackSeg): number {
    return this.totalLuas ? (100 * s.luas) / this.totalLuas : 0;
  }

  private buildKpis(o: HplAgg, nas: HplAgg, scoped: boolean): Kpi[] {
    const abs = (cur: number, ref: number) => {
      const d = cur - ref;
      return { delta: scoped ? (d >= 0 ? '+' : '') + this.fmt(d) : null, neg: d < 0, isPct: false };
    };
    const rel = (cur: number, ref: number) => {
      const d = (cur - ref) * 100;
      return { delta: scoped ? (d >= 0 ? '+' : '') + this.fmt(d, 1) + ' poin' : null, neg: d < 0, isPct: true };
    };
    const r = (a: number, b: number) => (b ? a / b : 0);
    return [
      { label: 'Total Lokasi HPL', value: this.fmt(o.lok), icon: 'M2 13h12M4 13V7l4-4 4 4v6', ...abs(o.lok, nas.lok), sub: `${this.fmt(o.sk)} SK` },
      { label: 'Luas Lahan', value: `${this.fmt(o.luas)} Ha`, icon: 'M2 12l4-6 3 4 2-3 3 5z', ...abs(o.luas, nas.luas), sub: '' },
      {
        label: 'Luas Bersertifikat',
        value: this.pct(o.ls, o.luas),
        icon: 'M3 2h10v12H3zM5 6h6M5 9h6',
        ...rel(r(o.ls, o.luas), r(nas.ls, nas.luas)),
        sub: `${this.fmt(o.ls)} Ha`
      },
      {
        label: 'Lokasi dengan Peta',
        value: this.pct(o.peta, o.lok),
        icon: 'M2 4l4-2 4 2 4-2v10l-4 2-4-2-4 2z',
        ...rel(r(o.peta, o.lok), r(nas.peta, nas.lok)),
        sub: `${this.fmt(o.peta)} lokasi`
      },
      {
        label: 'Inventarisasi Selesai',
        value: this.pct(o.inv, o.lok),
        icon: 'M3 8l3 3 7-7',
        ...rel(r(o.inv, o.lok), r(nas.inv, nas.lok)),
        sub: `${this.fmt(o.inv)} lokasi`
      }
    ];
  }

  private buildSummary(o: HplAgg, nas: HplAgg, scoped: boolean): SummaryCard[] {
    const pdok = o.sk ? o.skdok / o.sk : 0;
    const pdN = nas.sk ? nas.skdok / nas.sk : 0;
    const hil = o.nsert ? o.hilang / o.nsert : 0;
    return [
      {
        title: 'Dokumen SK Tersedia',
        value: this.pct(o.skdok, o.sk),
        bmLabel: 'Benchmark:',
        bmValue: scoped ? `${this.pct(nas.skdok, nas.sk)} (nasional)` : '100% (target)',
        tone: (scoped ? pdok >= pdN : pdok >= 1) ? 'good' : 'bad',
        note: `${this.fmt(o.sk - o.skdok)} SK belum memiliki dokumen. Ini dasar legal pertama yang perlu dilengkapi.`
      },
      {
        title: 'Sertifikat Asli Tersedia',
        value: o.nsert ? this.pct(o.nsert - o.hilang, o.nsert) : '–',
        bmLabel: 'Benchmark:',
        bmValue: '100% (target)',
        tone: hil > 0.3 ? 'bad' : 'good',
        note: `${this.fmt(o.hilang)} dari ${this.fmt(o.nsert)} sertifikat hanya tersedia sebagai pindaian atau tidak ada sama sekali.`
      },
      {
        title: 'Lokasi Prioritas Tinggi',
        value: this.fmt(o.tinggi),
        bmLabel: 'Prioritas sedang:',
        bmValue: `${this.fmt(o.sedang)} lokasi`,
        tone: 'info',
        note: 'Lokasi berprioritas tinggi menurut indeks risiko — tangani lebih dulu.'
      }
    ];
  }

  private buildChart(groups: HplGroup[]): void {
    const { w, h, ml, mr, mt, mb } = this.chart;
    const iw = w - ml - mr;
    const ih = h - mt - mb;
    if (!groups.length) {
      this.bars = [];
      this.ticks = [];
      this.linePoints = '';
      return;
    }
    const mx = Math.max(...groups.map(g => g.luas)) / 1000;
    const step = niceStep(mx / 4);
    const top = Math.ceil(mx / step) * step || 1;
    this.ticks = [0, 1, 2, 3, 4].map(i => ({ y: mt + ih - (ih * i) / 4, left: this.fmt((top * i) / 4, top < 4 ? 1 : 0), right: `${25 * i}%` }));
    const bw = iw / groups.length;
    this.bars = groups.map((g, i) => {
      const bh = (ih * (g.luas / 1000)) / top;
      const share = g.luas ? g.ls / g.luas : 0;
      return {
        x: ml + i * bw + bw * 0.18,
        y: mt + ih - bh,
        w: bw * 0.64,
        h: bh,
        cx: ml + i * bw + bw / 2,
        py: mt + ih - ih * share,
        label: g.label.length > 14 ? g.label.slice(0, 13) + '…' : g.label,
        title: `${g.full}: ${this.fmt(g.luas)} Ha, bersertifikat ${this.pct(g.ls, g.luas)}`
      };
    });
    this.linePoints = this.bars.map(b => `${b.cx},${b.py}`).join(' ');
  }
}

function niceStep(x: number): number {
  if (x <= 0) {
    return 1;
  }
  const p = Math.pow(10, Math.floor(Math.log10(x)));
  const f = x / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}
