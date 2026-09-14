import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavItem } from '../../../core/models/nav-item.model';

/**
 * Ports dashboard/index.html's `.rail`/`.rail-item` left module-nav — also
 * reused by data-manager/index.html's own `.rail`/`.rail-item`, which is
 * visually the same light-panel treatment with a different active-state
 * accent (see PORT_NOTES.md for the small per-app differences not chased
 * here). Styled as a light panel (`var(--card)`/`var(--text-dim)`, a
 * `var(--primary)` left-accent bar on the active item) matching BOTH
 * sources' own CSS — neither original tool's rail is dark-themed; this
 * component previously used the design-system's dark `--sidebar` tokens
 * instead, which don't match either source.
 *
 * Two independent collapse mechanisms exist in the original and are kept
 * distinct here rather than merged into one implementation:
 *  - Desktop full-collapse (`collapsed` input): rail goes to width:0, handing
 *    space back to `.main`. Toggled from outside this component (a button
 *    inside a 0-width container would vanish with it, same reasoning as the
 *    original) — dashboard/index.html's current source toggles this from a
 *    single floating `.rail-fab` button rather than a topbar, and starts
 *    collapsed by default (see `DashboardShellComponent`); data-manager's
 *    source instead keeps its own topbar-based toggle and starts expanded
 *    (see `AppShellComponent`/`TopbarComponent`) — both are faithful to
 *    their own current source, not a shared assumption.
 *  - Mobile off-canvas (`open` input, ≤760px): slide-in drawer with a scrim,
 *    unchanged and shared by both.
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
  /** Optional image logo for the rail head (dashboard's `assets/logo-emblem.png`) — omit to keep
   *  the plain text wordmark (data-manager's rail has no logo of its own; its emblem lives in its
   *  topbar instead, see DataManagerShellComponent). */
  @Input() logoSrc?: string;
  @Input() logoAlt = '';
  /** dashboard/index.html's rail group label is "Modul Eksekutif"; kept generic here since this
   *  component is shared. */
  @Input() groupLabel = 'Modul';
  @Output() select = new EventEmitter<string>();
  @Output() closeMobile = new EventEmitter<void>();

  onSelect(id: string): void {
    this.select.emit(id);
    this.closeMobile.emit();
  }
}
