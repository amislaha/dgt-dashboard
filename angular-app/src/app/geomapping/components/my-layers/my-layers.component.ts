import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { geomappingSvg } from '../../config/icons';
import { APPROVAL_META, Classification, Compartment, GeomappingFeature, GeometryType } from '../../models/geomapping.model';
import { geomLabel, geomToLatLngs, fmtArea, fmtLen, lineLengthM, polygonAreaM2, LatLng } from '../../services/geo-math';
import { GeomappingDataService } from '../../services/geomapping-data.service';
import { GeomappingToastService } from '../../services/geomapping-toast.service';

interface FeatureRow {
  feature: GeomappingFeature;
  cls: Classification;
  meta: string;
  compartmentName: string | null;
  approvalLabel: string;
  approvalColor: string;
}

const GEOM_FILTERS: [string, string][] = [
  ['all', 'Semua'],
  ['Point', 'Titik'],
  ['LineString', 'Garis'],
  ['Polygon', 'Poligon']
];

/**
 * Ports `renderMyLayersPanel()` (geomapping/index.html:2865) — "Main Menu → My Layers", PRD
 * F-4.8/F-4.9 — plus the classification manager moved here from the removed Layers menu
 * (`classPanelHtml()`/`wireClassPanel()`).
 */
@Component({
  selector: 'dgt-my-layers',
  templateUrl: './my-layers.component.html',
  styleUrls: ['./my-layers.component.scss']
})
export class MyLayersComponent implements OnInit, OnDestroy {
  readonly geomFilters = GEOM_FILTERS;
  readonly iconChoices = ['pin', 'building', 'users', 'store', 'coins', 'bed', 'home', 'car', 'book', 'utensils', 'camera', 'heart', 'route', 'dome', 'landmark', 'target', 'bolt', 'layers', 'parcel', 'boundary', 'road', 'tag', 'shapes'];

  features: GeomappingFeature[] = [];
  classifications: Classification[] = [];
  activeCompartment: Compartment | null = null;
  hidden: { [id: string]: boolean } = {};

  scopeAll = false;
  geomFilter = 'all';
  filterText = '';

  newClsName = '';
  newClsColor = '#33809c';
  newClsIcon = 'pin';
  newClsDesc = '';

  @ViewChild('importInput', { static: true }) importInputRef?: ElementRef<HTMLInputElement>;

  private readonly subs: Subscription[] = [];

  constructor(readonly data: GeomappingDataService, private readonly toast: GeomappingToastService) {}

  ngOnInit(): void {
    this.subs.push(this.data.features$.subscribe(f => (this.features = f)));
    this.subs.push(this.data.classifications$.subscribe(c => (this.classifications = c)));
    this.subs.push(this.data.hidden$.subscribe(h => (this.hidden = h)));
    this.subs.push(this.data.activeCompartment$.subscribe(id => (this.activeCompartment = this.data.wcById(id))));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  get scoped(): boolean {
    return !!this.activeCompartment && !this.scopeAll;
  }

  get pool(): GeomappingFeature[] {
    return this.features.filter(f => {
      if (this.scoped && f.compartmentId !== this.activeCompartment!.id) {
        return false;
      }
      if (this.geomFilter !== 'all' && f.geometry.type !== this.geomFilter) {
        return false;
      }
      return true;
    });
  }

  get rows(): FeatureRow[] {
    const t = (this.filterText || '').toLowerCase();
    return this.pool
      .filter(f => !t || (f.title + ' ' + (f.address || '')).toLowerCase().indexOf(t) >= 0)
      .map(f => this.toRow(f));
  }

  private toRow(f: GeomappingFeature): FeatureRow {
    const cls = this.data.clsById(f.classificationId);
    const ll = geomToLatLngs(f.geometry);
    const wc = f.compartmentId ? this.data.wcById(f.compartmentId) : null;
    const am = APPROVAL_META[f.approval.status] || APPROVAL_META.PENDING;
    return {
      feature: f,
      cls,
      meta: this.metaFor(f, ll),
      compartmentName: wc ? wc.name : null,
      approvalLabel: am.label,
      approvalColor: am.color
    };
  }

  private metaFor(f: GeomappingFeature, ll: LatLng[]): string {
    if (f.geometry.type === 'Polygon') {
      return fmtArea(polygonAreaM2(ll));
    }
    if (f.geometry.type === 'LineString') {
      return fmtLen(lineLengthM(ll));
    }
    return ll.length ? ll[0].lat.toFixed(4) + ', ' + ll[0].lng.toFixed(4) : '';
  }

  geomLabel(t: GeometryType): string {
    return geomLabel(t);
  }

  iconSvg(name: string): string {
    return geomappingSvg(name);
  }

  toggleScope(): void {
    this.scopeAll = !this.scopeAll;
  }

  setGeomFilter(key: string): void {
    this.geomFilter = key;
  }

  deleteArmedId: string | null = null;
  armDelete(id: string, ev: Event): void {
    ev.stopPropagation();
    if (this.deleteArmedId !== id) {
      this.deleteArmedId = id;
      setTimeout(() => {
        if (this.deleteArmedId === id) {
          this.deleteArmedId = null;
        }
      }, 2600);
      return;
    }
    this.data.deleteFeature(id);
    this.deleteArmedId = null;
    this.toast.show('Objek dihapus', 'ok');
  }

  isHidden(clsId: string): boolean {
    return !!this.hidden[clsId];
  }
  classificationCount(clsId: string): number {
    return this.features.filter(f => f.classificationId === clsId).length;
  }
  toggleClassification(clsId: string, checked: boolean): void {
    this.data.setClassificationHidden(clsId, !checked);
  }
  addClassification(): void {
    const name = (this.newClsName || '').trim();
    if (!name) {
      this.toast.show('Nama wajib diisi', 'err');
      return;
    }
    this.data.addClassification(name, (this.newClsDesc || '').trim(), this.newClsColor, this.newClsIcon);
    this.newClsName = '';
    this.newClsDesc = '';
    this.newClsColor = '#33809c';
    this.newClsIcon = 'pin';
    this.toast.show('Klasifikasi ditambahkan', 'ok');
  }

  exportGeoJSON(): void {
    const fc = this.data.toGeoJSON();
    const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geomapping-' + new Date().toISOString().slice(0, 10) + '.geojson';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
    this.data.logActivity('Ekspor GeoJSON (' + this.features.length + ' objek)');
    this.toast.show('Diekspor: ' + this.features.length + ' objek', 'ok');
  }

  triggerImport(): void {
    if (this.importInputRef) {
      this.importInputRef.nativeElement.click();
    }
  }

  onImportFileChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const added = this.data.importGeoJSON(String(reader.result));
        this.toast.show('Diimpor: ' + added + ' objek', 'ok');
      } catch (e) {
        this.toast.show('Berkas GeoJSON tidak valid', 'err');
      }
    };
    reader.readAsText(file);
  }
}
