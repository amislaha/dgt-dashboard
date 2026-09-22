import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Kawasan } from '../../services/dashboard-data.service';

interface LaporanCard {
  title: string;
}

/** Ports `renderLaporan()` (legacy-static/dashboard/index.html) — "Buat Laporan", which replaced
 *  the old "Executive Intelligence & AI" module (was `renderIntelijen()`) per request. The route
 *  id/component class are both kept as "intelijen" to keep this diff small; only the visible
 *  label/sub (see DashboardShellComponent.navItems) and this module's own content changed.
 *  Its Asisten AI panel reuses `<dgt-chat-panel mode="compact">` — the SAME shared component (and
 *  welcome text) as Geospasial's embedded mini chat — rather than the old module's `mode="full"`
 *  instance, matching the shorter welcome copy in the new wireframe. The 5 report cards are
 *  cosmetic/non-functional on this static prototype, same treatment as the Ubah/Hapus buttons
 *  elsewhere — there's no backend to actually generate or export a report from. */
@Component({
  selector: 'dgt-intelijen',
  templateUrl: './intelijen.component.html',
  styleUrls: ['./intelijen.component.scss']
})
export class IntelijenComponent implements OnInit {
  kawasan: Kawasan[] = [];

  readonly cards: LaporanCard[] = [
    { title: 'Laporan Kawasan' },
    { title: 'Laporan Investasi' },
    { title: 'Laporan Anggaran' },
    { title: 'Laporan Kinerja' },
    { title: 'Laporan 5T' }
  ];

  kawasanFilter = 'Semua';
  showHistoryNote = false;

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
  }

  get kawasanCount(): number {
    return this.kawasanFilter === 'Semua' ? this.kawasan.length : 1;
  }

  toggleHistoryNote(): void {
    this.showHistoryNote = !this.showHistoryNote;
  }
}
