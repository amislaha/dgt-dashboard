import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from '../../../core/models/nav-item.model';

/**
 * Ports dashboard/index.html's `.rail`/`.rail-item` left module-nav.
 *
 * Two independent collapse mechanisms exist in the original and are kept
 * distinct here rather than merged into one implementation:
 *  - Desktop full-collapse (`collapsed` input): rail goes to width:0, handing
 *    space back to `.main`. Toggled from the parent shell's topbar button
 *    (not from inside this component — a button inside a 0-width container
 *    would vanish with it, same reasoning as the original).
 *  - Mobile off-canvas (`open` input, ≤760px): slide-in drawer with a scrim.
 *    The parent shell shows exactly one toggle button at a time depending on
 *    viewport width, matching the original `checkWidth()` behaviour.
 */
@Component({
  selector: 'dgt-rail-nav',
  templateUrl: './rail-nav.component.html',
  styleUrls: ['./rail-nav.component.scss']
})
export class RailNavComponent {
  @Input() items: NavItem[] = [];
  @Input() activeId: string | null = null;
  @Input() collapsed = false;
  @Input() open = false;
  @Input() backLabel = 'Kembali ke Beranda';
  @Output() select = new EventEmitter<string>();
  @Output() closeMobile = new EventEmitter<void>();

  onSelect(id: string): void {
    this.select.emit(id);
    this.closeMobile.emit();
  }
}
