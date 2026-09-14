import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Shared `.drawer` panel — used by data-manager's edit/create forms
 * (`.drawer-head`/`.drawer-body`/`.drawer-foot`) and dashboard's "Detail
 * Kawasan" style side panels. Built once here instead of the copy-pasted
 * per-tool version in the original prototype.
 */
@Component({
  selector: 'dgt-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  onScrimClick(): void {
    this.closed.emit();
  }
}
