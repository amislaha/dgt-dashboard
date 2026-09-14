import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Kawasan, STAGE_COLOR_HEX } from '../../services/dashboard-data.service';

/**
 * Real Leaflet + OpenStreetMap basemap for the Geospasial module — ports the
 * `renderDasar()` live-map branch of dashboard/index.html (search `L.map(`)
 * as a standalone child component. Per the port spec, the CSP static-basemap
 * fallback (`renderDasarStatic()`/`BASEMAP_STATIC_SRC`) is NOT ported — that
 * was specifically a Claude-Artifact-preview workaround, irrelevant here.
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
  private markers: { [id: string]: L.CircleMarker } = {};

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElRef.nativeElement, {
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true
    }).setView([-2.2, 118], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.plotMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.kawasan) {
      this.plotMarkers();
    }
    if (this.map && changes.selectedId && !changes.selectedId.firstChange) {
      this.highlightSelected();
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

  ngOnDestroy(): void {
    // mirrors the original's manual `activeLeafletMap.remove()` discipline on tab-switch/view-toggle
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private plotMarkers(): void {
    if (!this.map) {
      return;
    }
    Object.keys(this.markers).forEach(id => this.map!.removeLayer(this.markers[id]));
    this.markers = {};

    this.kawasan.forEach(k => {
      const marker = L.circleMarker([k.lat, k.lon], {
        radius: 9,
        color: '#ffffff',
        weight: 1.5,
        fillColor: STAGE_COLOR_HEX[k.tahap],
        fillOpacity: 0.9
      }).addTo(this.map!);
      marker.bindPopup(`<b>${k.nama}</b><br>${k.provinsi}<br>Indeks 5T: ${k.indeks5t}`);
      marker.on('click', () => this.select.emit(k));
      this.markers[k.id] = marker;
    });

    this.highlightSelected();
  }

  private highlightSelected(): void {
    Object.keys(this.markers).forEach(id => {
      this.markers[id].setStyle({ weight: id === this.selectedId ? 3 : 1.5 });
      if (id === this.selectedId) {
        this.markers[id].bringToFront();
      }
    });
  }
}
