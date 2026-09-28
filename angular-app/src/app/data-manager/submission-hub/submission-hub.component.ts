import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wpt } from '../models/wpt.model';
import { EntityRegistryService } from '../services/entity-registry.service';

type SubmissionHubTab = 'pengajuan' | 'approval';

/**
 * "Submission & Approval" — the header nav's single top-level entry for what used to be two
 * separate rail items (Pengajuan Data, Approval — see PORT_NOTES.md's "Persetujuan & Pengajuan"
 * section). Combines them into one routed page with a tab switcher; `SubmissionComponent` and
 * `SubmissionApprovalComponent` are unchanged otherwise and neither depends on `ActivatedRoute`, so
 * embedding them here (instead of routing to each) needed no changes beyond moving their own
 * `dgt-page-head` toolbar controls into a plain `.dm-toolbar` div (this page owns the single
 * `dgt-page-head` now).
 *
 * Shares the exact same `<dgt-wilayah-map>` as `WilayahComponent` (on request — "same map... only
 * the sidebar is different"), including its own `wpt` list subscription duplicated here rather than
 * factored into a shared parent — both are small, self-contained, and this keeps the two pages
 * independent (no new shared base class to reason about). The map is also how this page's manual
 * draw tools and Approval-tab geometry preview work — see `MapDrawService`.
 *
 * `sidebarCollapsed` mirrors `WilayahComponent`'s own toggle — same reasoning, same duplication.
 */
@Component({
  selector: 'dgt-submission-hub',
  templateUrl: './submission-hub.component.html',
  styleUrls: ['./submission-hub.component.scss']
})
export class SubmissionHubComponent implements OnDestroy {
  tab: SubmissionHubTab = 'pengajuan';
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

  setTab(tab: SubmissionHubTab): void {
    this.tab = tab;
  }

  onSelect(w: Wpt): void {
    this.selectedId = w.id;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
