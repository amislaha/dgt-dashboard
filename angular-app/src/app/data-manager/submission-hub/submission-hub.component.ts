import { Component } from '@angular/core';

type SubmissionHubTab = 'pengajuan' | 'approval';

/**
 * "Submission & Approval" — the header nav's single top-level entry for what used to be two
 * separate rail items (Pengajuan Data, Approval — see PORT_NOTES.md's "Persetujuan & Pengajuan"
 * section). Combines them into one routed page with a tab switcher; `SubmissionComponent` and
 * `SubmissionApprovalComponent` are unchanged otherwise and neither depends on `ActivatedRoute`, so
 * embedding them here (instead of routing to each) needed no changes beyond moving their own
 * `dgt-page-head` toolbar controls into a plain `.dm-toolbar` div (this page owns the single
 * `dgt-page-head` now).
 */
@Component({
  selector: 'dgt-submission-hub',
  templateUrl: './submission-hub.component.html',
  styleUrls: ['./submission-hub.component.scss']
})
export class SubmissionHubComponent {
  tab: SubmissionHubTab = 'pengajuan';

  setTab(tab: SubmissionHubTab): void {
    this.tab = tab;
  }
}
