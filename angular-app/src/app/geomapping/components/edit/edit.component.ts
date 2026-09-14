import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { geomappingSvg } from '../../config/icons';
import {
  APPROVAL_ACTION_LABEL,
  APPROVAL_META,
  ApprovalHistoryEntry,
  Classification,
  Compartment,
  FeaturePrivilege,
  GeomappingFeature,
  GeometryType
} from '../../models/geomapping.model';
import { LatLng, fmtArea, fmtDur, fmtLen, fmtWhen, geomLabel, geomToLatLngs, lineLengthM, polygonAreaM2 } from '../../services/geo-math';
import { GeomappingDataService } from '../../services/geomapping-data.service';
import { EditingState, GeomappingEditService, LineTrackState, ShapeMode } from '../../services/geomapping-edit.service';
import { GeomappingToastService } from '../../services/geomapping-toast.service';
import { qnAnsweredCount, qnFieldCount, questionnaireSummaryRows, QuestionnaireSummaryRow } from '../../services/questionnaire-utils';

const DRAW_TOOLS: [GeometryType, string, string][] = [
  ['Point', 'point', 'Titik'],
  ['LineString', 'line', 'Garis'],
  ['Polygon', 'polygon', 'Poligon']
];

/**
 * The routed `/geomapping/edit` panel — ports `renderEditPanel()`/`renderEditorForm()` (the dock
 * panel body only; the countdown ring and the draw-dock/draw-hint bars living directly over the
 * map are `GeomappingShellComponent`'s, since — like the map itself — they sit outside the
 * `<router-outlet>` and must stay visible across the brief moment before this route mounts).
 * Renders whichever of Edit Mode's sub-views `GeomappingEditService`'s state calls for, mirroring
 * the source's if/else-if chain exactly: countdown → line-track → in-progress manual draw →
 * editor form → the Edit Mode landing (Tracking/manual-draw entry points + recent objects).
 *
 * Title/Description/Address/Privilege/WorkCompartment are kept as local form fields and only sent
 * to `GeomappingEditService.saveEditor()` on Simpan — ports the source reading straight from the
 * DOM at save time (`#fTitle`/`#fDesc`/…) rather than keeping them on the live draft. Classification
 * is the one field that's also pushed live (`updateDraftField`) so the map's shape preview restyles
 * immediately, same as the source's `#fClass` change handler. See `EditingState.sessionId`'s doc
 * comment for how the form avoids resetting itself on every live-draft change.
 */
@Component({
  selector: 'dgt-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  readonly drawTools = DRAW_TOOLS;
  /** [mode, icon, title, disabledForPoint] — ports `shapeToolBtn()`'s calls (index.html:2572-2575):
   *  every mode disables for a Point feature except "move" (`shapeToolBtn("move", ..., false)` in
   *  the source — a Point's marker is always draggable regardless of shape-tool mode). */
  readonly shapeModes: [ShapeMode, string, string, boolean][] = [
    ['vertex', 'edit', 'Sunting titik', true],
    ['move', 'move', 'Geser bentuk', false],
    ['addvertex', 'addpt', 'Tambah titik', true],
    ['delete', 'delpt', 'Hapus titik', true]
  ];
  readonly privileges: FeaturePrivilege[] = ['PUBLIC', 'RESTRICTED', 'PRIVATE'];

  editing: EditingState | null = null;
  drawType: GeometryType | null = null;
  lineTrack: LineTrackState | null = null;
  countdown: number | null = null;
  myLoc: LatLng | null = null;
  shapeMode: ShapeMode = 'vertex';
  liveLatLngs: LatLng[] | null = null;

  classifications: Classification[] = [];
  compartments: Compartment[] = [];
  features: GeomappingFeature[] = [];

  // ---- editor form local fields (DOM-only in the source until Simpan) ----
  formTitle = '';
  formDescription = '';
  formAddress = '';
  formClassificationId = '';
  formCompartmentId: string | null = null;
  formPrivilege: FeaturePrivilege = 'PUBLIC';
  titleInvalid = false;
  descInvalid = false;
  deleteArmed = false;

  showQuestionnaire = false;

  /** Mirrors `GeomappingEditService.CD_SECONDS` (10s, PRD F-5.3) for the landing card's copy. */
  readonly CD_SECONDS = 10;

  private loadedSessionId: number | null = null;
  private readonly subs: Subscription[] = [];

  constructor(
    readonly data: GeomappingDataService,
    private readonly editService: GeomappingEditService,
    private readonly toast: GeomappingToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(this.data.classifications$.subscribe(c => (this.classifications = c)));
    this.subs.push(this.data.compartments$.subscribe(c => (this.compartments = c)));
    this.subs.push(this.data.features$.subscribe(f => (this.features = f)));

    this.subs.push(this.editService.drawType$.subscribe(t => (this.drawType = t)));
    this.subs.push(this.editService.lineTrack$.subscribe(lt => (this.lineTrack = lt)));
    this.subs.push(this.editService.countdown$.subscribe(c => (this.countdown = c)));
    this.subs.push(this.editService.myLoc$.subscribe(ll => (this.myLoc = ll)));
    this.subs.push(this.editService.shapeMode$.subscribe(m => (this.shapeMode = m)));
    this.subs.push(this.editService.liveLatLngs$.subscribe(ll => (this.liveLatLngs = ll)));
    this.subs.push(
      this.editService.editing$.subscribe(e => {
        this.editing = e;
        if (e && e.feature && e.sessionId !== this.loadedSessionId) {
          this.loadedSessionId = e.sessionId;
          this.loadForm(e.feature);
        }
        if (!e || !e.feature) {
          this.loadedSessionId = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    // Ports the rail click handler's "leaving Edit Mode cancels whatever's in progress"
    // (index.html:1866) — expressed here as route-scoped cleanup instead, since navigating away
    // IS leaving Edit Mode in this port's routed structure.
    if (this.editService.editing) {
      this.editService.cancelEditing(true);
    }
    if (this.editService.drawType) {
      this.editService.cancelDraw();
    }
    if (this.editService.lineTrack) {
      this.editService.stopLineTrack(true);
    }
  }

  private loadForm(f: NonNullable<EditingState['feature']>): void {
    this.formTitle = f.title || '';
    this.formDescription = f.description || '';
    this.formAddress = f.address || '';
    this.formClassificationId = f.classificationId;
    this.formCompartmentId = f.compartmentId;
    this.formPrivilege = f.privilege || 'PUBLIC';
    this.titleInvalid = false;
    this.descInvalid = false;
    this.deleteArmed = false;
  }

  iconSvg(name: string): string {
    return geomappingSvg(name);
  }
  geomLabel(t: GeometryType): string {
    return geomLabel(t);
  }

  // ---------------- Edit Mode landing ----------------
  get hasLoc(): boolean {
    return !!this.myLoc;
  }
  get recentFeatures(): GeomappingFeature[] {
    return this.features
      .slice()
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
      .slice(0, 6);
  }
  rowMeta(f: GeomappingFeature): string {
    const ll = geomToLatLngs(f.geometry);
    if (f.geometry.type === 'Polygon') {
      return fmtArea(polygonAreaM2(ll));
    }
    if (f.geometry.type === 'LineString') {
      return fmtLen(lineLengthM(ll));
    }
    return ll.length ? ll[0].lat.toFixed(4) + ', ' + ll[0].lng.toFixed(4) : '';
  }
  clsOf(f: GeomappingFeature): Classification {
    return this.data.clsById(f.classificationId);
  }
  apprColor(f: GeomappingFeature): string {
    return (APPROVAL_META[f.approval.status] || APPROVAL_META.PENDING).color;
  }
  apprLabel(f: GeomappingFeature): string {
    return (APPROVAL_META[f.approval.status] || APPROVAL_META.PENDING).label;
  }

  openFeature(f: GeomappingFeature): void {
    this.editService.openEditor(f, false);
  }
  goToMyLayers(): void {
    this.router.navigateByUrl('/geomapping/mylayers');
  }
  requestLoc(): void {
    this.editService.requestMyLoc();
  }
  refreshLocQuiet(): void {
    this.editService.requestMyLoc(() => this.toast.show('My Location diperbarui', 'ok'));
  }
  beginDraw(t: GeometryType): void {
    this.editService.beginDraw(t);
  }
  startTrackPoint(): void {
    this.editService.startTrackPoint();
  }
  startLineTrack(kind: 'LineString' | 'Polygon'): void {
    this.editService.startLineTrack(kind);
  }

  rowDeleteArmedId: string | null = null;
  armRowDelete(id: string, ev: Event): void {
    ev.stopPropagation();
    if (this.rowDeleteArmedId !== id) {
      this.rowDeleteArmedId = id;
      setTimeout(() => {
        if (this.rowDeleteArmedId === id) {
          this.rowDeleteArmedId = null;
        }
      }, 2600);
      return;
    }
    this.data.deleteFeature(id);
    this.rowDeleteArmedId = null;
    this.toast.show('Objek dihapus', 'ok');
  }

  // ---------------- countdown ----------------
  cancelTrackPoint(): void {
    this.editService.cancelTrackPoint();
  }

  // ---------------- line/polygon tracking ----------------
  get lineTrackLenLabel(): string {
    if (!this.lineTrack) {
      return '';
    }
    return this.lineTrack.kind === 'Polygon' && this.lineTrack.pts.length >= 3
      ? fmtArea(polygonAreaM2(this.lineTrack.pts))
      : fmtLen(lineLengthM(this.lineTrack.pts));
  }
  lineTrackAddCurrent(): void {
    this.editService.lineTrackAddCurrent();
  }
  lineTrackUndo(): void {
    this.editService.lineTrackUndo();
  }
  finishLineTrack(): void {
    this.editService.finishLineTrack();
  }
  cancelLineTrack(): void {
    this.editService.stopLineTrack();
  }

  // ---------------- manual draw in progress ----------------
  finishDraw(): void {
    this.editService.finishDraw();
  }
  cancelDraw(): void {
    this.editService.cancelDraw();
  }

  // ---------------- editor form ----------------
  get liveLatLngsOrCurrent(): LatLng[] {
    return this.liveLatLngs || (this.editing ? this.editing.latlngs : []);
  }
  get readoutRows(): { k: string; v: string }[] {
    const e = this.editing;
    if (!e) {
      return [];
    }
    const ll = this.liveLatLngsOrCurrent;
    if (e.type === 'Polygon') {
      return [
        { k: 'Area', v: fmtArea(polygonAreaM2(ll)) },
        { k: 'Keliling', v: fmtLen(lineLengthM(ll.concat(ll[0]))) },
        { k: 'Jumlah titik', v: String(ll.length) }
      ];
    }
    if (e.type === 'LineString') {
      const lenM = lineLengthM(ll);
      return [
        { k: 'Panjang lintasan', v: fmtLen(lenM) },
        { k: 'Est. waktu tempuh (jalan kaki)', v: fmtDur(lenM / ((4.5 * 1000) / 3600)) },
        { k: 'Jumlah titik', v: String(ll.length) }
      ];
    }
    const p = ll[0];
    if (!p) {
      return [];
    }
    const rows = [
      { k: 'Latitude', v: p.lat.toFixed(6) },
      { k: 'Longitude', v: p.lng.toFixed(6) }
    ];
    if (this.editService.myLocAcc) {
      rows.push({ k: 'Akurasi GPS', v: '±' + Math.round(this.editService.myLocAcc) + ' m' });
    }
    return rows;
  }

  get selectedClassification(): Classification | null {
    return this.formClassificationId ? this.data.clsById(this.formClassificationId) : null;
  }
  onClassificationChange(id: string): void {
    this.formClassificationId = id;
    this.editService.updateDraftField({ classificationId: id });
  }

  qnAnsweredCount(): number {
    return this.editing && this.editing.feature ? qnAnsweredCount(this.editing.feature.questionnaire) : 0;
  }
  qnFieldCount(): number {
    return qnFieldCount();
  }
  get questionnaireSummaryRows(): QuestionnaireSummaryRow[] {
    return this.editing && this.editing.feature ? questionnaireSummaryRows(this.editing.feature.questionnaire) : [];
  }
  openQuestionnaire(): void {
    this.showQuestionnaire = true;
  }
  onQuestionnaireSaved(clean: { [key: string]: any }): void {
    this.editService.updateDraftField({ questionnaire: clean });
    this.showQuestionnaire = false;
    this.toast.show('Jawaban kuesioner disimpan', 'ok');
  }
  onQuestionnaireClosed(): void {
    this.showQuestionnaire = false;
  }

  get images(): string[] {
    return (this.editing && this.editing.feature && this.editing.feature.images) || [];
  }
  addImage(): void {
    this.editService.updateDraftField({ images: [...this.images, ''] });
  }
  updateImage(i: number, value: string): void {
    const next = this.images.slice();
    next[i] = value;
    this.editService.updateDraftField({ images: next });
  }
  removeImage(i: number): void {
    const next = this.images.slice();
    next.splice(i, 1);
    this.editService.updateDraftField({ images: next });
  }

  setShapeMode(m: ShapeMode): void {
    this.editService.setShapeMode(m);
  }
  restartDrawing(): void {
    this.editService.restartDrawing();
  }

  cancelEditing(): void {
    this.editService.cancelEditing();
  }

  save(): void {
    const title = (this.formTitle || '').trim();
    const description = (this.formDescription || '').trim();
    this.titleInvalid = !title;
    this.descInvalid = !description;
    if (!title || !description) {
      this.toast.show('Judul dan Deskripsi wajib diisi', 'err');
      return;
    }
    this.editService.saveEditor({
      title,
      description,
      address: (this.formAddress || '').trim(),
      classificationId: this.formClassificationId,
      compartmentId: this.formCompartmentId,
      privilege: this.formPrivilege
    });
  }

  deleteFeature(): void {
    const e = this.editing;
    if (!e || !e.id) {
      return;
    }
    if (!this.deleteArmed) {
      this.deleteArmed = true;
      return;
    }
    this.data.deleteFeature(e.id);
    this.deleteArmed = false;
    this.editService.cancelEditing(true);
    this.toast.show('Objek dihapus', 'ok');
  }

  // ---------------- approval meta (existing features only) ----------------
  actionLabel(action: ApprovalHistoryEntry['action']): string {
    return APPROVAL_ACTION_LABEL[action] || action;
  }
  historyDotColor(action: ApprovalHistoryEntry['action']): string {
    const meta = (APPROVAL_META as { [key: string]: { label: string; color: string } })[action];
    return meta ? meta.color : 'var(--series-2)';
  }
  fmtWhen(iso: string | null | undefined): string {
    return iso ? fmtWhen(Date.parse(iso)) : '-';
  }
  statusMeta(status: string): { label: string; color: string } {
    return (APPROVAL_META as { [key: string]: { label: string; color: string } })[status] || APPROVAL_META.PENDING;
  }
}
