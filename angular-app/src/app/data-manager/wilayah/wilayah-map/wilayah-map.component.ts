import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { DrawGeometryType, DrawnGeometry } from '../../models/drawn-geometry.model';
import { Wpt } from '../../models/wpt.model';
import { MapDrawService } from '../../services/map-draw.service';

function esc(s: any): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);
}

const DRAW_COLOR = '#163b54';
const PREVIEW_COLOR = '#c65b7c';

/**
 * Real Leaflet + OpenStreetMap map, shared by the "Wilayah" and "Submission & Approval" pages (on
 * request — "same map... only the sidebar is different") — ports the same pattern as dashboard's
 * KawasanMapComponent/geomapping's GeomappingMapComponent (both already in this codebase),
 * simplified down to plain point pins since a Wpt record has only a `lat`/`lon` pair, not an area
 * geometry. Records without both fields set are silently skipped (see Wpt.lat/lon doc comment)
 * rather than plotted at a fallback position.
 *
 * Also owns the manual draw tools ("like geomapping") mediated through `MapDrawService`: a
 * dashed-preview click-to-place capture (mirrors geomapping's `refreshDrawPreview()`/`drawTemp`,
 * see that component's doc comment) for Point/LineString/Polygon, and a separate read-only preview
 * layer for viewing an already-submitted shape from the Approval tab. Wilayah's own pin-click
 * `(select)` behaviour is unaffected — the two features share the map instance but not any state.
 */
@Component({
  selector: 'dgt-wilayah-map',
  templateUrl: './wilayah-map.component.html',
  styleUrls: ['./wilayah-map.component.scss']
})
export class WilayahMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() wilayah: Wpt[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<Wpt>();

  @ViewChild('mapEl', { static: true }) mapElRef!: ElementRef<HTMLDivElement>;

  activeDrawType: DrawGeometryType | null = null;
  drawPoints: L.LatLng[] = [];

  private map: L.Map | null = null;
  private markers: { [id: string]: L.CircleMarker } = {};
  private readonly drawLayer = L.layerGroup();
  private readonly previewLayer = L.layerGroup();
  private readonly subs: Subscription[] = [];

  constructor(private readonly mapDraw: MapDrawService) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElRef.nativeElement, { scrollWheelZoom: false, attributionControl: false, zoomControl: false }).setView(
      [-2.2, 118],
      5
    );
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.drawLayer.addTo(this.map);
    this.previewLayer.addTo(this.map);
    this.plotMarkers();

    this.map.on('click', e => this.onMapClick((e as L.LeafletMouseEvent).latlng));
    this.map.on('dblclick', () => this.finishDraw());

    this.subs.push(this.mapDraw.drawType$.subscribe(type => this.onDrawTypeChange(type)));
    this.subs.push(this.mapDraw.preview$.subscribe(geometry => this.renderPreview(geometry)));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.wilayah) {
      this.plotMarkers();
    }
    if (this.map && changes.selectedId && !changes.selectedId.firstChange) {
      this.panToSelected();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  get drawHintText(): string {
    switch (this.activeDrawType) {
      case 'Point':
        return 'Klik pada peta untuk menandai titik.';
      case 'LineString':
        return 'Klik untuk menambah titik garis, lalu klik "Selesai".';
      case 'Polygon':
        return 'Klik untuk menambah titik area, lalu klik "Selesai".';
      default:
        return '';
    }
  }

  get canFinishDraw(): boolean {
    if (this.activeDrawType === 'Polygon') {
      return this.drawPoints.length >= 3;
    }
    if (this.activeDrawType === 'LineString') {
      return this.drawPoints.length >= 2;
    }
    return false;
  }

  cancelDraw(): void {
    this.mapDraw.cancel();
  }

  finishDraw(): void {
    if (!this.activeDrawType || this.activeDrawType === 'Point' || !this.canFinishDraw) {
      return;
    }
    const coords = this.drawPoints.map(p => [p.lng, p.lat]);
    const geometry: DrawnGeometry =
      this.activeDrawType === 'Polygon' ? { type: 'Polygon', coordinates: [[...coords, coords[0]]] } : { type: 'LineString', coordinates: coords };
    this.mapDraw.complete(geometry);
  }

  private onMapClick(latlng: L.LatLng): void {
    if (!this.activeDrawType) {
      return;
    }
    if (this.activeDrawType === 'Point') {
      this.mapDraw.complete({ type: 'Point', coordinates: [latlng.lng, latlng.lat] });
      return;
    }
    this.drawPoints.push(latlng);
    this.renderDrawPreview();
  }

  private onDrawTypeChange(type: DrawGeometryType | null): void {
    this.activeDrawType = type;
    this.drawPoints = [];
    this.drawLayer.clearLayers();
    if (!this.map) {
      return;
    }
    this.map.getContainer().style.cursor = type ? 'crosshair' : '';
    if (type) {
      this.map.doubleClickZoom.disable();
    } else {
      this.map.doubleClickZoom.enable();
    }
  }

  /** Ports the shape of geomapping's `refreshDrawPreview()`: a dashed line/polygon plus a small
   *  circle marker at each point placed so far. */
  private renderDrawPreview(): void {
    this.drawLayer.clearLayers();
    if (!this.drawPoints.length) {
      return;
    }
    const latlngs = this.drawPoints.map(p => [p.lat, p.lng] as [number, number]);
    const shape =
      this.activeDrawType === 'Polygon' && this.drawPoints.length >= 3
        ? L.polygon(latlngs, { color: DRAW_COLOR, weight: 2, dashArray: '4 4', fillOpacity: 0.08 })
        : L.polyline(latlngs, { color: DRAW_COLOR, weight: 2, dashArray: '4 4' });
    this.drawLayer.addLayer(shape);
    this.drawPoints.forEach(p => {
      this.drawLayer.addLayer(L.circleMarker([p.lat, p.lng], { radius: 4, color: DRAW_COLOR, weight: 2, fillColor: '#fff', fillOpacity: 1 }));
    });
  }

  private renderPreview(geometry: DrawnGeometry | null): void {
    this.previewLayer.clearLayers();
    if (!geometry || !this.map) {
      return;
    }
    if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates as [number, number];
      this.previewLayer.addLayer(L.circleMarker([lat, lng], { radius: 9, color: '#fff', weight: 2, fillColor: PREVIEW_COLOR, fillOpacity: 0.95 }));
      this.map.panTo([lat, lng]);
      return;
    }
    const ring: [number, number][] = geometry.type === 'Polygon' ? geometry.coordinates[0] : geometry.coordinates;
    const latlngs = ring.map((c: number[]) => [c[1], c[0]] as [number, number]);
    const shape =
      geometry.type === 'Polygon'
        ? L.polygon(latlngs, { color: PREVIEW_COLOR, weight: 3, fillColor: PREVIEW_COLOR, fillOpacity: 0.2 })
        : L.polyline(latlngs, { color: PREVIEW_COLOR, weight: 4 });
    this.previewLayer.addLayer(shape);
    this.map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 12 });
  }

  private get withCoords(): Wpt[] {
    return this.wilayah.filter(w => w.lat != null && w.lon != null);
  }

  private plotMarkers(): void {
    if (!this.map) {
      return;
    }
    Object.keys(this.markers).forEach(id => this.map!.removeLayer(this.markers[id]));
    this.markers = {};

    const pins = this.withCoords;
    pins.forEach(w => {
      const marker = L.circleMarker([w.lat as number, w.lon as number], {
        radius: 9,
        color: '#fff',
        weight: 2,
        fillColor: '#2c755b',
        fillOpacity: 0.9
      }).addTo(this.map!);
      marker.bindPopup(`<b>${esc(w.nama)}</b><br>${esc(w.provinsi)}, ${esc(w.kabupaten)}`);
      // stopPropagation so a pin click while drawing doesn't also register as a draw click — Leaflet
      // vector layers bubble clicks up to the map by default.
      marker.on('click', e => {
        L.DomEvent.stopPropagation(e as any);
        this.select.emit(w);
      });
      this.markers[w.id] = marker;
    });

    if (pins.length) {
      setTimeout(() => {
        if (!this.map) {
          return;
        }
        this.map.fitBounds(
          L.latLngBounds(pins.map(w => [w.lat as number, w.lon as number] as [number, number])),
          { padding: [30, 30], maxZoom: 6 }
        );
      }, 60);
    }
  }

  private panToSelected(): void {
    if (!this.map || !this.selectedId) {
      return;
    }
    const marker = this.markers[this.selectedId];
    const w = this.wilayah.find(x => x.id === this.selectedId);
    if (marker && w && w.lat != null && w.lon != null) {
      this.map.panTo([w.lat, w.lon]);
      marker.openPopup();
    }
  }
}
