import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivityEntry } from '../../models/geomapping.model';
import { fmtWhen } from '../../services/geo-math';
import { GeomappingDataService } from '../../services/geomapping-data.service';

/** Ports `renderActivityPanel()` (geomapping/index.html:3150) — "Main Menu → Activity", PRD
 *  F-4.10/F-4.11. */
@Component({
  selector: 'dgt-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
  activity: ActivityEntry[] = [];
  clearArmed = false;

  private readonly subs: Subscription[] = [];

  constructor(readonly data: GeomappingDataService) {}

  ngOnInit(): void {
    this.subs.push(this.data.activity$.subscribe(a => (this.activity = a)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  fmtWhen(ts: number): string {
    return fmtWhen(ts);
  }

  onClearClick(): void {
    if (!this.clearArmed) {
      this.clearArmed = true;
      return;
    }
    this.data.clearActivity();
    this.clearArmed = false;
  }
}
