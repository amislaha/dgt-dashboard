import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NavItem } from '../core/models/nav-item.model';

/**
 * Generic app shell: rail nav (left) + topbar + content area. Originally
 * shared by both the dashboard and data-manager feature modules; dashboard
 * has since moved to its own bespoke shell (`DashboardShellComponent`) that
 * matches its CURRENT source (no topbar at all, one floating rail-fab
 * toggle, rail collapsed by default — see that component's doc comment).
 * data-manager/index.html is unchanged and still topbar-based, so
 * `DataManagerShellComponent` keeps using this one as-is.
 */
@Component({
  selector: 'dgt-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {
  @Input() navItems: NavItem[] = [];
  @Input() activeId: string | null = null;
  @Input() brand = 'DGT';
  @Output() select = new EventEmitter<string>();

  isNarrow = false;
  railCollapsed = false;
  railOpen = false;

  ngOnInit(): void {
    this.checkWidth();
  }

  @HostListener('window:resize')
  checkWidth(): void {
    this.isNarrow = window.innerWidth <= 760;
    if (!this.isNarrow) {
      this.railOpen = false;
    }
  }

  onToggleRail(): void {
    if (this.isNarrow) {
      this.railOpen = !this.railOpen;
    } else {
      this.railCollapsed = !this.railCollapsed;
    }
  }

  onSelect(id: string): void {
    this.select.emit(id);
  }
}
