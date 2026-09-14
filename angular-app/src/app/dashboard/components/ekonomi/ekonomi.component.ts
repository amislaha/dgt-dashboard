import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Komoditas } from '../../services/dashboard-data.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';

interface HilirisasiStep {
  no: string;
  label: string;
}

interface InvestasiRow {
  kawasan: string;
  sektor: string;
  nilai: string;
  status: string;
  statusClass: string;
}

/** Ports `renderEkonomi()` (dashboard/index.html:2096) — "Ekonomi & Investasi Kawasan". */
@Component({
  selector: 'dgt-ekonomi',
  templateUrl: './ekonomi.component.html',
  styleUrls: ['./ekonomi.component.scss']
})
export class EkonomiComponent implements OnInit {
  komoditasBarData: BarDatum[] = [];

  readonly hilirisasiSteps: HilirisasiStep[] = [
    { no: '1', label: 'Kebun Rakyat' },
    { no: '2', label: 'Pengumpul' },
    { no: '3', label: 'Pabrik CPO' },
    { no: '4', label: 'Refinery' },
    { no: '5', label: 'Pasar Ekspor' }
  ];

  /** Same fixed illustrative rows as the original's hard-coded investment-opportunity table. */
  readonly investasiRows: InvestasiRow[] = [
    { kawasan: 'KPB Rambutan', sektor: 'Pengolahan Karet', nilai: 'Rp 42 M', status: 'Siap Tawar', statusClass: 'badge-stage-mandiri' },
    { kawasan: 'SKP Salor', sektor: 'Pergudangan Pangan', nilai: 'Rp 18 M', status: 'Studi Kelayakan', statusClass: 'badge-stage-berkembang' },
    { kawasan: 'KPB Bathin III', sektor: 'Agroindustri Kelapa Sawit', nilai: 'Rp 65 M', status: 'Siap Tawar', statusClass: 'badge-stage-mandiri' },
    { kawasan: 'KPB Air Terang', sektor: 'Perikanan Tambak', nilai: 'Rp 9 M', status: 'Perencanaan', statusClass: 'badge-stage-tumbuh' }
  ];

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    const komoditas: Komoditas[] = this.data.getKomoditas();
    this.komoditasBarData = komoditas.map(k => ({ label: k.nama, value: k.nilai, color: 'var(--primary)' }));
  }
}
