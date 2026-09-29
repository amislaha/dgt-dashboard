import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DashboardDataService,
  IndeksTrend,
  Kawasan,
  NationalKPI,
  Province,
  STAGES,
  STAGE_COLOR_HEX,
  Tahap
} from '../../services/dashboard-data.service';
import { EwsAlert, EwsSeverity, EwsService } from '../../services/ews.service';
import { KawasanMapComponent } from './kawasan-map.component';

/**
 * Full rewrite of the Geospasial landing module (`state.tab` defaults to "geospasial" in the
 * original — see CLAUDE.md "Geospasial module layout"), replacing the previous Bootstrap-card,
 * two-column layout entirely (on request, from a "DGT DSS" reference mockup showing a full-bleed
 * map with floating panels). Structural change only — the underlying data model/services are
 * untouched, so this doesn't fabricate anything the app didn't already have:
 *
 * - The reference shows 4 kawasan "types" (WPT/SKP/SP/KTM) and a 6-category EWS breakdown; the
 *   real data model only has 2 `Kawasan['tipe']` values (SKP/KPB) and only 5 total EWS alerts.
 *   Both panels here group by whatever the real data actually is instead of inventing categories.
 * - The reference's map is a 3D photorealistic satellite render; this still uses the existing
 *   2D Leaflet + OSM `KawasanMapComponent` (no paid 3D/satellite tile provider is wired into this
 *   repo) — just filling the full page instead of sitting in a bordered card.
 * - The reference's bottom toolbar has several icons with no obvious backing feature in this app
 *   (3D toggle, a settings gear, a clock, an images icon) — left out rather than shipped as dead
 *   buttons; the toolbar here only has controls that do something (reset view, zoom).
 * - Dropped entirely (not shown in the reference, and this was an explicit "change layout
 *   completely" request): the IKU-chip strip, the fullscreen/expand toggle
 *   (`toggleFullscreen()`/`panelsHidden` from the previous version — "without expand button life
 *   before"), the Kawasan Teratas & Terendah ranking card, the embedded AI chat panel, the Grid
 *   Provinsi map view, and the EWS ticker marquee. Selecting a kawasan is now done by clicking its
 *   name in the left layer list or its polygon on the map.
 *
 * **Second pass** (on request, after the first full-bleed rewrite landed): expanded `kawasan` from
 * the 10-entry mock list to the real 45-kawasan matrix (see `KAWASAN_SEEDS`'s own doc comment in
 * `dashboard-data.service.ts`); added a second legality overlay (SHM, alongside the existing HPL
 * outline) and a kawasan-type filter to the left panel, now that it has to handle 45 rows instead of
 * 10; brought a compact "Detail Kawasan" card back into the right panel (dropped in the first pass,
 * re-added since the summary panel alone wasn't enough once a kawasan gets selected); replaced the
 * right panel's trend chart from the budget Kurva S to a national Indeks 5T trend (the reference's
 * own "Tren Indeks ST" caption); simplified the EWS summary to a compact category grid + a single
 * top-priority alert instead of the full per-alert list; moved the toolbar's alert count into a bell
 * icon; and shrank the top toolbar to its content width instead of stretching edge-to-edge.
 *
 * **Third pass** (on request, from a reference screenshot of a differently-branded dashboard's
 * header): the top toolbar was rebuilt again into a full-width header bar — reversing the "shrink to
 * content width" change from the pass above — with a brand lockup (the existing
 * `assets/logo-emblem.png` Kementerian Transmigrasi emblem already used by the rail nav/other
 * shells, and a "DGT" title) on the left and the Site/Provinsi/Periode controls restyled as dark
 * pill dropdowns in the middle. The reference showed unrelated third-party branding
 * ("SIPANTERA"/"KLIKPETA") — only the *shape* of that header was carried over, not its branding; this
 * one uses the app's own name and existing logo asset instead of copying someone else's brand. The
 * reference also had its own hamburger in this same spot; deliberately left out here — it would sit
 * in the exact top-left corner `DashboardShellComponent`'s own hover-revealed rail-toggle button
 * already occupies at a higher z-index, which would intercept clicks meant for it (verified live:
 * a click there opened the rail instead of this page's own panel-toggle). The Manajemen Lapisan
 * panel's own collapse chevron already covers that function without the conflict.
 */
@Component({
  selector: 'dgt-geospasial',
  templateUrl: './geospasial.component.html',
  styleUrls: ['./geospasial.component.scss']
})
export class GeospasialComponent implements OnInit, OnDestroy {
  kawasan: Kawasan[] = [];
  alerts: EwsAlert[] = [];
  nationalKPI!: NationalKPI;
  indeksTrend!: IndeksTrend;
  provinces: Province[] = [];

  readonly stageColorHex = STAGE_COLOR_HEX;

  /* Site stays a plain selectable dropdown per the reference, but has no real backing field in the
     illustrative dataset (no per-kawasan "site" classification) — same "decorative, not filtering"
     precedent already established for Periode elsewhere in this module (see git history). */
  geoSite = 'Semua';
  selectedProvinsi: string | null = null;

  selectedKawasanId: string | null = null;

  leftPanelCollapsed = false;
  rightPanelCollapsed = false;

  layerSearchQuery = '';
  /** Narrows the per-kawasan rows shown under "Kawasan Transmigrasi" — separate from `typeVisible`
   *  below, which toggles map-layer visibility. Matters far more now that the list has 45 rows
   *  instead of 10. */
  typeFilter: 'Semua' | 'SKP' | 'KPB' = 'Semua';

  typeVisible: { [key: string]: boolean } = { SKP: true, KPB: true };
  hplVisible = true;
  shmVisible = false;
  ewsCategoryVisible: { [category: string]: boolean } = {};

  /* A plain field, recomputed only when a filter actually changes (refreshVisibleKawasan()) rather
     than a getter — the map's [kawasan] input is a @ViewChild-driven Leaflet redraw keyed off
     reference identity (ngOnChanges), and a getter re-filtering on every change-detection tick would
     hand it a brand-new array each tick even when nothing changed, replotting/re-fitting bounds in
     a loop every time the map's own (viewChange) output triggers a further CD cycle. */
  visibleKawasan: Kawasan[] = [];

  mapZoom = 5;
  mapCenter = { lat: -2.2, lng: 118 };

  @ViewChild(KawasanMapComponent, { static: false }) kawasanMap?: KawasanMapComponent;

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.nationalKPI = this.data.getNationalKPI();
    this.indeksTrend = this.data.getIndeksTrend();
    this.provinces = this.data.getProvinces();
    this.selectedKawasanId = this.kawasan.length ? this.kawasan[0].id : null;
    this.refreshVisibleKawasan();

    this.ewsSub = this.ews.alerts$.subscribe(alerts => {
      this.alerts = alerts;
      alerts.forEach(a => {
        const cat = this.ewsCategoryOf(a);
        if (!(cat in this.ewsCategoryVisible)) {
          this.ewsCategoryVisible[cat] = true;
        }
      });
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

  private refreshVisibleKawasan(): void {
    this.visibleKawasan = this.kawasan.filter(
      k => this.typeVisible[k.tipe] !== false && (!this.selectedProvinsi || k.provinsi === this.selectedProvinsi)
    );
  }

  onProvinsiChange(): void {
    this.refreshVisibleKawasan();
  }

  get typeGroups(): Array<{ tipe: 'SKP' | 'KPB'; count: number }> {
    return (['SKP', 'KPB'] as const).map(tipe => ({ tipe, count: this.kawasan.filter(k => k.tipe === tipe).length }));
  }

  get typeVisibleCount(): number {
    return (['SKP', 'KPB'] as const).filter(t => this.typeVisible[t] !== false).length;
  }

  get kawasanRows(): Kawasan[] {
    const q = this.layerSearchQuery.trim().toLowerCase();
    return this.kawasan.filter(
      k =>
        (this.typeFilter === 'Semua' || k.tipe === this.typeFilter) &&
        (!this.selectedProvinsi || k.provinsi === this.selectedProvinsi) &&
        (!q || k.nama.toLowerCase().includes(q) || k.provinsi.toLowerCase().includes(q) || k.kabupaten.toLowerCase().includes(q))
    );
  }

  get stageBreakdown(): Array<{ stage: Tahap; count: number; pct: number }> {
    const total = this.kawasan.length || 1;
    return STAGES.map(stage => {
      const count = this.kawasan.filter(k => k.tahap === stage).length;
      return { stage, count, pct: (count / total) * 100 };
    });
  }

  /** Short, fixed category names by keyword match on the alert's own title/detail — replaces an
   *  earlier version that just split the title on its em dash, which produced one wordy category
   *  per alert (e.g. "Realisasi anggaran tertinggal") instead of a clean, reusable label. With only
   *  5 real alerts this still yields one-each in practice, but a future alert sharing a keyword
   *  (e.g. another "anggaran" alert) now correctly folds into the same category instead of getting
   *  its own. */
  ewsCategoryOf(a: EwsAlert): string {
    const t = (a.title + ' ' + a.detail).toLowerCase();
    if (t.includes('produktivitas')) {
      return 'Produktivitas';
    }
    if (t.includes('lahan') || t.includes('sengketa')) {
      return 'Legalitas Lahan';
    }
    if (t.includes('anggaran')) {
      return 'Anggaran';
    }
    if (t.includes('sosial') || t.includes('kerawanan')) {
      return 'Sosial';
    }
    if (t.includes('data') || t.includes('verifikasi') || t.includes('penempatan')) {
      return 'Data Kependudukan';
    }
    return 'Lainnya';
  }

  get ewsCategories(): Array<{ category: string; count: number; sev: EwsSeverity }> {
    const map = new Map<string, { count: number; sev: EwsSeverity }>();
    this.alerts.forEach(a => {
      const cat = this.ewsCategoryOf(a);
      const existing = map.get(cat);
      if (existing) {
        existing.count++;
      } else {
        map.set(cat, { count: 1, sev: a.sev });
      }
    });
    return Array.from(map.entries()).map(([category, v]) => ({ category, ...v }));
  }

  get ewsCategoryVisibleCount(): number {
    return this.ewsCategories.filter(c => this.ewsCategoryVisible[c.category] !== false).length;
  }

  get visibleAlerts(): EwsAlert[] {
    return this.alerts.filter(a => this.ewsCategoryVisible[this.ewsCategoryOf(a)] !== false);
  }

  get activeAlertsCount(): number {
    return this.visibleAlerts.filter(a => !a.ack).length;
  }

  /** The single highest-priority alert to surface in the simplified EWS card — an unacknowledged
   *  high-severity alert if one exists, else the highest-severity alert overall. Ties broken by
   *  array order (oldest-first, matching `EwsService`'s own ordering). */
  get topAlert(): EwsAlert | undefined {
    const sevRank: { [key in EwsSeverity]: number } = { high: 2, med: 1, low: 0 };
    return this.visibleAlerts
      .slice()
      .sort((a, b) => Number(a.ack) - Number(b.ack) || sevRank[b.sev] - sevRank[a.sev])[0];
  }

  toggleType(tipe: string, visible: boolean): void {
    this.typeVisible[tipe] = visible;
    this.refreshVisibleKawasan();
  }

  toggleEwsCategory(category: string, visible: boolean): void {
    this.ewsCategoryVisible[category] = visible;
  }

  toggleHpl(visible: boolean): void {
    this.hplVisible = visible;
    if (this.kawasanMap) {
      this.kawasanMap.setHplVisible(visible);
    }
  }

  toggleShm(visible: boolean): void {
    this.shmVisible = visible;
    if (this.kawasanMap) {
      this.kawasanMap.setShmVisible(visible);
    }
  }

  toggleLeftPanel(): void {
    this.leftPanelCollapsed = !this.leftPanelCollapsed;
  }

  toggleRightPanel(): void {
    this.rightPanelCollapsed = !this.rightPanelCollapsed;
  }

  scrollToEws(): void {
    this.rightPanelCollapsed = false;
    const el = document.getElementById('geoEwsSummary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  selectKawasan(k: Kawasan): void {
    this.selectedKawasanId = k.id;
  }

  onMapView(view: { zoom: number; center: { lat: number; lng: number } }): void {
    this.mapZoom = view.zoom;
    this.mapCenter = view.center;
  }

  zoomIn(): void {
    if (this.kawasanMap) {
      this.kawasanMap.zoomIn();
    }
  }

  zoomOut(): void {
    if (this.kawasanMap) {
      this.kawasanMap.zoomOut();
    }
  }

  resetView(): void {
    if (this.kawasanMap) {
      this.kawasanMap.resetView();
    }
  }

  toggleAck(id: string): void {
    this.ews.toggleAck(id);
  }

  /** Backs the Detail Kawasan card's legalisation bar (SHM-certified share of HPL). */
  legalPct(k: Kawasan): number {
    return Math.round((k.shmHa / k.hplHa) * 100);
  }

  severityOf(sev: EwsSeverity): 'critical' | 'warn' | 'good' {
    return sev === 'high' ? 'critical' : sev === 'med' ? 'warn' : 'good';
  }

  severityLabel(sev: EwsSeverity): string {
    return sev === 'high' ? 'Tinggi' : sev === 'med' ? 'Sedang' : 'Rendah';
  }

  /** A plain CSS-var color (not a full `dgt-severity-badge`) for the small layer-list dot — the
   *  badge component always renders its label text too, which would leave an odd empty pill next
   *  to these rows if reused there. */
  sevColorVar(sev: EwsSeverity): string {
    return sev === 'high' ? 'var(--critical)' : sev === 'med' ? 'var(--warn)' : 'var(--good)';
  }
}
