import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavItem } from '../../core/models/nav-item.model';
import { entityIconSvg } from '../config/entity-configs';
import { EntityKey, ENTITY_ORDER } from '../models/entity-key.model';
import { EntityRegistryService } from '../services/entity-registry.service';

/**
 * Routed wrapper around `<dgt-app-shell>` for the data-manager feature module
 * (see the port spec's "DataManagerShellComponent"). Builds the rail's
 * `NavItem[]` from the 8 entity configs (ports `renderRail()`'s per-entity
 * button + live entry-count badge from the original data-manager/index.html),
 * translates `(select)` into a child-route navigation, and derives the active
 * rail id from the current child route's `data.entityKey` instead of keeping
 * separate state — there is exactly one `state.tab`-equivalent, the router.
 */
@Component({
  selector: 'dgt-data-manager-shell',
  templateUrl: './data-manager-shell.component.html',
  styleUrls: ['./data-manager-shell.component.scss']
})
export class DataManagerShellComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];
  activeId: EntityKey | null = null;
  totalLabel = '0 entri tersimpan (lokal)';

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly registry: EntityRegistryService) {}

  ngOnInit(): void {
    const entries = ENTITY_ORDER.map(key => this.registry.get(key));

    this.subscriptions.push(
      combineLatest(entries.map(entry => entry.service.changes)).subscribe(lists => {
        this.navItems = entries.map((entry, i) => ({
          id: entry.config.key,
          label: entry.config.label,
          sub: `${lists[i].length} entri`,
          icon: entityIconSvg(entry.config.key)
        }));
        const total = lists.reduce((sum, list) => sum + list.length, 0);
        this.totalLabel = `${total} entri tersimpan (lokal)`;
      })
    );

    this.updateActiveId();
    this.subscriptions.push(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updateActiveId())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSelect(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  private updateActiveId(): void {
    let child = this.route.firstChild;
    while (child && child.firstChild) {
      child = child.firstChild;
    }
    this.activeId = (child && (child.snapshot.data.entityKey as EntityKey)) || null;
  }
}
