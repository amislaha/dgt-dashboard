import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wpt } from '../models/wpt.model';
import { EntityRegistryService } from '../services/entity-registry.service';

/**
 * "Submission & Approval" — approval-only page. Submitting is no longer done here: every add/edit/
 * delete on any entity screen (including Wilayah) creates a PENDING Submission from that screen's own
 * drawer (EntityListComponent), and this page is where they're reviewed. Approving applies the
 * change to the entity (SubmissionService.review). The old "Pengajuan Data" tab and its form were
 * removed, along with the map draw tools that only that form used.
 *
 * Still shares the same `<dgt-wilayah-map>` as `WilayahComponent` (with its own `wpt` subscription,
 * duplicated rather than factored out) — it's how an old submission's `geometry` gets previewed, see
 * `MapDrawService.showPreview()`. `sidebarCollapsed` mirrors `WilayahComponent`'s own toggle.
 */
@Component({
  selector: 'dgt-submission-hub',
  templateUrl: './submission-hub.component.html',
  styleUrls: ['./submission-hub.component.scss']
})
export class SubmissionHubComponent implements OnDestroy {
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
