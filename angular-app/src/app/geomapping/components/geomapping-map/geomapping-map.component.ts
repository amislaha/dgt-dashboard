import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { BASEMAPS, BND_BBOX, BND_LEVELS, Classification, GeomappingFeature, GeometryType, Poi } from '../../models/geomapping.model';
import { DEFAULT_MAP_CENTER, LatLng, geomToLatLngs, lineLengthM, polygonAreaM2, fmtArea, fmtLen } from '../../services/geo-math';
import { EditingState, GeomappingEditService, LineTrackState, ShapeMode } from '../../services/geomapping-edit.service';

function esc(s: any): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);
}

function toLL(ll: L.LatLng): LatLng {
  return { lat: ll.lat, lng: ll.lng };
}

/**
 * Ports geomapping/index.html's `map`/`tileLayer`/`featureLayer`/`poiLayer`/boundary-grid setup
 * (search `L.map("map"`) as a standalone child component — the same pattern as the dashboard
 * port's `KawasanMapComponent`. A feature click emits `(selectFeature)`.
 *
 * Also owns everything Edit Mode draws on the map itself — the manual-draw preview (`drawTemp`/
 * point handles), the committed shape being edited (`editLayer`/vertex-move-addvertex-delete
 * handles), the GPS tracking-line preview, and the My Location balloon (`drawTemp`/`handleLayer`/
 * `editLayer`/`myLocMarker` in the source). It subscribes directly to `GeomappingEditService`
 * (injected, not threaded through `@Input`s from the shell — same reasoning as every routed panel
 * component injecting `GeomappingDataService` directly) since editing needs tight, frequent
 * two-way interaction with the live `L.Map` (map clicks, vertex drag) that doesn't fit the
 * shell's existing one-way `@Input` data flow. See `GeomappingEditService`'s own doc comment for
 * why vertex drags don't round-trip through the service's authoritative state on every tick.
 */
@Component({
  selector: 'dgt-geomapping-map',
  templateUrl: './geomapping-map.component.html',
  styleUrls: ['./geomapping-map.component.scss']
})
export class GeomappingMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() features: GeomappingFeature[] = [];
  @Input() classifications: Classification[] = [];
  @Input() poiList: Poi[] = [];
  @Input() poiVisible = false;
  @Input() boundary: { [key: string]: boolean } = {};
  @Input() basemap = 'kp_street';
  @Output() selectFeature = new EventEmitter<GeomappingFeature>();

  @ViewChild('mapEl', { static: true }) mapElRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private tileLayer: L.TileLayer | null = null;
  private readonly featureLayer = L.layerGroup();
  private readonly poiLayer = L.layerGroup();
  private readonly boundaryGroups: { [key: string]: L.LayerGroup } = {};

  // ---- Edit Mode layers (ports drawTemp/handleLayer/editLayer/myLocMarker) ----
  private readonly handleLayer = L.layerGroup();
  private drawTemp: L.Polyline | L.Polygon | null = null;
  private editLayer: L.Layer | null = null;
  private myLocMarker: L.Marker | null = null;
  /** Handle markers for the shape currently being edited, indexed like `editing.latlngs` — kept
   *  so a 'move'-mode drag can reposition sibling handles live without a full rebuild. */
  private vertexMarkers: L.Marker[] = [];
  private readonly editSubs: Subscription[] = [];

  constructor(private readonly editService: GeomappingEditService) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElRef.nativeElement, { zoomControl: false, attributionControl: true }).setView(
      [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      13
    );
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    // Drops the "Leaflet" prefix text before the tile attribution — `attributionControl` is a
    // real public property at runtime but missing from this project's @types/leaflet version.
    (this.map as any).attributionControl.setPrefix('');
    this.featureLayer.addTo(this.map);
    this.poiLayer.addTo(this.map);
    this.handleLayer.addTo(this.map);
    this.buildBoundaryGrid();

    this.applyBasemap();
    this.plotFeatures();
    this.plotPois();
    this.applyBoundary();
    setTimeout(() => this.invalidateSize(), 100);

    // ports `map.on("click", ...)`/`map.on("dblclick", ...)` (index.html:1826-1830) — routes to
    // whichever of manual-draw/line-track is active, a no-op otherwise.
    this.map.on('click', e => this.editService.mapClick(toLL((e as L.LeafletMouseEvent).latlng)));
    this.map.on('dblclick', () => this.editService.mapDblClick());

    this.editSubs.push(this.editService.drawType$.subscribe(t => this.onDrawTypeChange(t)));
    this.editSubs.push(this.editService.editing$.subscribe(e => this.onEditingChange(e)));
    this.editSubs.push(this.editService.shapeMode$.subscribe(() => this.onShapeModeChange()));
    this.editSubs.push(this.editService.lineTrack$.subscribe(lt => this.onLineTrackChange(lt)));
    this.editSubs.push(this.editService.myLoc$.subscribe(() => this.renderMyLocMarker()));
    this.editSubs.push(this.editService.myLocAcc$.subscribe(() => this.renderMyLocMarker()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }
    if (changes.basemap) {
      this.applyBasemap();
    }
    if (changes.features || changes.classifications) {
      this.plotFeatures();
    }
    if (changes.poiList || changes.poiVisible) {
      this.plotPois();
    }
    if (changes.boundary) {
      this.applyBoundary();
    }
  }

  invalidateSize(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  ngOnDestroy(): void {
    this.editSubs.forEach(s => s.unsubscribe());
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private applyBasemap(): void {
    if (!this.map) {
      return;
    }
    const def = BASEMAPS[this.basemap] || BASEMAPS.kp_street;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }
    this.tileLayer = L.tileLayer(def.url, def.options as L.TileLayerOptions).addTo(this.map);
    this.tileLayer.bringToBack();
  }

  private clsById(id: string): Classification {
    return this.classifications.find(c => c.id === id) || { id: '', name: '', desc: '', color: '#7c8a94', icon: 'layers' };
  }

  private plotFeatures(): void {
    this.featureLayer.clearLayers();
    this.features.forEach(f => {
      const cls = this.clsById(f.classificationId);
      const ll = geomToLatLngs(f.geometry);
      if (!ll.length) {
        return;
      }
      let lyr: L.Layer;
      if (f.geometry.type === 'Point') {
        lyr = L.circleMarker([ll[0].lat, ll[0].lng], { radius: 7, color: '#fff', weight: 2, fillColor: cls.color, fillOpacity: 1 });
      } else if (f.geometry.type === 'LineString') {
        lyr = L.polyline(
          ll.map(p => [p.lat, p.lng] as [number, number]),
          { color: cls.color, weight: 4 }
        );
      } else {
        lyr = L.polygon(
          ll.map(p => [p.lat, p.lng] as [number, number]),
          { color: cls.color, weight: 3, fillColor: cls.color, fillOpacity: 0.18 }
        );
      }
      const extra =
        f.geometry.type === 'Polygon'
          ? '<br>Luas: ' + fmtArea(polygonAreaM2(ll))
          : f.geometry.type === 'LineString'
          ? '<br>Panjang: ' + fmtLen(lineLengthM(ll))
          : '';
      lyr.bindPopup(`<b>${esc(f.title)}</b><br>${esc(cls.name)}${extra}`);
      lyr.on('click', () => this.selectFeature.emit(f));
      this.featureLayer.addLayer(lyr);
    });
  }

  private plotPois(): void {
    this.poiLayer.clearLayers();
    if (!this.poiVisible) {
      return;
    }
    this.poiList.forEach(p => {
      L.circleMarker([p.lat, p.lng], { radius: 5, color: '#fff', weight: 1.5, fillColor: '#c9974a', fillOpacity: 1 })
        .bindPopup(`<b>${esc(p.name)}</b><br>POI · ${esc(p.kind)}`)
        .addTo(this.poiLayer);
    });
  }

  /** Illustrative fabricated grid, not real administrative polygons — see BND_LEVELS doc comment. */
  private buildBoundaryGrid(): void {
    BND_LEVELS.forEach(lv => {
      const g = L.layerGroup();
      const latStep = (BND_BBOX.n - BND_BBOX.s) / lv.div;
      const lngStep = (BND_BBOX.e - BND_BBOX.w) / lv.div;
      for (let r = 0; r < lv.div; r++) {
        for (let c = 0; c < lv.div; c++) {
          const s = BND_BBOX.s + r * latStep;
          const w = BND_BBOX.w + c * lngStep;
          L.rectangle(
            [
              [s, w],
              [s + latStep, w + lngStep]
            ],
            { color: lv.color, weight: lv.weight, fill: false, dashArray: '5 4', interactive: false }
          ).addTo(g);
        }
      }
      this.boundaryGroups[lv.key] = g;
    });
  }

  private applyBoundary(): void {
    if (!this.map) {
      return;
    }
    BND_LEVELS.forEach(lv => {
      const on = !!this.boundary[lv.key];
      const g = this.boundaryGroups[lv.key];
      if (on && !this.map!.hasLayer(g)) {
        g.addTo(this.map!);
      }
      if (!on && this.map!.hasLayer(g)) {
        this.map!.removeLayer(g);
      }
    });
  }

  private styleFor(cls: Classification): L.PathOptions {
    return { color: cls.color, weight: 3, fillColor: cls.color, fillOpacity: 0.18 };
  }

  // ==================================================================
  // Edit Mode — manual drawing, GPS tracking, shape editing
  // ==================================================================

  private onDrawTypeChange(t: GeometryType | null): void {
    if (!this.map) {
      return;
    }
    this.map.getContainer().style.cursor = t ? 'crosshair' : '';
    if (t) {
      this.map.doubleClickZoom.disable();
    } else {
      this.map.doubleClickZoom.enable();
    }
  }

  /** Ports `refreshDrawPreview()` (index.html:1514-1528): the dashed preview line/polygon plus a
   *  small circle marker at each point already placed, while a manual draw is in progress. */
  private renderDrawPreview(e: EditingState): void {
    if (this.drawTemp) {
      this.map!.removeLayer(this.drawTemp);
      this.drawTemp = null;
    }
    this.handleLayer.clearLayers();
    if (!e.latlngs.length) {
      return;
    }
    const pts = e.latlngs.map(p => [p.lat, p.lng] as [number, number]);
    this.drawTemp =
      e.type === 'Polygon' && e.latlngs.length >= 3
        ? L.polygon(pts, { color: '#163b54', weight: 2, dashArray: '4 4', fillOpacity: 0.08 })
        : L.polyline(pts, { color: '#163b54', weight: 2, dashArray: '4 4' });
    this.drawTemp.addTo(this.map!);
    e.latlngs.forEach(p => {
      L.marker([p.lat, p.lng], { icon: L.divIcon({ className: 'vhandle', iconSize: [11, 11] }), interactive: false }).addTo(this.handleLayer);
    });
  }

  /** Dispatches whenever `editing$` changes — ports the combined effect of `mountEditShape()`,
   *  `renderHandles()`, `cancelEditing()`'s cleanup, and (for a still-in-progress manual draw,
   *  `feature === null`) `refreshDrawPreview()`. */
  private onEditingChange(e: EditingState | null): void {
    if (!this.map) {
      return;
    }
    if (this.drawTemp) {
      this.map.removeLayer(this.drawTemp);
      this.drawTemp = null;
    }
    if (this.editLayer) {
      this.map.removeLayer(this.editLayer);
      this.editLayer = null;
    }
    this.handleLayer.clearLayers();
    this.vertexMarkers = [];
    if (!e) {
      return;
    }
    if (!e.feature) {
      this.renderDrawPreview(e);
      return;
    }
    this.mountEditShape(e);
    this.renderHandles(e);
    // Ports `zoomToFeature()` (index.html:2003-2007), folded into this subscription rather than
    // left for each call site (My Layers row, Approval's "buka editor" link) to trigger
    // separately: opening an *existing* feature pans/zooms to it; a just-finished manual
    // draw/tracking capture is already on-screen, so `isNew` skips the redundant camera move.
    if (!e.isNew) {
      if (e.type === 'Point') {
        this.map!.flyTo([e.latlngs[0].lat, e.latlngs[0].lng], Math.max(this.map!.getZoom(), 16));
      } else {
        this.map!.flyToBounds(
          L.latLngBounds(e.latlngs.map(p => [p.lat, p.lng] as [number, number])),
          { padding: [60, 60], maxZoom: 16 }
        );
      }
    }
  }

  private onShapeModeChange(): void {
    const e = this.editService.editing;
    if (e && e.feature) {
      this.renderHandles(e);
    }
  }

  /** Ports `mountEditShape()` (index.html:1729-1746): the shape actually being edited (as opposed
   *  to `drawTemp`'s dashed in-progress preview) — a draggable marker for a Point, a styled
   *  polyline/polygon otherwise. */
  private mountEditShape(e: EditingState): void {
    const cls = this.clsById((e.feature && e.feature.classificationId) || '');
    if (e.type === 'Point') {
      const m = L.marker([e.latlngs[0].lat, e.latlngs[0].lng], {
        draggable: true,
        icon: L.divIcon({ className: 'vhandle', iconSize: [16, 16] })
      });
      m.on('drag', ev => this.editService.setLiveLatLngs([toLL((ev.target as L.Marker).getLatLng())]));
      m.on('dragend', ev => this.editService.commitVertices([toLL((ev.target as L.Marker).getLatLng())]));
      m.addTo(this.map!);
      this.editLayer = m;
    } else if (e.type === 'LineString') {
      this.editLayer = L.polyline(
        e.latlngs.map(p => [p.lat, p.lng] as [number, number]),
        { color: cls.color, weight: 4 }
      ).addTo(this.map!);
    } else {
      this.editLayer = L.polygon(
        e.latlngs.map(p => [p.lat, p.lng] as [number, number]),
        this.styleFor(cls)
      ).addTo(this.map!);
    }
  }

  /** Ports `renderHandles()` (index.html:1747-1800) — per-vertex drag/dragend/click handlers for
   *  the 'vertex'/'move'/'addvertex'/'delete' shape-tool modes, plus the "addvertex" midpoint
   *  markers. See `GeomappingEditService`'s doc comment for why drag ticks update the layer
   *  directly (and sibling handles in 'move' mode) instead of round-tripping through `editing$`. */
  private renderHandles(e: EditingState): void {
    this.handleLayer.clearLayers();
    this.vertexMarkers = [];
    if (e.type === 'Point') {
      return;
    }
    const mode: ShapeMode = this.editService.shapeMode;
    let latlngs = e.latlngs.slice();
    const markers: L.Marker[] = [];
    latlngs.forEach((p, i) => {
      const cn = 'vhandle' + (mode === 'delete' ? ' del' : '');
      const m = L.marker([p.lat, p.lng], {
        draggable: mode === 'vertex' || mode === 'move',
        icon: L.divIcon({ className: cn, iconSize: [14, 14] })
      });
      m.on('drag', ev => {
        const np = toLL((ev.target as L.Marker).getLatLng());
        if (mode === 'move') {
          const dLat = np.lat - latlngs[i].lat;
          const dLng = np.lng - latlngs[i].lng;
          latlngs = latlngs.map(q => ({ lat: q.lat + dLat, lng: q.lng + dLng }));
          markers.forEach((mk, idx) => {
            if (idx !== i) {
              mk.setLatLng([latlngs[idx].lat, latlngs[idx].lng]);
            }
          });
        } else {
          latlngs = latlngs.slice();
          latlngs[i] = np;
        }
        (this.editLayer as L.Polyline).setLatLngs(latlngs.map(q => [q.lat, q.lng]));
        this.editService.setLiveLatLngs(latlngs);
      });
      m.on('dragend', () => this.editService.commitVertices(latlngs));
      m.on('click', ev => {
        L.DomEvent.stopPropagation(ev as any);
        if (mode !== 'delete') {
          return;
        }
        this.editService.deleteVertexAt(i);
      });
      markers.push(m);
      this.handleLayer.addLayer(m);
    });
    this.vertexMarkers = markers;

    if (mode === 'addvertex') {
      const n = latlngs.length;
      const segs = e.type === 'Polygon' ? n : n - 1;
      for (let s = 0; s < segs; s++) {
        const a = latlngs[s];
        const b = latlngs[(s + 1) % n];
        const mid: LatLng = { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
        const m = L.marker([mid.lat, mid.lng], { icon: L.divIcon({ className: 'vhandle mid', iconSize: [12, 12] }) });
        const idx = s;
        m.on('click', ev => {
          L.DomEvent.stopPropagation(ev as any);
          this.editService.insertVertexAfter(idx, mid);
        });
        this.handleLayer.addLayer(m);
      }
    }
  }

  /** Ports `drawLineTrack()` (index.html:1665-1685): the live Tracking Line/Polygon preview — the
   *  start point as a blue "My Location" balloon, subsequent points as small handle markers,
   *  neither draggable (track points are only appended/undone, not dragged). */
  private onLineTrackChange(lt: LineTrackState | null): void {
    if (!this.map) {
      return;
    }
    if (this.drawTemp) {
      this.map.removeLayer(this.drawTemp);
      this.drawTemp = null;
    }
    this.handleLayer.clearLayers();
    if (!lt) {
      return;
    }
    const pts = lt.pts.map(p => [p.lat, p.lng] as [number, number]);
    if (lt.kind === 'Polygon' && pts.length >= 3) {
      this.drawTemp = L.polygon(pts, { color: '#2563eb', weight: 3, dashArray: '5 4', fillOpacity: 0.08 });
    } else if (pts.length >= 2) {
      this.drawTemp = L.polyline(pts, { color: '#2563eb', weight: 3, dashArray: '5 4' });
    }
    if (this.drawTemp) {
      this.drawTemp.addTo(this.map);
    }
    lt.pts.forEach((p, i) => {
      const icon =
        i === 0
          ? L.divIcon({ className: 'myloc-balloon', html: '<i></i>', iconSize: [18, 18], iconAnchor: [9, 18] })
          : L.divIcon({ className: 'vhandle', iconSize: [12, 12] });
      L.marker([p.lat, p.lng], { icon, interactive: false }).addTo(this.handleLayer);
    });
  }

  /** Ports `setMyLoc()`'s marker half (index.html:1560-1569). */
  private renderMyLocMarker(): void {
    if (!this.map) {
      return;
    }
    const ll = this.editService.myLoc;
    if (this.myLocMarker) {
      this.map.removeLayer(this.myLocMarker);
      this.myLocMarker = null;
    }
    if (!ll) {
      return;
    }
    const acc = this.editService.myLocAcc;
    this.myLocMarker = L.marker([ll.lat, ll.lng], {
      icon: L.divIcon({ className: 'myloc-balloon', html: '<i></i>', iconSize: [18, 18], iconAnchor: [9, 18] }),
      zIndexOffset: 500,
      interactive: true
    })
      .addTo(this.map)
      .bindPopup('Posisi My Location (GPS)' + (acc ? '<br>akurasi &plusmn;' + Math.round(acc) + ' m' : ''));
  }
}
