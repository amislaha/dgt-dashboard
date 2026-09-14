import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BASEMAPS, BND_BBOX, BND_LEVELS, Classification, GeomappingFeature, Poi } from '../../models/geomapping.model';
import { geomToLatLngs, lineLengthM, polygonAreaM2, fmtArea, fmtLen } from '../../services/geo-math';

function esc(s: any): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);
}

/**
 * Ports geomapping/index.html's `map`/`tileLayer`/`featureLayer`/`poiLayer`/boundary-grid setup
 * (search `L.map("map"`) as a standalone child component — the same pattern as the dashboard
 * port's `KawasanMapComponent`. Read-only render only in this pass (Phase 1: Public Mapping/My
 * Layers) — drawing, GPS tracking, and click-to-edit are NOT ported yet (see the module's
 * PORT_NOTES.md); a feature click still emits `(selectFeature)` so a later phase can wire in
 * without touching this component again, but for now it just opens the same popup Leaflet would
 * show anyway.
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

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElRef.nativeElement, { zoomControl: false, attributionControl: true }).setView([-6.284, 106.826], 13);
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    // Drops the "Leaflet" prefix text before the tile attribution — `attributionControl` is a
    // real public property at runtime but missing from this project's @types/leaflet version.
    (this.map as any).attributionControl.setPrefix('');
    this.featureLayer.addTo(this.map);
    this.poiLayer.addTo(this.map);
    this.buildBoundaryGrid();

    this.applyBasemap();
    this.plotFeatures();
    this.plotPois();
    this.applyBoundary();
    setTimeout(() => this.invalidateSize(), 100);
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
}
