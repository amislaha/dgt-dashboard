import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { basemapPct, DashboardDataService, IkuItem, Kawasan, Province, STAGE_BADGE_CLASS, STAGE_COLOR_HEX } from '../../services/dashboard-data.service';
import { EwsAlert, EwsService } from '../../services/ews.service';
import { BarDatum } from '../../../shared/components/charts/chart.model';
import { DataTableColumn } from '../../../shared/components/data-table/data-table.model';
import { KawasanMapComponent } from './kawasan-map.component';

type DetailTab = 'profil' | 'tabel' | 'grafik' | 'foto';

/**
 * Landing module (`state.tab` defaults to "geospasial" in the original —
 * see CLAUDE.md "Geospasial module layout"). This ports the CURRENT
 * dashboard/index.html — not the older layout CLAUDE.md's own architecture
 * section still documents (see PORT_NOTES.md for the full history) — which
 * has no page title/description, a 17-item IKU-chip strip in place of the
 * old 7-tile executive-summary strip, a fullscreen map mode, and a
 * collapsible per-kawasan layer catalogue. The Komoditas Unggulan panel that
 * used to sit in the right column is gone in this version.
 *
 * The original's fullscreen mode reparents the filter toolbar and the
 * Detail Kawasan panel via direct DOM manipulation (`insertBefore`/
 * `appendChild`) — this port achieves the identical visual result the
 * idiomatic Angular way instead: `toolbarTpl`/`detailPanelTpl` are each
 * defined once and instantiated in one of two spots via `ngTemplateOutlet`
 * depending on `fullscreen`, rather than physically moving DOM nodes.
 */
@Component({
  selector: 'dgt-geospasial',
  templateUrl: './geospasial.component.html',
  styleUrls: ['./geospasial.component.scss']
})
export class GeospasialComponent implements OnInit, OnDestroy {
  kawasan: Kawasan[] = [];
  provinces: Province[] = [];
  ikuList: IkuItem[] = [];

  /* Both Site and Area are plain selectable dropdowns per request, but neither has a real backing
     field in the illustrative dataset (no per-kawasan "site" classification, and Area's options —
     Nasional/Pulau/Provinsi/Semua kawasan — are grouping levels, not one specific place to filter
     to), so like Periode they're decorative: selectable and remembered here, but don't filter
     `filteredKawasan` below. Area used to really filter by province — see git history if that's
     ever wanted back. */
  geoSite = 'Semua';
  geoArea = 'Nasional';
  selectedKawasanId: string | null = null;
  geoView: 'dasar' | 'grid' = 'dasar';
  geoDetailTab: DetailTab = 'profil';

  searchOpen = false;
  searchQuery = '';
  searchMiss = false;

  // "Perbesar panel peta": the map panel takes over the whole viewport; Detail Kawasan joins
  // Summary/EWS/AI in the right column (see detailPanelTpl in the template), which defaults to
  // hidden every time fullscreen is entered — panelsHidden is the one toggle that brings the
  // whole group back. Ports .geo-fullscreen/.geo-panels-hidden.
  fullscreen = false;
  panelsHidden = false;

  // Collapsible per-kawasan layer catalogue overlaid on the map (dasar view only). Ports
  // layerCatalogHtml()/wireLayerCatalog() — starts collapsed every time fullscreen is entered,
  // same as the original ("the full kawasan list floating open by default would immediately
  // overlap the map toolbar/panels in the same crowded top corner").
  layerCollapsed = false;
  layerVisible: { [id: string]: boolean } = {};
  /** "Batas HPL" — a dashed boundary-outline layer, its own catalogue row above the per-kawasan
   *  list (see kawasan-map.component.ts's showHpl input). Included in the master "select all"
   *  checkbox alongside the per-kawasan rows, same as the original. */
  hplVisible = true;

  // Expandable IKU detail box — clicking the same chip's "i" button again closes it.
  activeIku: number | null = null;

  showHPL = true;
  showSHM = true;
  selectedProv: string | null = null;

  alerts: EwsAlert[] = [];

  readonly stageBadgeClass = STAGE_BADGE_CLASS;
  readonly stageColorHex = STAGE_COLOR_HEX;

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
    this.ikuList = this.data.getIkuList();
    this.selectedKawasanId = this.kawasan.length ? this.kawasan[0].id : null;
    this.kawasan.forEach(k => (this.layerVisible[k.id] = true));

    this.ewsSub = this.ews.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  ngOnDestroy(): void {
    if (this.ewsSub) {
      this.ewsSub.unsubscribe();
    }
  }

  get selectedKawasan(): Kawasan | undefined {
    return this.kawasan.find(k => k.id === this.selectedKawasanId);
  }

  get filteredSummary(): Kawasan[] {
    return this.kawasan;
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

  get tickerItems(): EwsAlert[] {
    return this.alerts.filter(a => !a.ack);
  }

  /** "you are here" locator inset position, projected onto the static basemap mosaic — hidden
   *  (via the template's *ngIf) whenever nothing is selected or the grid view is active. */
  get locatorPos(): { xPct: number; yPct: number } | null {
    const k = this.selectedKawasan;
    return k ? basemapPct(k.lon, k.lat) : null;
  }

  get layerAllChecked(): boolean {
    return this.hplVisible && this.kawasan.every(k => this.layerVisible[k.id]);
  }

  get layerIndeterminate(): boolean {
    return !this.layerAllChecked && (this.hplVisible || this.kawasan.some(k => this.layerVisible[k.id]));
  }

  toggleIkuDetail(i: number): void {
    this.activeIku = this.activeIku === i ? null : i;
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

  /** "Perbesar panel peta" — see the `fullscreen`/`panelsHidden` doc comment above. */
  toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
      this.panelsHidden = true;
      this.layerCollapsed = true;
    } else {
      this.panelsHidden = false;
    }
    // Leaflet caches its container size and only reloads tiles for a newly-exposed area when
    // told to — .card-body growing to fill the viewport via CSS alone leaves it still painting
    // tiles only for its old ~420px box otherwise. A single setTimeout(...,210) (matching the
    // original's own post-transition delay) turned out not to be reliable here — Angular's zone
    // re-entry plus the flex reflow this toggle triggers don't have as tight a guaranteed timing
    // relationship as a plain CSS transition's 'transitionend' did in the original. Call it
    // several times instead: once after the browser has actually committed a layout+paint pass
    // (double rAF), then twice more as a safety net for any longer-tail async reflow.
    const invalidate = () => this.kawasanMap && this.kawasanMap.invalidateSize();
    requestAnimationFrame(() => requestAnimationFrame(invalidate));
    setTimeout(invalidate, 210);
    setTimeout(invalidate, 500);
  }

  togglePanels(): void {
    this.panelsHidden = !this.panelsHidden;
  }

  toggleLayerCollapse(): void {
    this.layerCollapsed = !this.layerCollapsed;
  }

  onLayerAllToggle(checked: boolean): void {
    this.onHplToggle(checked);
    this.kawasan.forEach(k => this.onLayerToggle(k.id, checked));
  }

  onLayerToggle(id: string, visible: boolean): void {
    this.layerVisible[id] = visible;
    if (this.kawasanMap) {
      this.kawasanMap.setAreaVisible(id, visible);
    }
  }

  onHplToggle(visible: boolean): void {
    this.hplVisible = visible;
    if (this.kawasanMap) {
      this.kawasanMap.setHplVisible(visible);
    }
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
