import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../shared/services/toast.service';
import { DashboardDataService, Kawasan } from '../../services/dashboard-data.service';
import {
  LAPORAN_JUDUL, LaporanExportService, LaporanFormat, LaporanHistoryItem, LaporanJenis
} from '../../services/laporan-export.service';

interface LaporanCard {
  jenis: LaporanJenis;
  title: string;
  /** Themed placeholder illustration, assets/laporan/<jenis>.svg. */
  img: string;
  /** 24x24 line icon (full <svg> markup) shown top-right of the card. */
  icon: string;
}

const CARD_ICON_PATHS: { [key in LaporanJenis]: string } = {
  kawasan: '<path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  investasi: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  anggaran: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14.5" r="1.5"/>',
  kinerja: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const cardIcon = (jenis: LaporanJenis): string =>
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  CARD_ICON_PATHS[jenis] + '</svg>';

/** Ports `renderLaporan()` (legacy-static/dashboard/index.html) — "Buat Laporan", which replaced
 *  the old "Executive Intelligence & AI" module (was `renderIntelijen()`) per request. The route
 *  id/component class are both kept as "intelijen" to keep this diff small; only the visible
 *  label/sub (see DashboardShellComponent.navItems) and this module's own content changed.
 *  Its Asisten AI panel reuses `<dgt-chat-panel mode="compact">` — the SAME shared component (and
 *  welcome text) as Geospasial's embedded mini chat — rather than the old module's `mode="full"`
 *  instance, matching the shorter welcome copy in the new wireframe. Each of the 4 report cards
 *  exports a report (PDF via the browser's print dialog, or CSV) built by LaporanExportService
 *  from the dashboard dataset with fixed text templates — no LLM, no backend. */
@Component({
  selector: 'dgt-intelijen',
  templateUrl: './intelijen.component.html',
  styleUrls: ['./intelijen.component.scss']
})
export class IntelijenComponent implements OnInit {
  kawasan: Kawasan[] = [];

  readonly cards: LaporanCard[] = (['kawasan', 'investasi', 'anggaran', 'kinerja'] as LaporanJenis[])
    .map(jenis => ({ jenis, title: LAPORAN_JUDUL[jenis], img: `assets/laporan/${jenis}.svg`, icon: cardIcon(jenis) }));

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
