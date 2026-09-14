import { Component, Input } from '@angular/core';

/** Ports `.sev`/`.badge` severity chips (EWS alerts, data-manager row status, etc.). */
@Component({
  selector: 'dgt-severity-badge',
  templateUrl: './severity-badge.component.html',
  styleUrls: ['./severity-badge.component.scss']
})
export class SeverityBadgeComponent {
  @Input() severity: 'good' | 'warn' | 'critical' | 'neutral' = 'neutral';
  @Input() label = '';
}
