import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wpt } from '../models/wpt.model';
import { EntityRegistryService } from '../services/entity-registry.service';

/**
 * "Wilayah" — the header nav's default/landing page (route: '', redirects here — see
 * data-manager-routing.module.ts), and the one place the WPT entity is reachable from the header
 * (it isn't in the "Data Master" dropdown — see entity-key.model.ts's MASTER_DATA_ORDER). Wraps a
 * map (WilayahMapComponent, plotting each Wpt's `lat`/`lon`) above the *same* `<dgt-entity-list>`
 * every other entity route uses.
 *
 * `<dgt-entity-list>` here is embedded, not routed to — it isn't behind its own `<router-outlet>`,
 * so its `ActivatedRoute` injection resolves to this component's own route, whose
 * `data: { entityKey: 'wpt' }` (see data-manager-routing.module.ts) is all it needs to bind to the
 * `wpt` entity, identical to how the 'wpt' route worked before this page existed.
 *
 * `sidebarCollapsed` (on request) just toggles the side panel's width to 0 — the map underneath is
 * already full-width regardless (the sidebar overlays it via `position:absolute`, it doesn't push
 * it via flex), so collapsing only ever reveals more of the same map, no resize/invalidateSize
 * dance needed.
 */
@Component({
  selector: 'dgt-wilayah',
  templateUrl: './wilayah.component.html',
  styleUrls: ['./wilayah.component.scss']
})
export class WilayahComponent implements OnDestroy {
  wilayah: Wpt[] = [];
  selectedId: string | null = null;
  sidebarCollapsed = false;

  private readonly sub: Subscription;

  constructor(private readonly registry: EntityRegistryService) {
    this.sub = this.registry.get('wpt').service.changes.subscribe(list => (this.wilayah = list as Wpt[]));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelect(w: Wpt): void {
    this.selectedId = w.id;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
