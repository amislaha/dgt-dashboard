import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Wpt } from '../../models/wpt.model';

function esc(s: any): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]);
}

/**
 * Real Leaflet + OpenStreetMap map for the "Wilayah" landing page (data-manager's default route) —
 * ports the same pattern as dashboard's KawasanMapComponent/geomapping's GeomappingMapComponent
 * (both already in this codebase), simplified down to plain point pins since a Wpt record has only
 * a `lat`/`lon` pair, not an area geometry. Records without both fields set are silently skipped
 * (see Wpt.lat/lon doc comment) rather than plotted at a fallback position.
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

  private map: L.Map | null = null;
  private markers: { [id: string]: L.CircleMarker } = {};

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
    this.plotMarkers();
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
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
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
      marker.on('click', () => this.select.emit(w));
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
