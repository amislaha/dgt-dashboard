import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

/**
 * Drop-in light/dark toggle button, styled to match the `.icon-btn`/
 * `.top-icon-btn` pattern each shell already hand-rolls (dashboard has no
 * topbar at all, so it uses `[fixed]="true"` there instead — see
 * DashboardShellComponent). Self-contained so it looks reasonable dropped
 * into any of the four independent shells without fighting Angular's
 * per-component style encapsulation.
 */
@Component({
  selector: 'dgt-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  @Input() fixed = false;

  constructor(public theme: ThemeService) {}
}
