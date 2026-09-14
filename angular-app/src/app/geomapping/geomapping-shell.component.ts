import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BASEMAPS, BasemapDef, BND_LEVELS, Classification, Compartment, GeometryType, GeomappingFeature, Poi } from './models/geomapping.model';
import { GeomappingDataService } from './services/geomapping-data.service';
import { GeomappingEditService, LineTrackState } from './services/geomapping-edit.service';
import { fmtArea, fmtLen, geomLabel, lineLengthM, polygonAreaM2 } from './services/geo-math';
import { GeomappingToast, GeomappingToastService } from './services/geomapping-toast.service';
import { GeomappingMapComponent } from './components/geomapping-map/geomapping-map.component';

interface RailItem {
  id?: string;
  icon?: string;
  label?: string;
  sep?: boolean;
}

/**
 * Ports geomapping/index.html's top-level shell: `.topbar` + `.rail`/`renderRail()` + the
 * persistent Leaflet map + `.dock`/`#dockTop`/`#panelBody` + the floating `.map-ctrls`
 * (basemap/boundary/POI toggles). Deliberately bespoke, like `DashboardShellComponent` — nothing
 * about this app's chrome (a full-screen map with a floating rail + dock, no page scroll at all)
 * resembles the shared `<dgt-app-shell>` topbar+content layout the other two tools use.
 *
 * The original switches which panel shows via one `state.view` string and a hand-rolled
 * `renderPanel()` dispatch, with the map itself untouched across view switches. This port keeps
 * that same "the map is shell-owned and persists; only the dock panel changes" structure, but
 * expresses the view switch as real child routes (`/geomapping/public`, `/geomapping/mylayers`,
 * …) rendered into a `<router-outlet>` placed inside the dock panel body — matching how
 * `DashboardShellComponent` already relates a persistent shell to its routed content, and getting
 * deep-linkable URLs per view for free.
 *
 * Also renders the three Edit Mode overlays that float directly over the map rather than inside
 * the dock panel — the draw-tool dock (`#drawDock`), the draw/track-in-progress hint bar
 * (`#drawHint`), and the Tracking Point countdown ring (`#countdownOv`). These live here (not in
 * `EditComponent`, the routed `/geomapping/edit` panel) because the source positions them
 * `position: absolute` against the same containing block as `.map-ctrls`, i.e. the app shell, not
 * the dock — and because the countdown ring in particular needs to keep covering the map even
 * during the instant of a route transition. All three subscribe to `GeomappingEditService`
 * directly, same as `GeomappingMapComponent`.
 */
@Component({
  selector: 'dgt-geomapping-shell',
  templateUrl: './geomapping-shell.component.html',
  styleUrls: ['./geomapping-shell.component.scss']
})
export class GeomappingShellComponent implements OnInit, OnDestroy {
  readonly rail: RailItem[] = [
    { id: 'public', icon: 'folder', label: 'Public Mapping' },
    { id: 'mylayers', icon: 'shapes', label: 'My Layers' },
    { id: 'approval', icon: 'approval', label: 'Approval' },
    { sep: true },
    { id: 'edit', icon: 'edit', label: 'Edit Mode - Tracking' },
    { id: 'task', icon: 'task', label: 'Task' },
    { sep: true },
    { id: 'activity', icon: 'clock', label: 'Activity' }
  ];

  readonly basemapGroups: { [group: string]: BasemapDef[] } = { Klikpeta: [], MapBox: [] };
  readonly drawTools: [GeometryType, string, string][] = [
    ['Point', 'point', 'Titik'],
    ['LineString', 'line', 'Garis'],
    ['Polygon', 'polygon', 'Poligon']
  ];

  activeView: string | null = 'public';
  dockCollapsed = false;
  userMenuOpen = false;
  bmPopOpen = false;
  resetArmed = false;

  features: GeomappingFeature[] = [];
  classifications: Classification[] = [];
  poiList: Poi[] = [];
  poiVisible = false;
  boundary: { [key: string]: boolean } = {};
  basemap = 'kp_street';
  activeCompartment: Compartment | null = null;
  taskBadge = 0;
  approvalBadge = 0;
  toasts: GeomappingToast[] = [];
  userInitial = 'S';
  userDisplayName = 'surveyor01';

  // ---- Edit Mode overlays that live above the map, outside the routed dock panel — ports
  // `#drawDock`/`#drawHint`/`#countdownOv` (index.html:909-911), see this class's doc comment.
  drawType: GeometryType | null = null;
  lineTrack: LineTrackState | null = null;
  countdown: number | null = null;

  @ViewChild(GeomappingMapComponent, { static: false }) mapComponent?: GeomappingMapComponent;

  private readonly subs: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly data: GeomappingDataService,
    readonly toastService: GeomappingToastService,
    readonly editService: GeomappingEditService
  ) {
    Object.keys(BASEMAPS).forEach(key => this.basemapGroups[BASEMAPS[key].group].push(BASEMAPS[key]));
  }

  ngOnInit(): void {
    this.userDisplayName = this.data.userName();
    this.userInitial = (this.userDisplayName[0] || 'S').toUpperCase();

    this.updateActiveView();
    this.subs.push(this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.updateActiveView()));

    this.subs.push(this.data.features$.subscribe(f => (this.features = f)));
    this.subs.push(this.data.classifications$.subscribe(c => (this.classifications = c)));
    this.poiList = this.data.poiList;
    this.subs.push(this.data.poiVisible$.subscribe(v => (this.poiVisible = v)));
    this.subs.push(this.data.boundary$.subscribe(b => (this.boundary = b)));
    this.subs.push(this.data.basemap$.subscribe(b => (this.basemap = b)));
    this.subs.push(this.data.activeCompartment$.subscribe(id => (this.activeCompartment = this.data.wcById(id))));
    this.subs.push(this.data.tasks$.subscribe(tasks => (this.taskBadge = tasks.filter(t => !t.done).length)));
    this.subs.push(this.data.features$.subscribe(() => (this.approvalBadge = this.data.apprCount('PENDING'))));
    this.subs.push(this.toastService.toasts$.subscribe(t => (this.toasts = t)));

    this.subs.push(this.editService.drawType$.subscribe(t => (this.drawType = t)));
    this.subs.push(this.editService.lineTrack$.subscribe(lt => (this.lineTrack = lt)));
    this.subs.push(this.editService.countdown$.subscribe(c => (this.countdown = c)));
  }

  get lineTrackHintLabel(): string {
    const lt = this.lineTrack;
    if (!lt) {
      return '';
    }
    return geomLabel(lt.kind) + ' · ' + lt.pts.length + ' titik · ' + (lt.kind === 'Polygon' && lt.pts.length >= 3 ? fmtArea(polygonAreaM2(lt.pts)) : fmtLen(lineLengthM(lt.pts)));
  }
  get manualDrawHintLabel(): string {
    const n = this.editService.editing ? this.editService.editing.latlngs.length : 0;
    return this.drawType ? geomLabel(this.drawType) + ' · ' + n + ' titik' : '';
  }

  toggleDraw(t: GeometryType): void {
    if (this.drawType === t) {
      this.editService.cancelDraw();
    } else {
      this.editService.beginDraw(t);
    }
  }
  finishDraw(): void {
    this.editService.finishDraw();
  }
  cancelDraw(): void {
    this.editService.cancelDraw();
  }
  finishLineTrack(): void {
    this.editService.finishLineTrack();
  }
  cancelLineTrack(): void {
    this.editService.stopLineTrack();
  }
  cancelTrackPoint(): void {
    this.editService.cancelTrackPoint();
  }

  /** Ports the source's global keydown handler (index.html:1831-1840) — Enter finishes a manual
   *  draw/line-track, Escape cancels whichever of countdown/draw/line-track/editing is active. The
   *  questionnaire dialog's own Escape handling pre-empts this via a capture-phase listener — see
   *  `QuestionnaireDialogComponent`'s doc comment. */
  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' && this.drawType && this.drawType !== 'Point') {
      ev.preventDefault();
      this.editService.finishDraw();
    } else if (ev.key === 'Enter' && this.lineTrack) {
      ev.preventDefault();
      this.editService.finishLineTrack();
    } else if (ev.key === 'Escape') {
      if (this.countdown != null) {
        this.editService.cancelTrackPoint();
      } else if (this.drawType) {
        this.editService.cancelDraw();
      } else if (this.lineTrack) {
        this.editService.stopLineTrack();
      } else if (this.editService.editing) {
        this.editService.cancelEditing();
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private updateActiveView(): void {
    let snapshot: ActivatedRouteSnapshot | null = this.route.snapshot.firstChild;
    while (snapshot && snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    this.activeView = (snapshot && snapshot.data && snapshot.data.geoView) || (snapshot && snapshot.url.length ? snapshot.url[0].path : 'public');
  }

  selectView(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
    if (this.dockCollapsed) {
      this.setDockCollapsed(false);
    }
  }

  setDockCollapsed(collapsed: boolean): void {
    this.dockCollapsed = collapsed;
    setTimeout(() => this.mapComponent && this.mapComponent.invalidateSize(), 240);
  }

  toggleUserMenu(ev: Event): void {
    ev.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  onResetClick(ev: Event): void {
    ev.stopPropagation();
    if (!this.resetArmed) {
      this.resetArmed = true;
      return;
    }
    this.data.resetAllData();
    location.reload();
  }

  toggleBmPop(ev: Event): void {
    ev.stopPropagation();
    this.bmPopOpen = !this.bmPopOpen;
  }

  chooseBasemap(key: string): void {
    const changed = this.data.basemap !== key;
    this.data.setBasemap(key);
    this.bmPopOpen = false;
    if (changed) {
      this.toastService.show('Ganti peta dasar → ' + BASEMAPS[key].name);
      this.data.logActivity('Ganti peta dasar → ' + BASEMAPS[key].name);
    }
  }

  togglePoi(): void {
    const next = !this.data.poiVisible;
    this.data.setPoiVisible(next);
    this.toastService.show(next ? 'Layer POI aktif' : 'Layer POI dimatikan');
    this.data.logActivity(next ? 'Aktifkan layer POI' : 'Nonaktifkan layer POI');
  }

  toggleBoundary(): void {
    const anyOn = Object.keys(this.data.boundary).some(k => this.data.boundary[k]);
    if (anyOn) {
      this.data.setBoundary({});
      this.toastService.show('Overlay batas wilayah dimatikan');
    } else {
      const next: { [key: string]: boolean } = {};
      BND_LEVELS.forEach(lv => (next[lv.key] = true));
      this.data.setBoundary(next);
      this.toastService.show('Overlay batas wilayah aktif (semua tingkat)');
    }
  }

  get boundaryOn(): boolean {
    return Object.keys(this.boundary).some(k => this.boundary[k]);
  }

  exitCompartment(): void {
    this.data.exitCompartment();
    this.toastService.show('Kembali ke Public Mapping', 'ok');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.userMenuOpen = false;
    this.bmPopOpen = false;
  }
}
