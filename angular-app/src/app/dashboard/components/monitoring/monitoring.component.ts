import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Kawasan, Province, SCurve } from '../../services/dashboard-data.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';

/** Total national budget envelope (Rp) — not tracked as its own field anywhere in the data layer,
 *  only each kawasan's `anggaranPct` is. This is one fixed illustrative figure (matching the
 *  wireframe's "310.000.000.000" magnitude); `realisasiRp`/`persentase` below are both derived from
 *  it and from the same per-kawasan `anggaranPct` the bar chart plots, rather than being separately
 *  hand-picked numbers — the wireframe's own KPI tiles didn't do this (its Realisasi figure was off
 *  by three orders of magnitude from Total/Persentase), which reads as leftover placeholder text. */
const ANGGARAN_TOTAL_RP = 310000000000;

/** Ports `renderMonitoring()` (legacy-static/dashboard/index.html) — "Monitoring Program & Anggaran". */
@Component({
  selector: 'dgt-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  sCurve!: SCurve;
  provinces: Province[] = [];
  kawasan: Kawasan[] = [];
  areaFilter = 'Semua';

  readonly anggaranTotalRp = ANGGARAN_TOTAL_RP;
  avgPct = 0;
  realisasiRp = 0;

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.sCurve = this.data.getSCurve();
    this.provinces = this.data.getProvinces();
    this.kawasan = this.data.getKawasan();

    this.avgPct = Math.round(this.kawasan.reduce((s, k) => s + k.anggaranPct, 0) / this.kawasan.length);
    this.realisasiRp = Math.round((ANGGARAN_TOTAL_RP * this.avgPct) / 100);
  }

  get anggaranBarData(): BarDatum[] {
    const pool = this.kawasan.filter(k => this.areaFilter === 'Semua' || k.provinsi === this.areaFilter);
    return pool.map(k => ({
      label: k.nama.replace(/^SKP |^KPB /, ''),
      value: k.anggaranPct,
      color: k.anggaranPct < 40 ? 'var(--critical)' : k.anggaranPct < 60 ? 'var(--warn)' : 'var(--good)'
    }));
  }
}
