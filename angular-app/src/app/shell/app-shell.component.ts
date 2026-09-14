import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NavItem } from '../core/models/nav-item.model';

/**
 * Generic app shell: rail nav (left) + topbar + content area, reused by both
 * the dashboard and data-manager feature modules (each supplies its own
 * `navItems`/`brand`/active id and handles the `select` event with its own
 * router navigation) instead of each hand-rolling `.shell`/`.rail`/`.main`
 * independently, as the original prototype's two tools did.
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
