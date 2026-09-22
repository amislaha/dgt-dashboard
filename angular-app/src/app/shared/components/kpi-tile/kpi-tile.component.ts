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
  /** Formatted delta text, e.g. "+3.2%" — verbatim from the source's own `kpiTile()` calls,
   *  which do NOT auto-render a trend arrow: some delta strings embed one ("▲ 3.2% ..."), most
   *  don't. `dir` only ever controls the text colour here, matching the original's
   *  `.k-delta.up`/`.down`/`.flat` CSS classes — don't add an arrow glyph unless the source's own
   *  call site has one baked into its delta string. Omit `delta` to hide the trend row. */
  @Input() delta?: string;
  @Input() dir: 'up' | 'down' | 'flat' = 'flat';
  /** true flips the trend colour to critical even on an "up" arrow — used by
   *  the "Peringatan Aktif" tile when EWS alerts are active. */
  @Input() alert = false;
  /** Solid colour variant used by the Data Induk & Profil Kawasan detail page's Ekonomi tab
   *  (Jumlah Penduduk/Luas Kawasan/Potensi Daya Tampung/Nilai Intrans cards). Omit for the default
   *  plain white tile every other module uses. */
  @Input() color?: 'good' | 'series2' | 'primary' | 'warn';
  /** Small pill shown below the value on a coloured tile, e.g. "5 kecamatan · 9 desa". */
  @Input() chip?: string;
  /** Secondary line below the chip, e.g. "Kepadatan: 0.67 jiwa/ha". */
  @Input() sub?: string;
}
