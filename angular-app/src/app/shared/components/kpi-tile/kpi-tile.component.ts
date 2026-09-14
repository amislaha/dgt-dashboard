import { Component, Input } from '@angular/core';

/**
 * Ports the `kpiTile()`/`stgTile()` stat-tile helper used across dashboard
 * modules (`.kpi-tile`, and — restyled — the Geospasial `.stg-strip`).
 */
@Component({
  selector: 'dgt-kpi-tile',
  templateUrl: './kpi-tile.component.html',
  styleUrls: ['./kpi-tile.component.scss']
})
export class KpiTileComponent {
  @Input() label = '';
  @Input() value = '';
  /** Formatted delta text, e.g. "+3.2%". Omit to hide the trend row. */
  @Input() delta?: string;
  @Input() dir: 'up' | 'down' = 'up';
  /** true flips the trend colour to critical even on an "up" arrow — used by
   *  the "Peringatan Aktif" tile when EWS alerts are active. */
  @Input() alert = false;
}
