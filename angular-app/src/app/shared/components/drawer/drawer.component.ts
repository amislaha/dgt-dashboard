import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Shared `.drawer` panel — used by data-manager's edit/create forms
 * (`.drawer-head`/`.drawer-body`/`.drawer-foot`) and dashboard's "Detail
 * Kawasan" style side panels. Built once here instead of the copy-pasted
 * per-tool version in the original prototype.
 *
 * `scrim` (default true, unchanged everywhere else) covers the *entire*
 * viewport (`position:fixed; inset:0`), not just the area behind the panel —
 * click-to-close-on-outside-click depends on that. `SubmissionComponent`
 * passes `[scrim]="false"` because its drawer sits beside the shared
 * Wilayah/Submission map (not behind it): with the default scrim in place, a
 * click meant to place a draw point on that map was instead swallowed by the
 * (visually near-invisible) full-viewport scrim and closed the drawer. With
 * `scrim` off, the backdrop is skipped entirely — the panel itself still
 * opens/closes normally via its own "✕"/footer buttons, just without a
 * darkened background or an outside-click-to-close gesture.
 */
@Component({
  selector: 'dgt-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() scrim = true;
  @Output() closed = new EventEmitter<void>();

  onScrimClick(): void {
    this.closed.emit();
  }
}
