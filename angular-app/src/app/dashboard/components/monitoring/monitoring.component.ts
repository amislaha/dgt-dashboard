import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Kawasan, SCurve } from '../../services/dashboard-data.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';

/** Ports `renderMonitoring()` (dashboard/index.html:2070) — "Monitoring Program & Anggaran". */
@Component({
  selector: 'dgt-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {
  sCurve!: SCurve;
  anggaranBarData: BarDatum[] = [];

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.sCurve = this.data.getSCurve();

    const kawasan: Kawasan[] = this.data.getKawasan();
    this.anggaranBarData = kawasan.map(k => ({
      label: k.nama.replace(/^SKP |^KPB /, ''),
      value: k.anggaranPct,
      color: k.anggaranPct < 35 ? 'var(--critical)' : k.anggaranPct < 60 ? 'var(--warn)' : 'var(--good)'
    }));
  }
}
