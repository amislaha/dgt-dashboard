import { Component, OnInit } from '@angular/core';
import { DashboardDataService, InfraKategori, KlCollab } from '../../services/dashboard-data.service';

/** Ports `renderInfrastruktur()` (dashboard/index.html:2045) — "Infrastruktur & Kolaborasi K/L". */
@Component({
  selector: 'dgt-infrastruktur',
  templateUrl: './infrastruktur.component.html',
  styleUrls: ['./infrastruktur.component.scss']
})
export class InfrastrukturComponent implements OnInit {
  infraKategori: InfraKategori[] = [];
  klCollab: KlCollab[] = [];

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.infraKategori = this.data.getInfraKategori();
    this.klCollab = this.data.getKlCollab();
  }

  statusBadgeClass(status: string): string {
    return status === 'Selesai' ? 'badge-stage-mandiri' : status === 'Berjalan' ? 'badge-stage-berkembang' : 'badge-stage-tumbuh';
  }
}
