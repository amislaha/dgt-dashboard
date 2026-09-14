import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardDataService, Kawasan, Komoditas, Province, STAGE_BADGE_CLASS } from '../../services/dashboard-data.service';
import { EwsAlert, EwsService } from '../../services/ews.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';
import { DataTableColumn } from '../../../shared/components/data-table/data-table.model';
import { KawasanMapComponent } from './kawasan-map.component';

type DetailTab = 'profil' | 'tabel' | 'grafik' | 'foto';

interface KpiTileView {
  label: string;
  value: string;
  delta: string;
  dir: 'up' | 'down';
  alert?: boolean;
}

/**
 * Landing module (`state.tab` defaults to "geospasial" in the original —
 * see CLAUDE.md "Geospasial module layout"). Ports: the DSS toolbar (area
 * select + alert chip), the horizontal-scroll-snap executive-summary strip
 * (the 7 STG tiles — Kawasan Mandiri/Populasi/Indeks 5T/Realisasi Anggaran/
 * Capaian Infrastruktur/Komoditas Unggulan/Peringatan Aktif), the two-column
 * layout (map + tabbed Detail Kawasan on the left; Summary/EWS/Komoditas/AI
 * chat on the right), and the ticker marquee.
 *
 * Simplification vs. the CURRENT dashboard/index.html (see PORT_NOTES.md):
 * the live file has since evolved past what CLAUDE.md documents — an IKU-chip
 * strip, a fullscreen map mode with DOM-reparenting panel choreography, and a
 * collapsible per-kawasan layer catalogue. This port follows CLAUDE.md's
 * documented architecture (the STG-tile strip) rather than that newer,
 * undocumented layout, and does not implement fullscreen/layer-catalogue.
 */
@Component({
  selector: 'dgt-geospasial',
  templateUrl: './geospasial.component.html',
  styleUrls: ['./geospasial.component.scss']
})
export class GeospasialComponent implements OnInit, OnDestroy {
  kawasan: Kawasan[] = [];
  provinces: Province[] = [];
  komoditas: Komoditas[] = [];

  geoArea = 'Semua';
  selectedKawasanId: string | null = null;
  geoView: 'dasar' | 'grid' = 'dasar';
  geoDetailTab: DetailTab = 'profil';

  searchOpen = false;
  searchQuery = '';
  searchMiss = false;
  expanded = false;

  showHPL = true;
  showSHM = true;
  selectedProv: string | null = null;

  kpiTiles: KpiTileView[] = [];
  alerts: EwsAlert[] = [];

  readonly stageBadgeClass = STAGE_BADGE_CLASS;

  readonly tabelColumns: DataTableColumn<Kawasan>[] = [
    { key: 'nama', label: 'Kawasan', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'tahap', label: 'Tahap', sortable: true },
    { key: 'indeks5t', label: 'Indeks 5T', numeric: true, sortable: true }
  ];

  @ViewChild(KawasanMapComponent, { static: false }) kawasanMap?: KawasanMapComponent;

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.provinces = this.data.getProvinces();
    this.komoditas = this.data.getKomoditas();
    this.selectedKawasanId = this.kawasan.length ? this.kawasan[0].id : null;

    this.ewsSub = this.ews.alerts$.subscribe(alerts => {
      this.alerts = alerts;
      this.buildKpiTiles();
    });
  }

  ngOnDestroy(): void {
    if (this.ewsSub) {
      this.ewsSub.unsubscribe();
    }
  }

  private buildKpiTiles(): void {
    const kpi = this.data.getNationalKPI();
    const mandiriCount = this.kawasan.filter(k => k.tahap === 'Mandiri').length;
    const avgAnggaran = Math.round(this.kawasan.reduce((s, k) => s + k.anggaranPct, 0) / (this.kawasan.length || 1));
    const infra = this.data.getInfraKategori();
    const avgInfra = Math.round(infra.reduce((s, i) => s + i.capaian, 0) / (infra.length || 1));
    const topKomoditas = this.komoditas.slice().sort((a, b) => b.nilai - a.nilai)[0];
    const active = this.ews.getActiveCount();

    this.kpiTiles = [
      { label: 'Kawasan Mandiri', value: String(mandiriCount), delta: `dari ${this.kawasan.length} kawasan`, dir: 'up' },
      { label: 'Populasi', value: kpi.totalPopulasi.toLocaleString('id-ID'), delta: '3.2% dari kuartal lalu', dir: 'up' },
      { label: 'Indeks 5T', value: String(kpi.avgIndeks), delta: '4 poin', dir: 'up' },
      { label: 'Realisasi Anggaran', value: `${avgAnggaran}%`, delta: '5% bulan ini', dir: 'up' },
      { label: 'Capaian Infrastruktur', value: `${avgInfra}%`, delta: `rata-rata ${infra.length} kategori`, dir: 'up' },
      { label: 'Komoditas Unggulan', value: topKomoditas ? topKomoditas.nama : '—', delta: topKomoditas ? `Indeks ${topKomoditas.nilai}` : '', dir: 'up' },
      { label: 'Peringatan Aktif', value: String(active), delta: 'perlu tindak lanjut', dir: active > 0 ? 'down' : 'up', alert: active > 0 }
    ];
  }

  get selectedKawasan(): Kawasan | undefined {
    return this.kawasan.find(k => k.id === this.selectedKawasanId);
  }

  get filteredSummary(): Kawasan[] {
    return this.kawasan.filter(k => this.geoArea === 'Semua' || k.provinsi === this.geoArea);
  }

  get summaryIsShort(): boolean {
    return this.filteredSummary.length <= 6;
  }

  get summaryAll(): Kawasan[] {
    return this.filteredSummary.slice().sort((a, b) => b.indeks5t - a.indeks5t);
  }

  get summaryTop(): Kawasan[] {
    return this.summaryAll.slice(0, 3);
  }

  get summaryBottom(): Kawasan[] {
    return this.summaryAll.slice(-3).reverse();
  }

  get tabelRows(): Kawasan[] {
    return this.kawasan.slice().sort((a, b) => b.indeks5t - a.indeks5t);
  }

  get grafikData(): BarDatum[] {
    return this.tabelRows.map(r => ({
      label: r.nama.replace(/^(SKP|KPB)\s+/, ''),
      value: r.indeks5t,
      color: r.id === this.selectedKawasanId ? 'var(--primary)' : 'var(--border)'
    }));
  }

  get komoditasBarData(): BarDatum[] {
    return this.komoditas.map(k => ({ label: k.nama, value: k.nilai, color: 'var(--primary)' }));
  }

  get tickerItems(): EwsAlert[] {
    return this.alerts.filter(a => !a.ack);
  }

  onAreaChange(value: string): void {
    this.geoArea = value;
  }

  selectKawasan(k: Kawasan): void {
    this.selectedKawasanId = k.id;
    this.selectedProv = k.provinsi;
  }

  onTabelRowClick(row: Kawasan): void {
    this.selectKawasan(row);
  }

  setDetailTab(tab: DetailTab): void {
    this.geoDetailTab = tab;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }

  doSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      return;
    }
    const found = this.kawasan.find(k => k.nama.toLowerCase().indexOf(q) > -1 || k.provinsi.toLowerCase().indexOf(q) > -1);
    if (!found) {
      this.searchMiss = true;
      this.searchQuery = '';
      return;
    }
    this.searchMiss = false;
    if (this.geoView === 'grid') {
      this.selectedProv = found.provinsi;
    }
    this.selectKawasan(found);
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
    // matches the original's setTimeout(...,210) after the panel's own CSS transition finishes
    setTimeout(() => {
      if (this.kawasanMap) {
        this.kawasanMap.invalidateSize();
      }
    }, 210);
  }

  setView(view: 'dasar' | 'grid'): void {
    this.geoView = view;
  }

  toggleAck(id: string): void {
    this.ews.toggleAck(id);
  }

  scrollToEws(): void {
    const el = document.getElementById('geoEwsPanel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  provHplPct(p: Province): number {
    return Math.min(100, (p.hpl / 15000) * 100);
  }

  provShmPct(p: Province): number {
    return Math.min(100, (p.shm / 15000) * 100);
  }

  selectProv(p: Province): void {
    this.selectedProv = this.selectedProv === p.nama ? null : p.nama;
    this.selectedKawasanId = null;
  }

  legalPct(k: Kawasan): number {
    return Math.round((k.shmHa / k.hplHa) * 100);
  }

  severityOf(sev: 'high' | 'med' | 'low'): 'critical' | 'warn' | 'good' {
    return sev === 'high' ? 'critical' : sev === 'med' ? 'warn' : 'good';
  }

  severityLabel(sev: 'high' | 'med' | 'low'): string {
    return sev === 'high' ? 'Tinggi' : sev === 'med' ? 'Sedang' : 'Rendah';
  }
}
