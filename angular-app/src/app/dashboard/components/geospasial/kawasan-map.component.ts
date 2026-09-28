import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Kawasan, STAGE_COLOR_HEX, kawasanAreaLatLngs } from '../../services/dashboard-data.service';

/**
 * Real Leaflet + OpenStreetMap basemap for the Geospasial module — ports the
 * `renderDasar()` live-map branch of dashboard/index.html (search `L.map(`)
 * as a standalone child component. The CSP static-basemap fallback
 * (`renderDasarStatic()`) is still NOT ported here — it was specifically a
 * Claude-Artifact-preview workaround, irrelevant to a real deployment. The
 * "you are here" static-image locator inset that used to reuse this same
 * basemap snapshot (`assets/basemap-indonesia.jpg`) was dropped when
 * `GeospasialComponent` went full-bleed (see its own PORT_NOTES.md /
 * doc comment) — this map now fills the whole page, so a locator inset no
 * longer serves a purpose.
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
  /** Overrides the polygon fill colour per kawasan — defaults to STAGE_COLOR_HEX[k.tahap] (the
   *  Geospasial legality-status colouring). Ekonomi & Investasi Kawasan passes a wilayah-region
   *  colour function instead so the same map component can double as its Barat/Tengah/Timur view. */
  @Input() fillColorOf: (k: Kawasan) => string = k => STAGE_COLOR_HEX[k.tahap];
  /** Overrides the popup HTML per kawasan — defaults to the Geospasial tahap/populasi/HPL summary. */
  @Input() popupOf: (k: Kawasan) => string = k =>
    `<b>${k.nama}</b><br/>${k.provinsi}<br/>Tahap: ${k.tahap}` +
    `<br/>Populasi: ${k.populasi.toLocaleString('id-ID')} jiwa` +
    `<br/>Luas HPL: ${k.hplHa.toLocaleString('id-ID')} ha`;
  /** "Batas HPL" — a dashed, unfilled outline traced over the same fabricated
   *  kawasanAreaLatLngs() geometry as the status-coloured areas, so the legality boundary reads as
   *  its own toggleable layer (ports DGT.md's "land legality (HPL/SHM geospatial overlay)" module
   *  theme). Defaults off so components other than Geospasial that reuse this map (e.g. Ekonomi &
   *  Investasi Kawasan's wilayah-coloured map) aren't affected unless they opt in. */
  @Input() showHpl = false;
  /** Leaflet's own topright +/− control — on by default (unchanged behaviour for the Ekonomi &
   *  Investasi Kawasan module, which also uses this component). The redesigned Geospasial page sets
   *  this false and drives zoom from its own floating bottom toolbar instead, via `zoomIn()`/
   *  `zoomOut()`/`resetView()` below. */
  @Input() showZoomControl = true;
  @Output() select = new EventEmitter<Kawasan>();
  /** Fires once after the initial view is set, then again on every pan/zoom (Leaflet's 'moveend') —
   *  a plain object, not `L.LatLng`, so a consumer doesn't need its own Leaflet import just to read
   *  this. */
  @Output() viewChange = new EventEmitter<{ zoom: number; center: { lat: number; lng: number } }>();

  @ViewChild('mapEl', { static: true }) mapElRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private areas: { [id: string]: L.Polygon } = {};
  private hplLayer: L.LayerGroup | null = null;

  ngAfterViewInit(): void {
    // zoomControl:false + a separate topright control (matching the original) frees up the
    // top-left corner for the layer catalogue, which GeospasialComponent overlays on top of us.
    this.map = L.map(this.mapElRef.nativeElement, {
      scrollWheelZoom: false,
      attributionControl: false,
      zoomControl: false
    }).setView([-2.2, 118], 5);
    if (this.showZoomControl) {
      L.control.zoom({ position: 'topright' }).addTo(this.map);
    }
    L.control.attribution({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.plotAreas();

    this.map.on('moveend', () => this.emitView());
    this.emitView();

    // Leaflet reads its container's size once at construction and caches it — a CSS-driven layout
    // that isn't fully settled yet at this point (e.g. Geospasial's full-bleed negative-margin
    // trick, or Google Fonts still reflowing) leaves the container div at its final size but
    // Leaflet still painting tiles/panes for a smaller, stale one. Same invalidate-after-layout
    // safety net the old fullscreen toggle used, just run once unconditionally after creation
    // instead of only after a later resize transition.
    const invalidate = () => this.map && this.map.invalidateSize();
    requestAnimationFrame(() => requestAnimationFrame(invalidate));
    setTimeout(invalidate, 210);
    setTimeout(invalidate, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && changes.kawasan) {
      this.plotAreas();
    }
    if (this.map && changes.selectedId && !changes.selectedId.firstChange) {
      this.panToSelected();
    }
    if (this.map && changes.showHpl && !changes.showHpl.firstChange) {
      this.setHplVisible(this.showHpl);
    }
  }

  /** Called by the parent's "Batas HPL" catalogue checkbox — same add/remove-layer pattern as
   *  setAreaVisible(), just for the whole dashed-outline group at once. */
  setHplVisible(visible: boolean): void {
    if (!this.map || !this.hplLayer) {
      return;
    }
    if (visible) {
      if (!this.map.hasLayer(this.hplLayer)) {
        this.hplLayer.addTo(this.map);
      }
    } else if (this.map.hasLayer(this.hplLayer)) {
      this.map.removeLayer(this.hplLayer);
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

  /** Backs the Geospasial page's own floating bottom-toolbar zoom buttons (used instead of
   *  Leaflet's built-in control when `showZoomControl` is false). `animate: false` is deliberate,
   *  not a style choice: Leaflet's default animated zoom finalizes on a CSS `transitionend` from
   *  its internal pane transform, and something in this app's global CSS cascade makes that
   *  transition take several seconds to fire (or never, observed empirically — `getZoom()` stayed
   *  at the pre-click value for 2+ seconds after an animated `zoomIn()`/`setZoom()` before finally
   *  landing). The old topright Leaflet zoom control (Ekonomi's map, `showZoomControl` default true)
   *  still uses Leaflet's normal animated zoom and is unaffected by this change — only the
   *  Geospasial toolbar's own zoom buttons, which need to feel immediate against a live readout,
   *  are switched to the instant, non-animated path. */
  zoomIn(): void {
    if (this.map) {
      this.map.zoomIn(1, { animate: false });
    }
  }

  zoomOut(): void {
    if (this.map) {
      this.map.zoomOut(1, { animate: false });
    }
  }

  /** Re-fits the view to every plotted kawasan — same bounds calculation `plotAreas()` uses on
   *  load, callable again later from a "recenter" toolbar button. `animate: false` for the same
   *  reason as `zoomIn()`/`zoomOut()` above. */
  resetView(): void {
    if (!this.map || !this.kawasan.length) {
      return;
    }
    const bounds = L.latLngBounds(this.kawasan.map(k => [k.lat, k.lon] as [number, number]));
    this.map.fitBounds(bounds, { padding: [22, 22], animate: false });
  }

  getZoom(): number {
    return this.map ? this.map.getZoom() : 0;
  }

  private emitView(): void {
    if (!this.map) {
      return;
    }
    const center = this.map.getCenter();
    this.viewChange.emit({ zoom: this.map.getZoom(), center: { lat: center.lat, lng: center.lng } });
  }

  private plotAreas(): void {
    if (!this.map) {
      return;
    }
    Object.keys(this.areas).forEach(id => this.map!.removeLayer(this.areas[id]));
    this.areas = {};
    if (this.hplLayer) {
      this.map.removeLayer(this.hplLayer);
      this.hplLayer = null;
    }

    this.kawasan.forEach(k => {
      const area = L.polygon(kawasanAreaLatLngs(k), {
        color: '#0a0f1c',
        weight: 1.3,
        opacity: 0.85,
        fillColor: this.fillColorOf(k),
        fillOpacity: 0.42
      }).addTo(this.map!);
      area.bindPopup(this.popupOf(k));
      area.on('click', () => this.select.emit(k));
      this.areas[k.id] = area;
    });

    this.hplLayer = L.layerGroup(
      this.kawasan.map(k =>
        L.polygon(kawasanAreaLatLngs(k), {
          color: '#33809c', // var(--series-2)'s raw hex twin — Leaflet can't resolve CSS vars
          weight: 2,
          opacity: 0.9,
          dashArray: '5 4',
          fill: false,
          interactive: false
        })
      )
    );
    if (this.showHpl) {
      this.hplLayer.addTo(this.map);
    }

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
