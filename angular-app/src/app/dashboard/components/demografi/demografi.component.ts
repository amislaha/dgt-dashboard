import { Component, OnInit } from '@angular/core';
import { AsalDaerah, DashboardDataService, Kawasan } from '../../services/dashboard-data.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';

/** Ports `renderDemografi()` (dashboard/index.html:2021) — "Transmigran, Masyarakat Lokal & Kependudukan". */
@Component({
  selector: 'dgt-demografi',
  templateUrl: './demografi.component.html',
  styleUrls: ['./demografi.component.scss']
})
export class DemografiComponent implements OnInit {
  asalDaerah: AsalDaerah[] = [];
  kawasan: Kawasan[] = [];

  asalBarData: BarDatum[] = [];
  popBarData: BarDatum[] = [];

  /** Same fixed illustrative value as the original's `gauge(67, 100, ...)` call. */
  readonly pembauranValue = 67;

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.asalDaerah = this.data.getAsalDaerah();
    this.kawasan = this.data.getKawasan();

    this.asalBarData = this.asalDaerah.map(a => ({ label: a.asal, value: a.jml, color: 'var(--series-2)' }));
    this.popBarData = this.kawasan.map(k => ({
      label: k.nama.replace(/^SKP |^KPB /, ''),
      value: k.populasi,
      color: 'var(--primary)'
    }));
  }
}
