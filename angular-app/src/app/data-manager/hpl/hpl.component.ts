import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { Hpl } from '../models/hpl.model';
import { Wpt } from '../models/wpt.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { MapDrawService } from '../services/map-draw.service';

/**
 * "HPL" header page — HPL lokasi managed on their own, separate from kawasan, with the same layout
 * and tools as the Wilayah page: the shared WilayahMapComponent (areas, basemaps, measure, draw)
 * under a collapsible side panel holding the generic `<dgt-entity-list>` (search, sort, add/edit/
 * delete, geometry drawn on the map). Reuses wilayah.component.scss for the shell styles.
 *
 * The map is typed for Wpt, so each Hpl is handed to it in that shape (`nama` = nomor SK, the area
 * circle sized from `luas`); a click maps back to the Hpl and opens it in the list's inline editor.
 */
@Component({
  selector: 'dgt-hpl',
  templateUrl: './hpl.component.html',
  styleUrls: ['../wilayah/wilayah.component.scss']
})
export class HplComponent implements OnDestroy {
  @ViewChild(EntityListComponent, { static: true }) list!: EntityListComponent;

  hpl: Hpl[] = [];
  mapItems: Wpt[] = [];
  selectedId: string | null = null;
  sidebarCollapsed = false;
  drawing = false;

  private readonly sub: Subscription;
  private readonly drawSub: Subscription;

  constructor(registry: EntityRegistryService, mapDraw: MapDrawService) {
    this.sub = registry.get('hpl').service.changes.subscribe(list => {
      this.hpl = list as Hpl[];
      this.mapItems = this.hpl.map(h => ({
        id: h.id,
        nama: h.nomorSk,
        provinsi: h.provinsi,
        kabupaten: h.kabupaten,
        lat: h.lat,
        lon: h.lon,
        geometry: h.geometry,
        color: h.color,
        luasKawasanHa: h.luas
      }));
    });
    this.drawSub = mapDraw.drawType$.subscribe(type => (this.drawing = !!type));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.drawSub.unsubscribe();
  }

  onSelect(item: Wpt): void {
    const record = this.hpl.find(h => h.id === item.id);
    if (record) {
      this.selectedId = record.id;
      this.sidebarCollapsed = false;
      this.list.openEdit(record);
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
