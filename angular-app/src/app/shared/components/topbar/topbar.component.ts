import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Shell topbar. Hosts exactly one rail-toggle button at a time — mobile
 * off-canvas trigger under ≤760px, desktop full-collapse trigger above it —
 * mirroring the original `checkWidth()` behaviour so there's never a
 * redundant pair of toggle buttons. `isNarrow` is set by the shell component
 * from a `(window:resize)` listener.
 */
@Component({
  selector: 'dgt-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() brand = 'DGT';
  @Input() isNarrow = false;
  @Input() railCollapsed = false;
  @Input() railOpen = false;
  @Output() toggleRail = new EventEmitter<void>();
}
