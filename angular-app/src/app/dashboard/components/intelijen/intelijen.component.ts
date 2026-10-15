import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../shared/services/toast.service';
import { DashboardDataService, Kawasan } from '../../services/dashboard-data.service';
import {
  LAPORAN_JUDUL, LaporanExportService, LaporanFormat, LaporanHistoryItem, LaporanJenis
} from '../../services/laporan-export.service';

interface LaporanCard {
  jenis: LaporanJenis;
  title: string;
}

/** Ports `renderLaporan()` (legacy-static/dashboard/index.html) — "Buat Laporan", which replaced
 *  the old "Executive Intelligence & AI" module (was `renderIntelijen()`) per request. The route
 *  id/component class are both kept as "intelijen" to keep this diff small; only the visible
 *  label/sub (see DashboardShellComponent.navItems) and this module's own content changed.
 *  Its Asisten AI panel reuses `<dgt-chat-panel mode="compact">` — the SAME shared component (and
 *  welcome text) as Geospasial's embedded mini chat — rather than the old module's `mode="full"`
 *  instance, matching the shorter welcome copy in the new wireframe. Each of the 5 report cards
 *  exports a report (PDF via the browser's print dialog, or CSV) built by LaporanExportService
 *  from the dashboard dataset with fixed text templates — no LLM, no backend. */
@Component({
  selector: 'dgt-intelijen',
  templateUrl: './intelijen.component.html',
  styleUrls: ['./intelijen.component.scss']
})
export class IntelijenComponent implements OnInit {
  kawasan: Kawasan[] = [];

  readonly cards: LaporanCard[] = (['kawasan', 'investasi', 'anggaran', 'kinerja', '5t'] as LaporanJenis[])
    .map(jenis => ({ jenis, title: LAPORAN_JUDUL[jenis] }));

  readonly periode = '2026 · TW1';
  kawasanFilter = 'Semua';
  showHistory = false;
  history: LaporanHistoryItem[] = [];

  constructor(
    private readonly data: DashboardDataService,
    private readonly laporan: LaporanExportService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
  }

  get kawasanCount(): number {
    return this.kawasanFilter === 'Semua' ? this.kawasan.length : 1;
  }

  exportLaporan(card: LaporanCard, format: LaporanFormat): void {
    const doc = this.laporan.export(card.jenis, this.kawasanFilter, this.periode, format);
    this.history = this.laporan.getHistory();
    this.toast.show(`${doc.judul} (${format.toUpperCase()}) — ${doc.cakupan} diekspor.`);
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    this.history = this.laporan.getHistory();
  }

  clearHistory(): void {
    this.laporan.clearHistory();
    this.history = [];
  }
}
