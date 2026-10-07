import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DonutSegment } from '../../../shared/components/charts/chart.model';
import {
  DashboardDataService,
  Kawasan,
  NationalKPI,
  Province,
  STAGES,
  STAGE_COLOR_HEX,
  STATUS_HPL,
  StatusHpl,
  seededRandom
} from '../../services/dashboard-data.service';
import { EwsAlert, EwsSeverity, EwsService } from '../../services/ews.service';
import { KawasanMapComponent } from './kawasan-map.component';

type HplStatus = 'Semua' | StatusHpl;

/**
 * Geospasial landing module, laid out after the "DGT DASHBOARD" reference screenshot: a full-bleed
 * satellite map with a teal brand card + filter pills (top-left), an icon card (top-right), a
 * "Layer Kawasan" tree (left), a "Summary Nasional" panel of five coloured sections (right), a
 * basemap switcher + dark toolbar (bottom-centre), and a HPL popup card on the map. Clicking a
 * kawasan's name (or the popup's "Lihat profil kawasan" link) opens `KawasanDetailModalComponent`,
 * the "KAWASAN DETAIL" reference.
 *
 * The data model is unchanged and all of it is illustrative (see DashboardDataService): the
 * summary figures are derived from `nationalKPI`/`kawasan` with fixed ratios, and the popup's SK
 * HPL / Sertifikat lines are derived per kawasan from a seeded hash, so they stay stable between
 * renders but are not real land-registry values. Kawasan types are the real two (SKP/KPB); the
 * "status HPL" filter uses each kawasan's `statusHpl` (derived from its SHM-certified share of HPL).
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
  provinces: Province[] = [];

  readonly stageColorHex = STAGE_COLOR_HEX;

  /* Site stays a plain selectable dropdown per the reference, but has no real backing field in the
     illustrative dataset (no per-kawasan "site" classification), so it is decorative, not filtering. */
  geoSite = 'KTPN';
  selectedProvinsi: string | null = null;

  selectedKawasanId: string | null = null;
  /** Kawasan whose profile modal is open. */
  detailKawasan: Kawasan | null = null;

  /** "Layer Kawasan" panel body (the panel header always stays, like the right panel). */
  leftPanelOpen = true;
  rightPanelOpen = true;
  ewsPopoverOpen = false;
  /** Orange layers button → the "Legenda" card. */
  legendOpen = false;
  /** Globe button → the collapsible Basemap + Overlay panel. */
  layersOpen = true;
  /** Global overlay switches, passed to the map (see KawasanMapComponent.showAreaLayer & co). */
  overlayArea = true;
  overlayHpl = true;
  overlayShm = true;

  basemap: 'street' | 'satelit' = 'satelit';
  tilt3d = false;

  layerSearchQuery = '';
  typeFilter: 'Semua' | 'KT' | 'SKP' | 'SP' = 'Semua';
  readonly statusHplOptions = STATUS_HPL;
  hplStatusFilter: HplStatus = 'Semua';

  /** Per-kawasan checkbox/expand/overlay state, keyed by kawasan id. Everything starts checked and
   *  expanded, like the reference. */
  kawasanVisible: { [id: string]: boolean } = {};
  expandedKawasan: { [id: string]: boolean } = {};
  hplVisible: { [id: string]: boolean } = {};
  shmVisible: { [id: string]: boolean } = {};
  /** Inverse maps handed to the map component so overlays stay hidden across replots. */
  hplHidden: { [id: string]: boolean } = {};
  shmHidden: { [id: string]: boolean } = {};
  ewsCategoryVisible: { [category: string]: boolean } = {};

  /* A plain field recomputed only when a filter changes (refreshVisibleKawasan()), not a getter: the
     map's [kawasan] input redraws on reference change, and a getter would hand it a new array on
     every change-detection tick. */
  visibleKawasan: Kawasan[] = [];

  @ViewChild(KawasanMapComponent, { static: false }) kawasanMap?: KawasanMapComponent;

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.nationalKPI = this.data.getNationalKPI();
    this.provinces = this.data.getProvinces();
    this.buildSummary();
    this.selectedKawasanId = this.kawasan.length ? this.kawasan[0].id : null;
    this.kawasan.forEach(k => {
      this.kawasanVisible[k.id] = true;
      this.expandedKawasan[k.id] = true;
      this.hplVisible[k.id] = true;
      this.shmVisible[k.id] = true;
    });
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

  // ---------- filtering / layer tree ----------

  private refreshVisibleKawasan(): void {
    this.visibleKawasan = this.kawasan.filter(
      k => this.kawasanVisible[k.id] !== false && (!this.selectedProvinsi || k.provinsi === this.selectedProvinsi)
    );
  }

  onProvinsiChange(): void {
    this.refreshVisibleKawasan();
  }

  /** Share of a kawasan's HPL that already holds SHM certificates (%). */
  legalPct(k: Kawasan): number {
    return Math.round((k.shmHa / k.hplHa) * 100);
  }

  get kawasanRows(): Kawasan[] {
    const q = this.layerSearchQuery.trim().toLowerCase();
    return this.kawasan.filter(
      k =>
        (this.typeFilter === 'Semua' || this.typeFilter === 'KT' || (this.typeFilter === 'SKP' ? k.punyaSkp : k.punyaSp)) &&
        (this.hplStatusFilter === 'Semua' || k.statusHpl === this.hplStatusFilter) &&
        (!this.selectedProvinsi || k.provinsi === this.selectedProvinsi) &&
        (!q || k.nama.toLowerCase().includes(q) || k.provinsi.toLowerCase().includes(q) || k.kabupaten.toLowerCase().includes(q))
    );
  }

  toggleKawasan(id: string, visible: boolean): void {
    this.kawasanVisible[id] = visible;
    this.refreshVisibleKawasan();
  }

  toggleKawasanExpand(id: string): void {
    this.expandedKawasan[id] = !this.expandedKawasan[id];
  }

  toggleKawasanHpl(id: string, visible: boolean): void {
    this.hplVisible[id] = visible;
    this.hplHidden[id] = !visible;
    if (this.kawasanMap) {
      this.kawasanMap.setHplVisibleFor(id, visible);
    }
  }

  toggleKawasanShm(id: string, visible: boolean): void {
    this.shmVisible[id] = visible;
    this.shmHidden[id] = !visible;
    if (this.kawasanMap) {
      this.kawasanMap.setShmVisibleFor(id, visible);
    }
  }

  // ---------- selection / modal ----------

  selectKawasan(k: Kawasan): void {
    this.selectedKawasanId = k.id;
  }

  openDetail(k: Kawasan): void {
    this.selectedKawasanId = k.id;
    this.detailKawasan = k;
  }

  closeDetail(): void {
    this.detailKawasan = null;
  }

  /** Popup card on a kawasan's polygon (the "HPL TRANSMIGRASI" card of the reference). Built as an
   *  HTML string because Leaflet popups take markup, not Angular templates. SK number / date /
   *  certificate are derived from a seeded hash so each kawasan keeps stable values. */
  readonly hplPopupOf = (k: Kawasan): string => {
    const rnd = seededRandom('hpl-' + k.id + '-' + k.nama);
    const noSk = 10 + Math.floor(rnd() * 90);
    const yr = 1990 + Math.floor(rnd() * 12);
    const sertNo = 1 + Math.floor(rnd() * 9);
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][Math.floor(rnd() * 12)];
    const tgl = 1 + Math.floor(rnd() * 28);
    const row = (key: string, val: string, cls = '') => `<div class="kpop-row"><span class="kpop-k">${key}</span><span class="kpop-v ${cls}">${val}</span></div>`;
    return (
      `<div class="kpop">` +
      `<div class="kpop-head"><span class="kpop-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg></span>` +
      `<div><div class="kpop-title">${k.nama}</div><div class="kpop-sub">HPL TRANSMIGRASI</div></div></div>` +
      row('SK HPL', `${noSk}/HPL/BPN/${yr}`) +
      row('Tgl SK', '—') +
      row('Luas SK', `${k.hplHa.toLocaleString('id-ID')} ha`, 'hl') +
      row('Desa', k.nama) +
      row('Kabupaten', k.kabupaten) +
      row('Provinsi', k.provinsi) +
      row('Sertifikat', `No. ${sertNo} · ${tgl} ${bulan} ${yr}`) +
      `<button type="button" class="kpop-link" data-kpop-detail="${k.id}">Lihat profil kawasan &rarr;</button>` +
      `</div>`
    );
  };

  // ---------- panels / toolbar ----------

  toggleLeftPanel(): void {
    this.leftPanelOpen = !this.leftPanelOpen;
  }

  toggleRightPanel(): void {
    this.rightPanelOpen = !this.rightPanelOpen;
  }

  toggleLegend(): void {
    this.legendOpen = !this.legendOpen;
  }

  toggleLayers(): void {
    this.layersOpen = !this.layersOpen;
  }

  toggleEwsPopover(): void {
    this.ewsPopoverOpen = !this.ewsPopoverOpen;
  }

  setBasemap(b: 'street' | 'satelit'): void {
    this.basemap = b;
  }

  toggle3d(): void {
    this.tilt3d = !this.tilt3d;
    setTimeout(() => this.kawasanMap && this.kawasanMap.invalidateSize(), 50);
  }

  print(): void {
    window.print();
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

  focusSelected(): void {
    if (this.kawasanMap) {
      this.kawasanMap.focusSelected();
    }
  }

  // ---------- EWS (bell popover) ----------

  /** Fixed category names by keyword match on the alert's own title/detail. */
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

  get activeAlertsCount(): number {
    return this.alerts.filter(a => !a.ack && this.ewsCategoryVisible[this.ewsCategoryOf(a)] !== false).length;
  }

  toggleEwsCategory(category: string, visible: boolean): void {
    this.ewsCategoryVisible[category] = visible;
  }

  sevColorVar(sev: EwsSeverity): string {
    return sev === 'high' ? 'var(--critical)' : sev === 'med' ? 'var(--warn)' : 'var(--good)';
  }

  // ---------- Summary Nasional (all derived from nationalKPI / kawasan, illustrative) ----------

  fmt(n: number, maxFrac = 0): string {
    return n.toLocaleString('id-ID', { maximumFractionDigits: maxFrac });
  }

  tuntas!: { bidangHpl: number; hplBersertifikat: number; luasHpl: number; luasBersertifikat: number; totalKawasan: number };
  lokal!: { populasi: number; kk: number; kepadatan: number; intrans: number; anggaran: number };
  patriotSegments: DonutSegment[] = [];
  gotongRoyong: Array<{ label: string; value: number }> = [];
  karyaNusa: Array<{ label: string; value: number; icon: 'tani' | 'kebun' | 'ikan' | 'hutan' }> = [];

  /** Computed once (not as getters): `patriotSegments` is bound to a child @Input, and a getter
   *  returning a fresh array every change-detection tick would re-trigger its ngOnChanges each time. */
  private buildSummary(): void {
    const nk = this.nationalKPI;
    const d = nk.totalDesa;
    const n = this.kawasan.length || 1;
    this.tuntas = {
      bidangHpl: Math.round(nk.hplTotal / 3200),
      hplBersertifikat: Math.round(nk.shmTotal / 3100),
      luasHpl: nk.hplTotal,
      luasBersertifikat: nk.shmTotal,
      totalKawasan: nk.totalKawasan
    };
    this.lokal = {
      populasi: nk.totalPopulasi,
      kk: Math.round(nk.totalPopulasi / 4.2),
      kepadatan: nk.totalPopulasi / (nk.hplTotal / 100),
      intrans: Math.round(nk.avgIndeks),
      anggaran: Math.round(this.kawasan.reduce((s, k) => s + k.anggaranPct, 0) / n)
    };
    this.patriotSegments = STAGES.slice()
      .reverse()
      .map(stage => ({ label: stage, value: this.kawasan.filter(k => k.tahap === stage).length, color: STAGE_COLOR_HEX[stage] }));
    this.gotongRoyong = [
      { label: 'Drainase', value: Math.round(d * 31) },
      { label: 'Air bersih', value: Math.round(d * 3.1) },
      { label: 'Irigasi', value: Math.round(d * 1.4) },
      { label: 'Sarana pendidikan', value: Math.round(d * 2.6) }
    ];
    this.karyaNusa = [
      { label: 'Pertanian', value: Math.round(d * 3.6), icon: 'tani' },
      { label: 'Perkebunan', value: Math.round(d * 1.2), icon: 'kebun' },
      { label: 'Perikanan', value: Math.round(d * 4.1), icon: 'ikan' },
      { label: 'Kehutanan', value: Math.round(d * 0.9), icon: 'hutan' }
    ];
  }
}
