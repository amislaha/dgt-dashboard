import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavItem } from '../../core/models/nav-item.model';
import { entityIconSvg } from '../config/entity-configs';
import { APPROVAL_ICON_SVG, SUBMISSION_ICON_SVG } from '../config/submission-icons';
import { ENTITY_ORDER } from '../models/entity-key.model';
import { Submission } from '../models/submission.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { SubmissionService } from '../services/submission.service';

/**
 * Routed wrapper around `<dgt-app-shell>` for the data-manager feature module
 * (see the port spec's "DataManagerShellComponent"). Builds the rail's
 * `NavItem[]` from the 8 entity configs (ports `renderRail()`'s per-entity
 * button + live entry-count badge from the original data-manager/index.html),
 * plus a second "Persetujuan & Pengajuan" section (Pengajuan Data/Approval,
 * marked off with a `sectionLabel` divider — see RailNavComponent) that isn't
 * part of that CRUD tool's original spec. Translates `(select)` into a
 * child-route navigation, and derives the active rail id from the current
 * child route's `data.entityKey` (entities) or `data.navId` (the two
 * submission routes) instead of keeping separate state — there is exactly one
 * `state.tab`-equivalent, the router.
 */
@Component({
  selector: 'dgt-data-manager-shell',
  templateUrl: './data-manager-shell.component.html',
  styleUrls: ['./data-manager-shell.component.scss']
})
export class DataManagerShellComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];
  activeId: string | null = null;
  totalLabel = '0 entri tersimpan (lokal)';

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly registry: EntityRegistryService,
    private readonly submissions: SubmissionService
  ) {}

  ngOnInit(): void {
    const entries = ENTITY_ORDER.map(key => this.registry.get(key));

    this.subscriptions.push(
      combineLatest([...entries.map(entry => entry.service.changes), this.submissions.changes]).subscribe(results => {
        const lists = results.slice(0, entries.length) as any[][];
        const submissionList = results[entries.length] as Submission[];
        const pendingCount = submissionList.filter(s => s.status === 'PENDING').length;

        const entityItems: NavItem[] = entries.map((entry, i) => ({
          id: entry.config.key,
          label: entry.config.label,
          sub: `${lists[i].length} entri`,
          icon: entityIconSvg(entry.config.key)
        }));

        this.navItems = [
          ...entityItems,
          {
            id: 'pengajuan',
            label: 'Pengajuan Data',
            sub: `${submissionList.length} pengajuan`,
            icon: SUBMISSION_ICON_SVG,
            sectionLabel: 'Persetujuan & Pengajuan'
          },
          {
            id: 'approval',
            label: 'Approval',
            sub: pendingCount ? `${pendingCount} menunggu` : 'Tidak ada yang menunggu',
            icon: APPROVAL_ICON_SVG
          }
        ];

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
    this.activeId = (child && (child.snapshot.data.entityKey || child.snapshot.data.navId)) || null;
  }
}
