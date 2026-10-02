import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardDataService, Kawasan } from '../../services/dashboard-data.service';
import { EwsAlert, EwsSeverity, EwsService } from '../../services/ews.service';

type Priority = 'high' | 'med' | 'low';
type PriorityFilter = 'all' | Priority;

interface PriorityRow {
  rank: number;
  kawasan: Kawasan;
  priority: Priority;
}

const PRIORITY_LABEL: { [key in Priority]: string } = { high: 'Segera', med: 'Terjadwal', low: 'Pantau' };
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

/**
 * "Analitik, Skoring & EWS", laid out after the reference screenshot: a page title with a live
 * "Per <tanggal>, <jam> WIB · N peringatan aktif · N kawasan prioritas segera" line, the active
 * EWS alerts as a simple list (dot, title, detail, age, "Selesai"), and the intervention-priority
 * scoring table with a search box and a priority filter.
 *
 * Reuses EwsService — the SAME shared alert list/ack state as the Geospasial EWS bell, per
 * CLAUDE.md's note that this duplication (two views, one data source) is deliberate. "Selesai"
 * acknowledges an alert (so the Geospasial bell count drops too); resolved alerts can be shown
 * again and re-opened from the "Tampilkan selesai" toggle.
 */
@Component({
  selector: 'dgt-analitik',
  templateUrl: './analitik.component.html',
  styleUrls: ['./analitik.component.scss']
})
export class AnalitikComponent implements OnInit, OnDestroy {
  priorityRows: PriorityRow[] = [];
  alerts: EwsAlert[] = [];

  search = '';
  priorityFilter: PriorityFilter = 'all';
  showResolved = false;

  readonly now = new Date();

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    const ranked = this.data.getKawasan().slice().sort((a, b) => a.indeks5t - b.indeks5t);
    this.priorityRows = ranked.map((k, i) => ({
      rank: i + 1,
      kawasan: k,
      priority: (i < 2 ? 'high' : i < 5 ? 'med' : 'low') as Priority
    }));

    this.ewsSub = this.ews.alerts$.subscribe(alerts => (this.alerts = alerts));
  }

  ngOnDestroy(): void {
    if (this.ewsSub) {
      this.ewsSub.unsubscribe();
    }
  }

  // ---------- header line ----------

  get asOf(): string {
    const d = this.now;
    const hh = ('0' + d.getHours()).slice(-2);
    const mm = ('0' + d.getMinutes()).slice(-2);
    return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${hh}.${mm} WIB`;
  }

  get urgentCount(): number {
    return this.priorityRows.filter(r => r.priority === 'high').length;
  }

  // ---------- EWS ----------

  get activeAlerts(): EwsAlert[] {
    return this.alerts.filter(a => !a.ack);
  }

  get resolvedAlerts(): EwsAlert[] {
    return this.alerts.filter(a => a.ack);
  }

  get shownAlerts(): EwsAlert[] {
    return this.showResolved ? this.alerts : this.activeAlerts;
  }

  toggleAck(id: string): void {
    this.ews.toggleAck(id);
  }

  sevClass(sev: EwsSeverity): string {
    return 'sev-' + sev;
  }

  // ---------- scoring ----------

  get filteredRows(): PriorityRow[] {
    const q = this.search.trim().toLowerCase();
    return this.priorityRows.filter(
      r =>
        (this.priorityFilter === 'all' || r.priority === this.priorityFilter) &&
        (!q || r.kawasan.nama.toLowerCase().includes(q) || r.kawasan.provinsi.toLowerCase().includes(q))
    );
  }

  priorityLabel(p: Priority): string {
    return PRIORITY_LABEL[p];
  }

  /** Colour band of the Indeks 5T number: low scores read red, high scores green. */
  indeksClass(v: number): string {
    return v < 45 ? 'low' : v < 70 ? 'mid' : 'high';
  }
}
