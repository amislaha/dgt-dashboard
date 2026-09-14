import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardDataService, Kawasan } from '../../services/dashboard-data.service';
import { EwsAlert, EwsService } from '../../services/ews.service';

interface PriorityRow {
  rank: number;
  kawasan: Kawasan;
  priority: 'high' | 'med' | 'low';
}

const PRIORITY_LABEL: { [key: string]: string } = { high: 'Segera', med: 'Terjadwal', low: 'Pantau' };
const RISK_LABEL: { [key: string]: string } = { high: 'Tinggi', med: 'Sedang', low: 'Rendah' };

/**
 * Ports `renderAnalitik()` (dashboard/index.html:2123) — "Analitik, Skoring &
 * EWS". Reuses EwsService — the SAME shared alert list/ack-toggle logic as
 * the Geospasial module's EWS panel, per CLAUDE.md's explicit note that this
 * duplication (two panels, one data source) is deliberate, not an oversight.
 */
@Component({
  selector: 'dgt-analitik',
  templateUrl: './analitik.component.html',
  styleUrls: ['./analitik.component.scss']
})
export class AnalitikComponent implements OnInit, OnDestroy {
  priorityRows: PriorityRow[] = [];
  alerts: EwsAlert[] = [];

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    const ranked = this.data.getKawasan().slice().sort((a, b) => a.indeks5t - b.indeks5t);
    this.priorityRows = ranked.map((k, i) => ({
      rank: i + 1,
      kawasan: k,
      priority: i < 2 ? 'high' : i < 5 ? 'med' : 'low'
    }));

    this.ewsSub = this.ews.alerts$.subscribe(alerts => (this.alerts = alerts));
  }

  ngOnDestroy(): void {
    if (this.ewsSub) {
      this.ewsSub.unsubscribe();
    }
  }

  get activeCount(): number {
    return this.ews.getActiveCount();
  }

  toggleAck(id: string): void {
    this.ews.toggleAck(id);
  }

  riskLabel(risk: string): string {
    return RISK_LABEL[risk] || risk;
  }

  priorityLabel(priority: string): string {
    return PRIORITY_LABEL[priority] || priority;
  }

  severityOf(sev: 'high' | 'med' | 'low'): 'good' | 'warn' | 'critical' {
    return sev === 'high' ? 'critical' : sev === 'med' ? 'warn' : 'good';
  }
}
