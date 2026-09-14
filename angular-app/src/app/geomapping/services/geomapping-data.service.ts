import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { geomLabel, geomToLatLngs, lineLengthM, polygonAreaM2 } from './geo-math';
import {
  ActivityEntry,
  APPROVAL_ACTION_LABEL,
  ApprovalHistoryEntry,
  ApprovalRecord,
  ApprovalStatus,
  Classification,
  Compartment,
  DEFAULT_CLASSIFICATIONS,
  DEFAULT_COMPARTMENTS,
  DEFAULT_FEATURES,
  DEFAULT_TASKS,
  DEFAULT_BASEMAP,
  GeomappingFeature,
  GeomappingFeatureDraft,
  GeomappingTask,
  Poi,
  POIS
} from '../models/geomapping.model';

const LS = 'geomapping:';
const AUTH_KEY = 'geomapping-auth';
/** Bump whenever DEFAULT_CLASSIFICATIONS changes shape so existing localStorage installs (shared
 *  with the original static tool — same `geomapping:` key prefix, same origin) get the new set +
 *  a remap of anything that referenced an old id. Ports CLS_VERSION/CLS_REMAP verbatim. */
const CLS_VERSION = 2;
const CLS_REMAP: { [key: string]: string } = {
  'cls-public': 'cls-objek-peta',
  'cls-parcel': 'cls-properti',
  'cls-boundary': 'cls-objek-peta',
  'cls-infra': 'cls-utilitas',
  'cls-fasum': 'cls-kesehatan'
};

function uid(p?: string): string {
  return (p || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function lsSet(key: string, v: any): void {
  try {
    localStorage.setItem(LS + key, JSON.stringify(v));
  } catch (e) {
    /* private mode / quota */
  }
}

/**
 * Ports geomapping/index.html's module-level state (`store`, `classifications`/`features`/
 * `compartments`/`tasks`/`activity`, the scalar bits of `state`, `persist()`, and the small data
 * helpers around them — `clsById`/`wcById`/`classOrder`/`clsLabel`, the approval-workflow helpers,
 * `logActivity`). Reactive (BehaviorSubject per collection/scalar) rather than the original's
 * "mutate the module var, call the matching renderX() by hand" — Angular components subscribe
 * instead. Same `geomapping:` localStorage key prefix as the original (and as the Angular
 * data-manager port kept `dgt-data-manager:`), preserved on purpose: this port and the original
 * static tool share an origin (github.io), so a team's existing local data carries over.
 */
@Injectable({ providedIn: 'root' })
export class GeomappingDataService {
  readonly poiList: Poi[] = POIS;

  private readonly classificationsSubject: BehaviorSubject<Classification[]>;
  readonly classifications$;

  private readonly compartmentsSubject: BehaviorSubject<Compartment[]>;
  readonly compartments$;

  private readonly featuresSubject: BehaviorSubject<GeomappingFeature[]>;
  readonly features$;

  private readonly tasksSubject: BehaviorSubject<GeomappingTask[]>;
  readonly tasks$;

  private readonly activitySubject: BehaviorSubject<ActivityEntry[]>;
  readonly activity$;

  private readonly activeCompartmentSubject: BehaviorSubject<string | null>;
  readonly activeCompartment$;

  private readonly hiddenSubject: BehaviorSubject<{ [id: string]: boolean }>;
  readonly hidden$;

  private readonly basemapSubject: BehaviorSubject<string>;
  readonly basemap$;

  private readonly boundarySubject: BehaviorSubject<{ [key: string]: boolean }>;
  readonly boundary$;

  private readonly poiVisibleSubject: BehaviorSubject<boolean>;
  readonly poiVisible$;

  private readonly collectionIdSubject: BehaviorSubject<string>;
  readonly collectionId$;

  constructor() {
    let classifications = lsGet<Classification[] | null>('classifications', null);
    if (!classifications || !classifications.length || (lsGet<number>('clsVersion', 1) | 0) < CLS_VERSION) {
      classifications = DEFAULT_CLASSIFICATIONS.slice();
      lsSet('classifications', classifications);
      lsSet('clsVersion', CLS_VERSION);
      const validCls: { [id: string]: boolean } = {};
      classifications.forEach(c => (validCls[c.id] = true));
      const clsFallback = classifications[0].id;
      const remapCls = (id: string) => (validCls[id] ? id : CLS_REMAP[id] || clsFallback);
      const seedFeatures = lsGet<GeomappingFeature[] | null>('features', null);
      if (seedFeatures && seedFeatures.length) {
        seedFeatures.forEach(f => (f.classificationId = remapCls(f.classificationId)));
        lsSet('features', seedFeatures);
      }
      const seedHidden = lsGet<{ [id: string]: boolean } | null>('hidden', null);
      if (seedHidden) {
        const nh: { [id: string]: boolean } = {};
        Object.keys(seedHidden).forEach(k => {
          if (seedHidden[k]) {
            nh[remapCls(k)] = true;
          }
        });
        lsSet('hidden', nh);
      }
      const seedCollectionId = lsGet<string | null>('collectionId', null);
      if (seedCollectionId) {
        lsSet('collectionId', remapCls(seedCollectionId));
      }
    }
    this.classificationsSubject = new BehaviorSubject<Classification[]>(classifications);
    this.classifications$ = this.classificationsSubject.asObservable();

    let features = lsGet<GeomappingFeature[] | null>('features', null);
    if (features == null) {
      features = DEFAULT_FEATURES.slice();
      lsSet('features', features);
    }
    features.forEach(f => {
      if (!f.approval) {
        const t = f.createdAt || new Date().toISOString();
        f.approval = { status: 'PENDING', submittedBy: 'surveyor01', submittedAt: t, reviewer: null, reviewedAt: null, note: '', history: [{ action: 'SUBMITTED', by: 'surveyor01', at: t, note: '' }] };
      }
      if (!f.questionnaire || typeof f.questionnaire !== 'object') {
        f.questionnaire = {};
      }
    });
    this.featuresSubject = new BehaviorSubject<GeomappingFeature[]>(features);
    this.features$ = this.featuresSubject.asObservable();

    const compartments = lsGet<Compartment[] | null>('compartments', null) || DEFAULT_COMPARTMENTS.slice();
    lsSet('compartments', compartments);
    this.compartmentsSubject = new BehaviorSubject<Compartment[]>(compartments);
    this.compartments$ = this.compartmentsSubject.asObservable();

    const tasks = lsGet<GeomappingTask[] | null>('tasks', null) || DEFAULT_TASKS.slice();
    lsSet('tasks', tasks);
    this.tasksSubject = new BehaviorSubject<GeomappingTask[]>(tasks);
    this.tasks$ = this.tasksSubject.asObservable();

    this.activitySubject = new BehaviorSubject<ActivityEntry[]>(lsGet<ActivityEntry[]>('activity', []));
    this.activity$ = this.activitySubject.asObservable();

    let activeCompartment = lsGet<string | null>('activeCompartment', null);
    if (activeCompartment && !compartments.some(c => c.id === activeCompartment)) {
      activeCompartment = null;
    }
    this.activeCompartmentSubject = new BehaviorSubject<string | null>(activeCompartment);
    this.activeCompartment$ = this.activeCompartmentSubject.asObservable();

    this.hiddenSubject = new BehaviorSubject<{ [id: string]: boolean }>(lsGet('hidden', {}));
    this.hidden$ = this.hiddenSubject.asObservable();

    let basemap = lsGet<string>('basemap', DEFAULT_BASEMAP);
    this.basemapSubject = new BehaviorSubject<string>(basemap);
    this.basemap$ = this.basemapSubject.asObservable();

    this.boundarySubject = new BehaviorSubject<{ [key: string]: boolean }>(lsGet('boundary', {}));
    this.boundary$ = this.boundarySubject.asObservable();

    this.poiVisibleSubject = new BehaviorSubject<boolean>(lsGet('poiVisible', false));
    this.poiVisible$ = this.poiVisibleSubject.asObservable();

    let collectionId = lsGet<string>('collectionId', classifications[0].id);
    if (!classifications.some(c => c.id === collectionId)) {
      collectionId = classifications[0].id;
    }
    this.collectionIdSubject = new BehaviorSubject<string>(collectionId);
    this.collectionId$ = this.collectionIdSubject.asObservable();
  }

  // ---------------- snapshot getters (sync access, like the original's plain module vars) ----------------
  get classifications(): Classification[] {
    return this.classificationsSubject.value;
  }
  get compartments(): Compartment[] {
    return this.compartmentsSubject.value;
  }
  get features(): GeomappingFeature[] {
    return this.featuresSubject.value;
  }
  get tasks(): GeomappingTask[] {
    return this.tasksSubject.value;
  }
  get activity(): ActivityEntry[] {
    return this.activitySubject.value;
  }
  get activeCompartmentId(): string | null {
    return this.activeCompartmentSubject.value;
  }
  get hidden(): { [id: string]: boolean } {
    return this.hiddenSubject.value;
  }
  get basemap(): string {
    return this.basemapSubject.value;
  }
  get boundary(): { [key: string]: boolean } {
    return this.boundarySubject.value;
  }
  get poiVisible(): boolean {
    return this.poiVisibleSubject.value;
  }
  get collectionId(): string {
    return this.collectionIdSubject.value;
  }

  // ---------------- identity (no login gate — see AuthGateService-equivalent note in launcher) ----------------
  userName(): string {
    try {
      return sessionStorage.getItem(AUTH_KEY) || 'surveyor01';
    } catch (e) {
      return 'surveyor01';
    }
  }

  // ---------------- lookups ----------------
  clsById(id: string): Classification {
    return this.classifications.find(c => c.id === id) || this.classifications[0];
  }
  wcById(id: string | null): Compartment | null {
    if (!id) {
      return null;
    }
    return this.compartments.find(c => c.id === id) || null;
  }
  /** Classification picker hierarchy: walk `classifications` in order, folding entries that share
   *  a `group` into one block; ungrouped entries stand alone. */
  classOrder(): { grp: string | null; items: Classification[] }[] {
    const out: { grp: string | null; items: Classification[] }[] = [];
    const seen: { [group: string]: { grp: string; items: Classification[] } } = {};
    this.classifications.forEach(c => {
      if (c.group) {
        if (!seen[c.group]) {
          seen[c.group] = { grp: c.group, items: [] };
          out.push(seen[c.group]);
        }
        seen[c.group].items.push(c);
      } else {
        out.push({ grp: null, items: [c] });
      }
    });
    return out;
  }
  clsLabel(c: Classification): string {
    return c.group ? c.group + ' · ' + c.name : c.name;
  }

  // ---------------- approval workflow ----------------
  apprCount(status: ApprovalStatus): number {
    return this.features.filter(f => f.approval.status === status).length;
  }

  // ---------------- activity log ----------------
  logActivity(action: string): void {
    const next = [{ id: uid('act'), ts: Date.now(), action }, ...this.activity].slice(0, 200);
    this.activitySubject.next(next);
    lsSet('activity', next);
  }

  // ---------------- compartments (WorkCompartment / Public Mapping) ----------------
  createCompartment(name: string, desc: string, thumb: string): Compartment {
    const rec: Compartment = { id: uid('wc'), name, desc, thumb, createdAt: new Date().toISOString() };
    const next = [...this.compartments, rec];
    this.compartmentsSubject.next(next);
    lsSet('compartments', next);
    this.setActiveCompartment(rec.id);
    this.logActivity('Buat & aktifkan WorkCompartment: ' + rec.name);
    return rec;
  }
  deleteCompartment(id: string): void {
    const victim = this.wcById(id);
    const nextCompartments = this.compartments.filter(c => c.id !== id);
    this.compartmentsSubject.next(nextCompartments);
    lsSet('compartments', nextCompartments);
    const nextFeatures = this.features.map(f => (f.compartmentId === id ? { ...f, compartmentId: null } : f));
    this.featuresSubject.next(nextFeatures);
    lsSet('features', nextFeatures);
    if (this.activeCompartmentId === id) {
      this.activeCompartmentSubject.next(null);
      lsSet('activeCompartment', null);
    }
    if (victim) {
      this.logActivity('Hapus WorkCompartment: ' + victim.name);
    }
  }
  setActiveCompartment(id: string | null): void {
    this.activeCompartmentSubject.next(id);
    lsSet('activeCompartment', id);
  }
  exitCompartment(): void {
    this.setActiveCompartment(null);
    this.logActivity('Kembali ke Public Mapping default');
  }

  // ---------------- features ----------------
  private newApprovalRecord(): ApprovalRecord {
    const now = new Date().toISOString();
    return {
      status: 'PENDING',
      submittedBy: this.userName(),
      submittedAt: now,
      reviewer: null,
      reviewedAt: null,
      note: '',
      history: [{ action: 'SUBMITTED', by: this.userName(), at: now, note: '' }]
    };
  }

  /** Ports `saveEditor()`'s record-building + persist/log (geomapping/index.html:2650) — the DOM
   *  field-reading and validation stay in EditComponent/GeomappingEditService, this just takes the
   *  already-validated draft and turns it into a stored `GeomappingFeature`. A brand-new feature
   *  gets a fresh PENDING `ApprovalRecord` (`newApproval()` in the source); an existing one keeps
   *  its approval untouched (`ensureApproval(f)` in the source, which — since this port's features
   *  always carry an `approval` once loaded, see the constructor — just means "keep it"). */
  saveFeature(draft: GeomappingFeatureDraft, isNew: boolean): GeomappingFeature {
    const now = new Date().toISOString();
    const existing = !isNew && draft.id ? this.features.find(f => f.id === draft.id) : undefined;
    const rec: GeomappingFeature = {
      id: draft.id || uid('ft'),
      classificationId: draft.classificationId,
      compartmentId: draft.compartmentId || null,
      title: draft.title,
      description: draft.description,
      address: draft.address,
      images: (draft.images || []).filter(u => u && u.trim()),
      privilege: draft.privilege,
      questionnaire: draft.questionnaire && typeof draft.questionnaire === 'object' ? draft.questionnaire : {},
      geometry: draft.geometry,
      approval: isNew ? this.newApprovalRecord() : existing ? existing.approval : this.newApprovalRecord(),
      createdAt: isNew ? now : draft.createdAt || now,
      updatedAt: now
    };
    const next = isNew ? [...this.features, rec] : this.features.map(f => (f.id === rec.id ? rec : f));
    this.featuresSubject.next(next);
    lsSet('features', next);
    this.logActivity((isNew ? 'Simpan objek baru: ' : 'Perbarui objek: ') + rec.title + ' (' + geomLabel(rec.geometry.type) + ')');
    return rec;
  }

  deleteFeature(id: string): void {
    const victim = this.features.find(f => f.id === id);
    const next = this.features.filter(f => f.id !== id);
    this.featuresSubject.next(next);
    lsSet('features', next);
    if (victim) {
      this.logActivity('Hapus objek: ' + (victim.title || '(tanpa judul)'));
    }
  }

  // ---------------- approval workflow (PRD open question #2) ----------------
  /** Ports `setApproval(f, status, note)` verbatim: PENDING clears reviewer/reviewedAt, any other
   *  status stamps the current user + now as reviewer/reviewedAt. Always prepends a history entry
   *  (RESET for a PENDING status, the status itself otherwise) — matches `APPROVAL_ACTION_LABEL`'s
   *  4 keys (SUBMITTED/APPROVED/REJECTED/RESET). */
  setApproval(id: string, status: ApprovalStatus, note: string): void {
    const now = new Date().toISOString();
    const next = this.features.map(f => {
      if (f.id !== id) {
        return f;
      }
      const a = f.approval;
      const historyEntry: ApprovalHistoryEntry = { action: status === 'PENDING' ? 'RESET' : status, by: this.userName(), at: now, note: note || '' };
      return {
        ...f,
        approval: {
          ...a,
          status,
          reviewer: status === 'PENDING' ? null : this.userName(),
          reviewedAt: status === 'PENDING' ? null : now,
          note: note || '',
          history: [historyEntry, ...(a.history || [])]
        }
      };
    });
    this.featuresSubject.next(next);
    lsSet('features', next);
    const f = this.features.find(x => x.id === id);
    const actionLabel = APPROVAL_ACTION_LABEL[status === 'PENDING' ? 'RESET' : status];
    this.logActivity('Approval — ' + actionLabel + ': ' + (f ? f.title || '(tanpa judul)' : '') + (note ? ' — ' + note : ''));
  }

  // ---------------- tasks ----------------
  addTask(title: string): void {
    const next = [...this.tasks, { id: uid('tsk'), title, desc: '', done: false }];
    this.tasksSubject.next(next);
    lsSet('tasks', next);
  }
  toggleTaskDone(id: string, done: boolean): void {
    const t = this.tasks.find(x => x.id === id);
    const next = this.tasks.map(x => (x.id === id ? { ...x, done } : x));
    this.tasksSubject.next(next);
    lsSet('tasks', next);
    if (t) {
      this.logActivity((done ? 'Tandai tugas selesai: ' : 'Buka kembali tugas: ') + t.title);
    }
  }
  deleteTask(id: string): void {
    const next = this.tasks.filter(x => x.id !== id);
    this.tasksSubject.next(next);
    lsSet('tasks', next);
  }

  // ---------------- activity log ----------------
  clearActivity(): void {
    this.activitySubject.next([]);
    lsSet('activity', []);
  }

  // ---------------- classifications (visibility + adding new ones) ----------------
  setClassificationHidden(id: string, hidden: boolean): void {
    const next = { ...this.hidden };
    if (hidden) {
      next[id] = true;
    } else {
      delete next[id];
    }
    this.hiddenSubject.next(next);
    lsSet('hidden', next);
  }
  addClassification(name: string, desc: string, color: string, icon: string): Classification {
    const rec: Classification = { id: uid('cls'), name, desc: desc || '-', color, icon };
    const next = [...this.classifications, rec];
    this.classificationsSubject.next(next);
    lsSet('classifications', next);
    return rec;
  }
  setCollectionId(id: string): void {
    this.collectionIdSubject.next(id);
    lsSet('collectionId', id);
  }

  // ---------------- map chrome (basemap / boundary / POI) ----------------
  setBasemap(key: string): void {
    this.basemapSubject.next(key);
    lsSet('basemap', key);
  }
  setBoundary(next: { [key: string]: boolean }): void {
    this.boundarySubject.next(next);
    lsSet('boundary', next);
  }
  setPoiVisible(visible: boolean): void {
    this.poiVisibleSubject.next(visible);
    lsSet('poiVisible', visible);
  }

  // ---------------- GeoJSON import/export (PRD F-4.9-ish) ----------------
  /** Ports `exportGeoJSON()`'s FeatureCollection shape verbatim (the actual file-download/Blob
   *  browser API stays in the component that triggers it, MyLayersComponent). */
  toGeoJSON(): { type: 'FeatureCollection'; features: any[] } {
    return {
      type: 'FeatureCollection',
      features: this.features.map(f => {
        const cls = this.clsById(f.classificationId);
        const ll = geomToLatLngs(f.geometry);
        const wc = f.compartmentId ? this.wcById(f.compartmentId) : null;
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            id: f.id,
            title: f.title,
            description: f.description,
            address: f.address,
            classification: cls.name,
            classification_id: f.classificationId,
            compartment: wc ? wc.name : undefined,
            compartment_id: f.compartmentId || undefined,
            privilege: f.privilege,
            images: f.images || [],
            approval_status: f.approval.status,
            approval_reviewer: f.approval.reviewer || undefined,
            approval_submitted_at: f.approval.submittedAt || undefined,
            approval_reviewed_at: f.approval.reviewedAt || undefined,
            area_m2: f.geometry.type === 'Polygon' ? Math.round(polygonAreaM2(ll) * 100) / 100 : undefined,
            length_m: f.geometry.type === 'LineString' ? Math.round(lineLengthM(ll) * 100) / 100 : undefined,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt
          }
        };
      })
    };
  }

  /** Ports `importGeoJSON()`'s parse/validate/merge logic verbatim. Returns the count added; call
   *  site is responsible for the actual `<input type="file">` + FileReader (browser/DOM concerns
   *  stay in the component, MyLayersComponent). Throws on a structurally invalid file, same as the
   *  original's try/catch → toast("Berkas GeoJSON tidak valid"). */
  importGeoJSON(raw: string): number {
    const data = JSON.parse(raw);
    const arr: any[] = data.type === 'FeatureCollection' ? data.features : data.type === 'Feature' ? [data] : [];
    if (!arr.length) {
      throw new Error('no features');
    }
    const additions: GeomappingFeature[] = [];
    arr.forEach(gf => {
      const g = gf.geometry;
      if (!g || ['Point', 'LineString', 'Polygon'].indexOf(g.type) < 0) {
        return;
      }
      const p = gf.properties || {};
      const cls = this.classifications.find(c => c.id === p.classification_id || c.name === p.classification) || this.clsById(this.collectionId);
      const wc = this.compartments.find(c => c.id === p.compartment_id || c.name === p.compartment);
      const now = new Date().toISOString();
      const impStatus: ApprovalStatus = ['PENDING', 'APPROVED', 'REJECTED'].indexOf(p.approval_status) >= 0 ? p.approval_status : 'PENDING';
      additions.push({
        id: uid('ft'),
        classificationId: cls.id,
        compartmentId: wc ? wc.id : this.activeCompartmentId,
        title: p.title || p.name || 'Objek impor',
        description: p.description || '',
        address: p.address || '',
        images: Array.isArray(p.images) ? p.images : [],
        privilege: p.privilege || 'PUBLIC',
        geometry: g,
        questionnaire: {},
        approval: {
          status: impStatus,
          submittedBy: p.approval_reviewer ? p.approval_reviewer + ' (impor)' : this.userName(),
          submittedAt: p.approval_submitted_at || p.createdAt || now,
          reviewer: impStatus === 'PENDING' ? null : p.approval_reviewer || null,
          reviewedAt: impStatus === 'PENDING' ? null : p.approval_reviewed_at || null,
          note: '',
          history: [{ action: 'SUBMITTED', by: this.userName(), at: now, note: 'impor GeoJSON' }]
        },
        createdAt: p.createdAt || now,
        updatedAt: now
      });
    });
    if (additions.length) {
      const next = [...this.features, ...additions];
      this.featuresSubject.next(next);
      lsSet('features', next);
      this.logActivity('Impor GeoJSON (' + additions.length + ' objek)');
    }
    return additions.length;
  }

  /** Wipes every geomapping: key (ports the topbar user-menu "Setel ulang data lokal" action). */
  resetAllData(): void {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.indexOf(LS) === 0) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      /* private mode */
    }
  }
}
