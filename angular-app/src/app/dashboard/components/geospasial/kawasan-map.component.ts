import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Kawasan, STAGE_COLOR_HEX, kawasanAreaLatLngs } from '../../services/dashboard-data.service';

/**
 * Real Leaflet + OpenStreetMap basemap for the Geospasial module — ports the
 * `renderDasar()` live-map branch of dashboard/index.html (search `L.map(`)
 * as a standalone child component. The CSP static-basemap fallback
 * (`renderDasarStatic()`) is still NOT ported here — it was specifically a
 * Claude-Artifact-preview workaround, irrelevant to a real deployment — but
 * the same static image now backs the separate locator inset (see
 * `GeospasialComponent`/`assets/basemap-indonesia.jpg`), which IS part of
 * the live UI regardless of Leaflet availability.
 *
 * Each kawasan is drawn as an actual irregular polygon area
 * (`kawasanAreaLatLngs()`), not a point marker — ports a later revision of
 * the original (see PORT_NOTES.md) that replaced single-point circle
 * markers so a kawasan reads as an area even before zooming in.
 */
@Component({
  selector: 'dgt-kawasan-map',
  templateUrl: './kawasan-map.component.html',
  styleUrls: ['./kawasan-map.component.scss']
})
export class KawasanMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() kawasan: Kawasan[] = [];
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<Kawasan>();

  @ViewChild('mapEl', { static: true }) mapElRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private areas: { [id: string]: L.Polygon } = {};

  ngAfterViewInit(): void {
    // zoomControl:false + a separate topright control (matching the original) frees up the
    // top-left corner for the layer catalogue, which GeospasialComponent overlays on top of us.
    this.map = L.map(this.mapElRef.nativeElement, {
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: false
    }).setView([-2.2, 118], 5);
    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.plotAreas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.kawasan) {
      this.plotAreas();
    }
    if (this.map && changes.selectedId && !changes.selectedId.firstChange) {
      this.panToSelected();
    }
  }

  /** Called by the parent after the map panel's own resize transition finishes (e.g. the
   *  "Perbesar panel peta" expand toggle) — mirrors the original's `activeLeafletMap.invalidateSize()`
   *  call, since Leaflet caches its container size and won't otherwise notice a CSS-driven resize. */
  invalidateSize(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  /** Called by the parent's layer-catalogue checkboxes — ports `wireLayerCatalog()`'s Leaflet
   *  branch (add/remove the polygon layer; there's no real "hide" concept on an `L.Polygon`). */
  setAreaVisible(id: string, visible: boolean): void {
    const area = this.areas[id];
    if (!this.map || !area) {
      return;
    }
    if (visible) {
      if (!this.map.hasLayer(area)) {
        area.addTo(this.map);
      }
    } else if (this.map.hasLayer(area)) {
      this.map.removeLayer(area);
    }
  }

  ngOnDestroy(): void {
    // mirrors the original's manual `activeLeafletMap.remove()` discipline on tab-switch/view-toggle
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private plotAreas(): void {
    if (!this.map) {
      return;
    }
    Object.keys(this.areas).forEach(id => this.map!.removeLayer(this.areas[id]));
    this.areas = {};

    this.kawasan.forEach(k => {
      const area = L.polygon(kawasanAreaLatLngs(k), {
        color: '#0a0f1c',
        weight: 1.3,
        opacity: 0.85,
        fillColor: STAGE_COLOR_HEX[k.tahap],
        fillOpacity: 0.42
      }).addTo(this.map!);
      area.bindPopup(
        `<b>${k.nama}</b><br/>${k.provinsi}<br/>Tahap: ${k.tahap}` +
          `<br/>Populasi: ${k.populasi.toLocaleString('id-ID')} jiwa` +
          `<br/>Luas HPL: ${k.hplHa.toLocaleString('id-ID')} ha`
      );
      area.on('click', () => this.select.emit(k));
      this.areas[k.id] = area;
    });

    // Fit to every kawasan's own coordinates instead of the fixed setView center/zoom above —
    // ports a later fix for SKP Salor (lon 140.4°, Papua) sitting permanently off-screen at the
    // old hand-picked view. Done after a tick so the container has a real, laid-out size to fit
    // against (mirrors the original's setTimeout(...,60)).
    if (this.kawasan.length) {
      setTimeout(() => {
        if (!this.map) {
          return;
        }
        const bounds = L.latLngBounds(this.kawasan.map(k => [k.lat, k.lon] as [number, number]));
        this.map.fitBounds(bounds, { padding: [22, 22] });
        Object.keys(this.areas).forEach(id => this.areas[id].redraw());
      }, 60);
    }
  }

  private panToSelected(): void {
    if (!this.map || !this.selectedId) {
      return;
    }
    const area = this.areas[this.selectedId];
    const k = this.kawasan.find(x => x.id === this.selectedId);
    if (area && k) {
      this.map.panTo([k.lat, k.lon]);
      area.openPopup();
    }
  }
}
