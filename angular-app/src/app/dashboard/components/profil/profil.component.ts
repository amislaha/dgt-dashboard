import { Component, OnInit } from '@angular/core';
import { DashboardDataService, Kawasan, NationalKPI, Province, STAGES, Tahap } from '../../services/dashboard-data.service';
import { DataTableColumn, SortDirection } from '../../../shared/components/data-table/data-table.model';
import { DonutSegment } from '../../../shared/components/charts/chart.model';

const STAGE_COLOR_VAR: { [key in Tahap]: string } = {
  Rintisan: 'var(--critical)',
  Tumbuh: 'var(--warn)',
  Berkembang: 'var(--series-2)',
  Mandiri: 'var(--good)'
};

/** Ports `renderProfil()` (dashboard/index.html:1279) — "Data Induk & Profil Kawasan". */
@Component({
  selector: 'dgt-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  kawasan: Kawasan[] = [];
  provinces: Province[] = [];
  nationalKPI!: NationalKPI;

  provFilter = 'Semua';
  sortKey = 'indeks5t';
  sortDir: SortDirection = 'desc';
  selectedId: string | null = null;

  readonly stages = STAGES;
  segments: DonutSegment[] = [];
  stageCounts: { [key: string]: number } = {};

  readonly columns: DataTableColumn<Kawasan>[] = [
    { key: 'nama', label: 'Kawasan', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'tahap', label: 'Tahap', sortable: true },
    { key: 'indeks5t', label: 'Indeks 5T', numeric: true, sortable: true }
  ];

  constructor(private readonly data: DashboardDataService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.provinces = this.data.getProvinces();
    this.nationalKPI = this.data.getNationalKPI();
    this.selectedId = this.kawasan.length ? this.kawasan[0].id : null;

    this.stages.forEach(s => (this.stageCounts[s] = 0));
    this.kawasan.forEach(k => this.stageCounts[k.tahap]++);
    this.segments = this.stages.map(s => ({ label: s, value: this.stageCounts[s], color: STAGE_COLOR_VAR[s] }));
  }

  get rows(): Kawasan[] {
    const filtered = this.kawasan.filter(k => this.provFilter === 'Semua' || k.provinsi === this.provFilter);
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      const av = (a as any)[this.sortKey];
      const bv = (b as any)[this.sortKey];
      if (typeof av === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return (av - bv) * dir;
    });
  }

  get selected(): Kawasan | undefined {
    return this.kawasan.find(k => k.id === this.selectedId);
  }

  onSortChange(event: { key: string; dir: SortDirection }): void {
    this.sortKey = event.key;
    this.sortDir = event.dir;
  }

  onRowClick(row: Kawasan): void {
    this.selectedId = row.id;
  }

  riskLabel(risk: 'low' | 'med' | 'high'): string {
    return risk === 'high' ? 'Tinggi' : risk === 'med' ? 'Sedang' : 'Rendah';
  }

  riskSeverity(risk: 'low' | 'med' | 'high'): 'good' | 'warn' | 'critical' {
    return risk === 'high' ? 'critical' : risk === 'med' ? 'warn' : 'good';
  }

  stageColor(stage: Tahap): string {
    return STAGE_COLOR_VAR[stage];
  }
}
