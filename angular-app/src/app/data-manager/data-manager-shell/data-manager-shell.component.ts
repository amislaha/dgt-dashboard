import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { ENTITY_ORDER, MASTER_DATA_ORDER, SETTINGS_ORDER } from '../models/entity-key.model';
import { Submission } from '../models/submission.model';
import { getOperator, setOperator } from '../services/entity-crud.service';
import { EntityRegistryService } from '../services/entity-registry.service';
import { SubmissionService } from '../services/submission.service';

export interface HeaderNavItem {
  id: string;
  label: string;
  sub?: string;
}

/**
 * Routed shell for the data-manager feature module — a top HEADER bar (brand + "Wilayah" +
 * "Submission & Approval" as flat links, "Data Master"/"Settings" as `ngbDropdown` menus) over a
 * `<router-outlet>`, replacing the earlier `<dgt-app-shell>` (rail sidebar + topbar) layout on
 * request (see PORT_NOTES.md). No longer builds a `NavItem[]`/rail at all — `RailNavComponent` and
 * `AppShellComponent` are untouched and still used by the dashboard module, just not by this one
 * any more.
 *
 * `activeId` is still derived from the current child route's data — `data.navId` (the two
 * non-entity destinations, "wilayah" and "submission") takes priority over `data.entityKey` (every
 * plain `EntityListComponent` route, including `wilayah`'s own embedded one, which sets both — see
 * data-manager-routing.module.ts) so the header highlights "Wilayah", not the `wpt` entity key that
 * happens to back it.
 */
@Component({
  selector: 'dgt-data-manager-shell',
  templateUrl: './data-manager-shell.component.html',
  styleUrls: ['./data-manager-shell.component.scss']
})
export class DataManagerShellComponent implements OnInit, OnDestroy {
  activeId: string | null = null;
  totalLabel = '0 entri tersimpan (lokal)';
  masterItems: HeaderNavItem[] = [];
  settingsItems: HeaderNavItem[] = [];
  operatorName = getOperator();
  wilayahSub = '0 wilayah';
  submissionSub = '0 pengajuan';

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly registry: EntityRegistryService,
    private readonly submissions: SubmissionService
  ) {}

  ngOnInit(): void {
    const allEntries = ENTITY_ORDER.map(key => this.registry.get(key));

    this.subscriptions.push(
      combineLatest([...allEntries.map(entry => entry.service.changes), this.submissions.changes]).subscribe(results => {
        const lists = results.slice(0, allEntries.length) as any[][];
        const submissionList = results[allEntries.length] as Submission[];

        const countByKey: { [key: string]: number } = {};
        ENTITY_ORDER.forEach((key, i) => (countByKey[key] = lists[i].length));

        this.masterItems = MASTER_DATA_ORDER.map(key => ({ id: key, label: ENTITY_CONFIGS[key].label, sub: `${countByKey[key]} entri` }));
        this.settingsItems = SETTINGS_ORDER.map(key => ({ id: key, label: ENTITY_CONFIGS[key].label, sub: `${countByKey[key]} entri` }));
        this.wilayahSub = `${countByKey.wpt} wilayah`;

        const pendingCount = submissionList.filter(s => s.status === 'PENDING').length;
        this.submissionSub = pendingCount ? `${pendingCount} menunggu` : `${submissionList.length} pengajuan`;

        const total = ENTITY_ORDER.reduce((sum, key) => sum + countByKey[key], 0);
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

  onOperatorChange(name: string): void {
    this.operatorName = name;
    setOperator(name);
  }

  onSelect(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  private updateActiveId(): void {
    let child = this.route.firstChild;
    while (child && child.firstChild) {
      child = child.firstChild;
    }
    this.activeId = (child && (child.snapshot.data.navId || child.snapshot.data.entityKey)) || null;
  }
}
