import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GeometryType, GeomappingFeature, GeomappingFeatureDraft, FeaturePrivilege } from '../models/geomapping.model';
import { DEFAULT_MAP_CENTER, LatLng, fmtArea, fmtLen, geomToLatLngs, latLngsToGeom, lineLengthM, polygonAreaM2 } from './geo-math';
import { GeomappingDataService } from './geomapping-data.service';
import { GeomappingToastService } from './geomapping-toast.service';

export type ShapeMode = 'vertex' | 'move' | 'addvertex' | 'delete';
export type TrackKind = 'point' | 'line' | 'polygon' | null;

/** Ports `state.editing` (geomapping/index.html's module-level `state` object) — `feature` is
 *  `null` while a manual draw is still in progress (between `beginDraw()` and `finishDraw()`),
 *  set once the shape is committed and the editor form opens (`openEditor()`). */
export interface EditingState {
  isNew: boolean;
  id: string | null;
  type: GeometryType;
  latlngs: LatLng[];
  feature: GeomappingFeatureDraft | null;
  trackKind: TrackKind;
  /** Bumped only by `openEditor()` — lets a consumer (`EditComponent`) tell "a new editing session
   *  started, (re)load the form from `feature`" apart from "the same session's draft changed"
   *  (a vertex-drag commit, a classification pick), which must NOT reset in-progress form fields
   *  the source keeps DOM-only until Save (title/description/address/privilege). */
  sessionId: number;
}

export interface LineTrackState {
  kind: 'LineString' | 'Polygon';
  pts: LatLng[];
}

const CD_SECONDS = 10;

/**
 * Edit Mode orchestration — ports geomapping/index.html's manual-drawing (`beginDraw`/
 * `addDrawPoint`/`finishDraw`/`mountEditShape`/`renderHandles`), GPS-tracking (`requestMyLoc`/
 * `startTrackPoint`/`startLineTrack`/…) and shape-editing (`renderHandles`'s vertex/move/
 * add-vertex/delete-vertex modes, `commitEditGeom`) state and logic (lines ~1493-1845). The
 * original keeps all of this as plain module vars mutated in place, with the map's Leaflet layers
 * (`drawTemp`/`handleLayer`/`editLayer`/`myLocMarker`) rebuilt by hand after each mutation. Here
 * the *data* (which points, which mode, which feature draft) lives in this service as reactive
 * state; `GeomappingMapComponent` subscribes and owns the actual Leaflet layers, and
 * `EditComponent` (the routed `/geomapping/edit` panel) subscribes for the dock-panel UI — see
 * each component's own doc comment for the split.
 *
 * One deliberate departure from the source: a vertex/shape *drag* does not update the authoritative
 * `editing$` state on every mouse-move tick (the source's `renderHandles()` does, including a full
 * marker-rebuild in "move" mode on every tick — fine for a hand-rolled renderer working directly
 * against the DOM, but re-subscribing/rebuilding Leaflet layers that often from Angular would
 * recreate the very marker the user is dragging, out from under the mouse). Instead, live drag
 * ticks go through `liveLatLngs$` (cheap, no layer rebuild — `GeomappingMapComponent` updates the
 * dragged layer's coordinates directly), and the authoritative state (and the "up to date"
 * `editing$` used for the length/area readout in the editor form) only advances on drag-end via
 * `commitVertices()`. Net effect for a user is the same as the original: live numbers while
 * dragging, a shape that's committed once released.
 */
@Injectable({ providedIn: 'root' })
export class GeomappingEditService {
  private readonly drawTypeSubject = new BehaviorSubject<GeometryType | null>(null);
  readonly drawType$ = this.drawTypeSubject.asObservable();

  private readonly editingSubject = new BehaviorSubject<EditingState | null>(null);
  readonly editing$ = this.editingSubject.asObservable();

  /** Cheap per-tick coordinates during an active vertex/shape drag — see class doc comment. Not
   *  used to drive map-layer rebuilds, only the editor form's live length/area readout. */
  private readonly liveLatLngsSubject = new BehaviorSubject<LatLng[] | null>(null);
  readonly liveLatLngs$ = this.liveLatLngsSubject.asObservable();

  private readonly lineTrackSubject = new BehaviorSubject<LineTrackState | null>(null);
  readonly lineTrack$ = this.lineTrackSubject.asObservable();

  private readonly countdownSubject = new BehaviorSubject<number | null>(null);
  readonly countdown$ = this.countdownSubject.asObservable();

  private readonly myLocSubject = new BehaviorSubject<LatLng | null>(null);
  readonly myLoc$ = this.myLocSubject.asObservable();
  private readonly myLocAccSubject = new BehaviorSubject<number | null>(null);
  readonly myLocAcc$ = this.myLocAccSubject.asObservable();

  private readonly shapeModeSubject = new BehaviorSubject<ShapeMode>('vertex');
  readonly shapeMode$ = this.shapeModeSubject.asObservable();

  private cdTimer: any = null;
  private sessionCounter = 0;

  constructor(private readonly data: GeomappingDataService, private readonly toast: GeomappingToastService) {}

  // ---------------- sync snapshots (mirrors state.* reads in the source) ----------------
  get drawType(): GeometryType | null {
    return this.drawTypeSubject.value;
  }
  get editing(): EditingState | null {
    return this.editingSubject.value;
  }
  get lineTrack(): LineTrackState | null {
    return this.lineTrackSubject.value;
  }
  get countdown(): number | null {
    return this.countdownSubject.value;
  }
  get myLoc(): LatLng | null {
    return this.myLocSubject.value;
  }
  get myLocAcc(): number | null {
    return this.myLocAccSubject.value;
  }
  get shapeMode(): ShapeMode {
    return this.shapeModeSubject.value;
  }
  readonly CD_SECONDS = CD_SECONDS;

  // ---------------- manual drawing (F-5.x) ----------------
  beginDraw(type: GeometryType): void {
    this.cancelEditing(true);
    this.stopLineTrack(true);
    this.drawTypeSubject.next(type);
    this.editingSubject.next({ isNew: true, id: null, type, latlngs: [], feature: null, trackKind: null, sessionId: ++this.sessionCounter });
    this.toast.show(type === 'Point' ? 'Klik di peta untuk menempatkan titik' : 'Klik untuk menambah titik · klik dua kali / Enter untuk selesai');
  }

  addDrawPoint(ll: LatLng): void {
    const e = this.editingSubject.value;
    if (!e) {
      return;
    }
    if (this.drawType === 'Point') {
      this.editingSubject.next({ ...e, latlngs: [ll] });
      this.finishDraw();
      return;
    }
    this.editingSubject.next({ ...e, latlngs: [...e.latlngs, ll] });
  }

  finishDraw(): void {
    const e = this.editingSubject.value;
    const type = this.drawType;
    if (!e || !type) {
      return;
    }
    const need = type === 'Point' ? 1 : type === 'LineString' ? 2 : 3;
    if (e.latlngs.length < need) {
      this.toast.show('Butuh minimal ' + need + ' titik', 'err');
      return;
    }
    this.drawTypeSubject.next(null);
    this.openEditor(
      {
        classificationId: this.data.collectionId,
        compartmentId: this.data.activeCompartmentId,
        title: '',
        description: '',
        address: '',
        images: [],
        privilege: 'PUBLIC',
        questionnaire: {},
        geometry: latLngsToGeom(type, e.latlngs)
      },
      true
    );
  }

  cancelDraw(): void {
    this.drawTypeSubject.next(null);
    this.editingSubject.next(null);
  }

  /** Ports `map.on("click", ...)` (index.html:1826-1829): routes a map click to whichever of
   *  manual-draw/line-track is active, a no-op otherwise. */
  mapClick(ll: LatLng): void {
    if (this.drawType) {
      this.addDrawPoint(ll);
      return;
    }
    if (this.lineTrack) {
      this.lineTrackAddAt(ll);
    }
  }

  /** Ports `map.on("dblclick", ...)` (index.html:1830). */
  mapDblClick(): void {
    if (this.drawType && this.drawType !== 'Point') {
      this.finishDraw();
    }
  }

  // ---------------- My Location (F-5.5/F-5.6) ----------------
  /** Ports `requestMyLoc()`. The source falls back to the live map centre when geolocation is
   *  denied/unavailable (a prototype convenience for desktop testing); this service has no
   *  Leaflet dependency by design (see class doc comment — the map is a consumer, not a
   *  collaborator), so it falls back to the map's own fixed initial centre (`DEFAULT_MAP_CENTER`)
   *  instead of the *current* view. Same intent (give the flow something to work with when there's
   *  no real GPS), a fixed rather than live point. */
  requestMyLoc(cb?: (ll: LatLng) => void): void {
    this.toast.show('Mengambil posisi GPS …');
    if (!navigator.geolocation) {
      this.myLocFallback(cb);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const ll: LatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.setMyLoc(ll, pos.coords.accuracy);
        if (cb) {
          cb(ll);
        }
      },
      () => this.myLocFallback(cb),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  }

  private myLocFallback(cb?: (ll: LatLng) => void): void {
    this.setMyLoc(DEFAULT_MAP_CENTER, null);
    this.toast.show('GPS tidak tersedia — memakai lokasi default sebagai My Location', 'err');
    if (cb) {
      cb(DEFAULT_MAP_CENTER);
    }
  }

  setMyLoc(ll: LatLng, acc: number | null): void {
    this.myLocSubject.next(ll);
    this.myLocAccSubject.next(acc);
  }

  // ---------------- Tracking Point — 10s countdown (F-5.3/F-5.4) ----------------
  startTrackPoint(): void {
    if (this.countdown != null) {
      return;
    }
    this.cancelEditing(true);
    this.stopLineTrack(true);
    if (this.drawType) {
      this.cancelDraw();
    }
    this.countdownSubject.next(CD_SECONDS);
    this.cdTimer = setInterval(() => {
      const n = (this.countdownSubject.value || 0) - 1;
      if (n <= 0) {
        this.finishTrackPoint();
      } else {
        this.countdownSubject.next(n);
      }
    }, 1000);
  }

  cancelTrackPoint(): void {
    if (this.cdTimer) {
      clearInterval(this.cdTimer);
      this.cdTimer = null;
    }
    this.countdownSubject.next(null);
  }

  private finishTrackPoint(): void {
    if (this.cdTimer) {
      clearInterval(this.cdTimer);
      this.cdTimer = null;
    }
    this.countdownSubject.next(null);
    const pt = this.myLoc || DEFAULT_MAP_CENTER;
    if (!this.myLoc) {
      this.toast.show('My Location belum diambil — memakai lokasi default', 'err');
    }
    this.data.logActivity('Tracking Point selesai (hitung mundur ' + CD_SECONDS + ' dtk)');
    this.openEditor(
      {
        classificationId: this.data.collectionId,
        compartmentId: this.data.activeCompartmentId,
        title: '',
        description: '',
        address: '',
        images: [],
        privilege: 'PUBLIC',
        questionnaire: {},
        geometry: latLngsToGeom('Point', [pt])
      },
      true,
      'point'
    );
  }

  // ---------------- Tracking Line / Polygon (F-5.6 – F-5.10) ----------------
  startLineTrack(kind: 'LineString' | 'Polygon'): void {
    this.cancelEditing(true);
    if (this.drawType) {
      this.cancelDraw();
    }
    if (!this.myLoc) {
      this.toast.show('Ambil My Location dulu — titik awal harus menempel pada posisi Anda', 'err');
      return;
    }
    this.lineTrackSubject.next({ kind, pts: [this.myLoc] });
    this.toast.show('Titik awal ditandai. Gerak ke titik berikutnya lalu tekan “Tambah titik”, atau klik peta.');
  }

  lineTrackAddCurrent(): void {
    const lt = this.lineTrack;
    if (!lt) {
      return;
    }
    const p = this.myLoc || DEFAULT_MAP_CENTER;
    this.lineTrackSubject.next({ ...lt, pts: [...lt.pts, p] });
  }

  lineTrackAddAt(ll: LatLng): void {
    const lt = this.lineTrack;
    if (!lt) {
      return;
    }
    this.lineTrackSubject.next({ ...lt, pts: [...lt.pts, ll] });
  }

  lineTrackUndo(): void {
    const lt = this.lineTrack;
    if (!lt || lt.pts.length <= 1) {
      return;
    }
    this.lineTrackSubject.next({ ...lt, pts: lt.pts.slice(0, -1) });
  }

  stopLineTrack(silent?: boolean): void {
    if (!this.lineTrack) {
      return;
    }
    this.lineTrackSubject.next(null);
  }

  finishLineTrack(): void {
    const lt = this.lineTrack;
    if (!lt) {
      return;
    }
    const need = lt.kind === 'Polygon' ? 3 : 2;
    if (lt.pts.length < need) {
      this.toast.show('Butuh minimal ' + need + ' titik', 'err');
      return;
    }
    const pts = lt.pts.slice();
    this.lineTrackSubject.next(null);
    if (lt.kind === 'Polygon') {
      this.data.logActivity('Tracking Polygon selesai · ' + fmtArea(polygonAreaM2(pts)));
    } else {
      this.data.logActivity('Tracking Line selesai · ' + fmtLen(lineLengthM(pts)));
    }
    this.openEditor(
      {
        classificationId: this.data.collectionId,
        compartmentId: this.data.activeCompartmentId,
        title: '',
        description: '',
        address: '',
        images: [],
        privilege: 'PUBLIC',
        questionnaire: {},
        geometry: latLngsToGeom(lt.kind, pts)
      },
      true,
      lt.kind === 'Polygon' ? 'polygon' : 'line'
    );
  }

  // ---------------- edit an existing / just-captured shape ----------------
  /** Ports `openEditor(feature, isNew, trackKind)`. `feature` here is either a fresh draft (no
   *  `id`, from `finishDraw()`/`finishTrackPoint()`/`finishLineTrack()`) or an existing
   *  `GeomappingFeature` (from a My Layers row, an Approval "buka editor" link, or a search hit). */
  openEditor(feature: GeomappingFeatureDraft, isNew: boolean, trackKind: TrackKind = null): void {
    this.drawTypeSubject.next(null);
    const latlngs = geomToLatLngs(feature.geometry);
    this.shapeModeSubject.next(feature.geometry.type === 'Point' ? 'move' : 'vertex');
    this.editingSubject.next({
      isNew,
      id: feature.id || null,
      type: feature.geometry.type,
      latlngs,
      feature,
      trackKind,
      sessionId: ++this.sessionCounter
    });
  }

  cancelEditing(silent?: boolean): void {
    if (this.drawType) {
      this.cancelDraw();
      return;
    }
    if (!this.editing) {
      return;
    }
    this.editingSubject.next(null);
  }

  setShapeMode(mode: ShapeMode): void {
    this.shapeModeSubject.next(mode);
  }

  /** Live coordinates during an active drag — see class doc comment. Not persisted to `editing$`. */
  setLiveLatLngs(ll: LatLng[]): void {
    this.liveLatLngsSubject.next(ll);
  }

  /** Ports the drag-end half of `renderHandles()`'s per-vertex `dragend` listener +
   *  `commitEditGeom()`: advances the authoritative state once a drag gesture ends. */
  commitVertices(ll: LatLng[]): void {
    const e = this.editingSubject.value;
    if (!e) {
      return;
    }
    this.liveLatLngsSubject.next(null);
    this.editingSubject.next({ ...e, latlngs: ll });
  }

  /** Ports the `mode === "addvertex"` midpoint-click handler: splice a new vertex right after
   *  `index`. */
  insertVertexAfter(index: number, ll: LatLng): void {
    const e = this.editingSubject.value;
    if (!e) {
      return;
    }
    const next = e.latlngs.slice();
    next.splice(index + 1, 0, ll);
    this.editingSubject.next({ ...e, latlngs: next });
  }

  /** Ports the `mode === "delete"` vertex-click handler, including the minimum-points guard
   *  (`toast("Titik minimum tercapai")`). */
  deleteVertexAt(index: number): void {
    const e = this.editingSubject.value;
    if (!e) {
      return;
    }
    const min = e.type === 'LineString' ? 2 : 3;
    if (e.latlngs.length <= min) {
      this.toast.show('Titik minimum tercapai', 'err');
      return;
    }
    const next = e.latlngs.slice();
    next.splice(index, 1);
    this.editingSubject.next({ ...e, latlngs: next });
  }

  /** Ports the "Bersihkan & gambar ulang" (`#stClear`) button: drop the current shape and
   *  restart manual drawing of the same geometry type, keeping the chosen classification. */
  restartDrawing(): void {
    const e = this.editingSubject.value;
    if (!e || e.type === 'Point') {
      return;
    }
    const keepType = e.type;
    const clsId = (e.feature && e.feature.classificationId) || this.data.collectionId;
    this.editingSubject.next(null);
    this.data.setCollectionId(clsId);
    this.beginDraw(keepType);
  }

  /** Patches fields on the in-progress draft (classification/compartment/images/questionnaire —
   *  ports the handful of places the source mutates `f.*` directly, e.g. the `#fClass` change
   *  handler and `saveQuestionnaireDialog()`). Title/description/address/privilege are read
   *  straight from the form at save time in the source (`saveEditor()`); EditComponent does the
   *  same via its own local fields rather than round-tripping every keystroke through here. */
  updateDraftField(patch: Partial<GeomappingFeatureDraft>): void {
    const e = this.editingSubject.value;
    if (!e || !e.feature) {
      return;
    }
    this.editingSubject.next({ ...e, feature: { ...e.feature, ...patch } });
  }

  /** Ports `saveEditor()`'s record-building call into `GeomappingDataService.saveFeature()` — the
   *  validation (`Judul`/`Deskripsi` wajib diisi) and its `.invalid` field styling stay in
   *  EditComponent, matching where the source does its own field-level DOM work before calling
   *  this. */
  saveEditor(fields: {
    title: string;
    description: string;
    address: string;
    classificationId: string;
    compartmentId: string | null;
    privilege: FeaturePrivilege;
  }): GeomappingFeature | null {
    const e = this.editingSubject.value;
    if (!e || !e.feature) {
      return null;
    }
    const draft: GeomappingFeatureDraft = {
      id: e.id || undefined,
      classificationId: fields.classificationId,
      compartmentId: fields.compartmentId,
      title: fields.title,
      description: fields.description,
      address: fields.address,
      images: e.feature.images || [],
      privilege: fields.privilege,
      questionnaire: e.feature.questionnaire || {},
      geometry: latLngsToGeom(e.type, e.latlngs),
      createdAt: e.feature.createdAt
    };
    const rec = this.data.saveFeature(draft, e.isNew);
    this.editingSubject.next(null);
    this.toast.show('Objek disimpan ke My Layers', 'ok');
    return rec;
  }
}
