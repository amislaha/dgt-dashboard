import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Hpl, hplNama } from '../../../data-manager/models/hpl.model';

export type HplSertStatus = 'penuh' | 'sebagian' | 'belum';

/** Raw hex from the design-system tokens (hijau-600 / warning / merah-500): Leaflet paths take
 *  colours as SVG attributes, which can't resolve CSS variables. */
export const HPL_SERT_HEX: { [key in HplSertStatus]: string } = { penuh: '#106d30', sebagian: '#e8981c', belum: '#ce1126' };
export const HPL_SERT_LABEL: { [key in HplSertStatus]: string } = { penuh: 'Bersertifikat penuh', sebagian: 'Bersertifikat sebagian', belum: 'Belum bersertifikat' };

export function hplSertStatus(h: Hpl): HplSertStatus {
  const luas = Number(h.luas) || 0;
  const ls = Math.min(Number(h.luasSertifikat) || 0, luas);
  return ls <= 0 ? 'belum' : luas > 0 && ls >= luas ? 'penuh' : 'sebagian';
}

const ESC: { [c: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v: unknown): string => String(v == null ? '' : v).replace(/[&<>"']/g, c => ESC[c]);
const ha = (v: number): string => v.toLocaleString('id-ID', { maximumFractionDigits: 0 }) + ' Ha';

/**
 * Map of HPL lokasi for the "HPL Transmigrasi" overview. One layer per record: its drawn polygon or
 * line when the Data Manager has one, otherwise a dot at its lat/lon sized by luas. Coloured by
 * certification status (none / partial / full). Re-fits to whatever records it is given, so it
 * follows the page's provinsi/kabupaten filter.
 */
@Component({
  selector: 'dgt-hpl-map',
  template: '<div #mapEl class="hpl-map"></div>',
  styles: [':host { display: block; } .hpl-map { height: 100%; min-height: 320px; border-radius: 10px; position: relative; z-index: 0; }']
})
export class HplMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() records: Hpl[] = [];
  @Input() basemap: 'street' | 'satelit' = 'street';

  @ViewChild('mapEl', { static: true }) mapElRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private baseLayer: L.TileLayer | null = null;
  private group: L.FeatureGroup | null = null;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElRef.nativeElement, { scrollWheelZoom: false, attributionControl: false }).setView([-2.2, 118], 5);
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);
    this.applyBasemap();
    this.plot();
    // Leaflet caches its container size at construction; re-measure once layout has settled.
    const invalidate = () => this.map && this.map.invalidateSize();
    requestAnimationFrame(() => requestAnimationFrame(invalidate));
    setTimeout(invalidate, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.basemap) {
      this.applyBasemap();
    }
    if (this.map && changes.records) {
      this.plot();
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
    if (this.baseLayer) {
      this.map.removeLayer(this.baseLayer);
    }
    this.baseLayer =
      this.basemap === 'satelit'
        ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri' })
        : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
          });
    this.baseLayer.addTo(this.map);
    this.baseLayer.bringToBack();
  }

  private plot(): void {
    if (!this.map) {
      return;
    }
    if (this.group) {
      this.map.removeLayer(this.group);
    }
    this.group = L.featureGroup();
    this.records.forEach(h => {
      const layer = this.layerOf(h);
      if (layer) {
        layer.bindPopup(this.popupOf(h), { maxWidth: 320, minWidth: 240 });
        layer.bindTooltip(esc(h.nama || hplNama(h)), { direction: 'top', offset: [0, -6] });
        this.group!.addLayer(layer);
      }
    });
    this.group.addTo(this.map);
    const bounds = this.group.getBounds();
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 11 });
    } else {
      this.map.setView([-2.2, 118], 5);
    }
  }

  private layerOf(h: Hpl): L.Path | null {
    const color = HPL_SERT_HEX[hplSertStatus(h)];
    const style: L.PathOptions = { color, weight: 2, opacity: 0.95, fillColor: color, fillOpacity: 0.35 };
    const g = h.geometry;
    if (g && g.type === 'Polygon') {
      return L.polygon((g.coordinates[0] as number[][]).map(c => [c[1], c[0]] as [number, number]), style);
    }
    if (g && g.type === 'LineString') {
      return L.polyline((g.coordinates as number[][]).map(c => [c[1], c[0]] as [number, number]), { ...style, weight: 3 });
    }
    const pin: [number, number] | null =
      g && g.type === 'Point' ? [g.coordinates[1] as number, g.coordinates[0] as number] : h.lat != null && h.lon != null ? [h.lat, h.lon] : null;
    if (!pin) {
      return null;
    }
    // Dot sized by luas (√ so a 6.000 Ha HPL isn't 40x a 150 Ha one): 5–14 px.
    const radius = 5 + Math.min(9, Math.sqrt(Number(h.luas) || 0) / 9);
    return L.circleMarker(pin, { ...style, radius, color: '#ffffff', weight: 1.5, fillOpacity: 0.85 });
  }

  private popupOf(h: Hpl): string {
    const luas = Number(h.luas) || 0;
    const ls = Math.min(Number(h.luasSertifikat) || 0, luas);
    const st = hplSertStatus(h);
    const row = (k: string, v: string) => `<tr><td style="color:#5b6b76;padding:2px 10px 2px 0">${k}</td><td style="font-weight:600">${v}</td></tr>`;
    return (
      `<div style="font:13px var(--font-sans, sans-serif)">` +
      `<div style="font-weight:700;font-size:14px;margin-bottom:2px">${esc(h.nama || hplNama(h))}</div>` +
      `<div style="color:#5b6b76;margin-bottom:6px">${esc(h.kabupaten)}, ${esc(h.provinsi)}</div>` +
      `<span style="display:inline-block;padding:1px 8px;border-radius:999px;color:#fff;background:${HPL_SERT_HEX[st]};font-size:11.5px;font-weight:600;margin-bottom:6px">${HPL_SERT_LABEL[st]}</span>` +
      `<table style="border-collapse:collapse">` +
      row('Luas HPL', ha(luas)) +
      row('Luas bersertifikat', ha(ls)) +
      row('Tahun SK', esc(h.tahunSk || '—')) +
      row('Generasi SK', esc(h.generasi || '—')) +
      row('Inventarisasi', esc(h.inventarisasi || '—')) +
      row('Prioritas', esc(h.prioritas || '—')) +
      `</table></div>`
    );
  }
}
