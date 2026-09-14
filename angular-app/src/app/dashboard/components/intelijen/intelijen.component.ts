import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardDataService, Kawasan, NationalKPI } from '../../services/dashboard-data.service';
import { EwsService } from '../../services/ews.service';

/**
 * Ports `renderIntelijen()` (dashboard/index.html:2165) — "Executive
 * Intelligence & AI". Its chat panel is `<dgt-chat-panel mode="full">`, the
 * SAME shared component as Geospasial's embedded mini chat (see
 * ChatPanelComponent doc comment) — both call AiMockService, but each keeps
 * its own local chat log.
 */
@Component({
  selector: 'dgt-intelijen',
  templateUrl: './intelijen.component.html',
  styleUrls: ['./intelijen.component.scss']
})
export class IntelijenComponent implements OnInit, OnDestroy {
  kawasan: Kawasan[] = [];
  nationalKPI!: NationalKPI;
  activeAlerts = 0;

  private ewsSub?: Subscription;

  constructor(private readonly data: DashboardDataService, private readonly ews: EwsService) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.nationalKPI = this.data.getNationalKPI();
    this.ewsSub = this.ews.alerts$.subscribe(() => (this.activeAlerts = this.ews.getActiveCount()));
  }

  ngOnDestroy(): void {
    if (this.ewsSub) {
      this.ewsSub.unsubscribe();
    }
  }

  get mandiriCount(): number {
    return this.kawasan.filter(k => k.tahap === 'Mandiri').length;
  }

  get hplRb(): string {
    return (this.nationalKPI.hplTotal / 1000).toFixed(1);
  }

  get shmRb(): string {
    return (this.nationalKPI.shmTotal / 1000).toFixed(1);
  }

  get shmPctOfHpl(): number {
    return Math.round((this.nationalKPI.shmTotal / this.nationalKPI.hplTotal) * 100);
  }
}
