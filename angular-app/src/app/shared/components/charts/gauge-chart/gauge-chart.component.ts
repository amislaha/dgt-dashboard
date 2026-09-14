import { Component, Input, OnChanges } from '@angular/core';

/**
 * Ports `gauge(value, max, opts)` (dashboard/index.html:1153).
 *
 * IMPORTANT — per CLAUDE.md: this draws a half-circle sweep (0–180°), so the
 * arc's large-arc-flag must ALWAYS be 0 — `frac` (value/max, clamped to
 * [0,1]) can never make the value angle exceed 180°, so it is never the
 * "major" arc. Do not introduce a `frac > 0.5 ? 1 : 0` ternary here — that
 * was a real, previously-fixed bug in the original, not a legitimate
 * threshold. The large-arc-flag stays the literal `0` below.
 */
@Component({
  selector: 'dgt-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnChanges {
  @Input() value = 0;
  @Input() max = 100;
  @Input() width = 180;
  @Input() height = 100;
  @Input() color = 'var(--primary)';
  @Input() label = '';

  cx = 0;
  cy = 0;
  r = 0;
  trackPath = '';
  valuePath = '';
  arcLen = 0;

  ngOnChanges(): void {
    this.build();
  }

  private build(): void {
    this.cx = this.width / 2;
    this.cy = this.height - 8;
    this.r = this.width / 2 - 10;
    const frac = Math.max(0, Math.min(1, this.max ? this.value / this.max : 0));
    const angle = Math.PI * frac;
    const x2 = this.cx - this.r * Math.cos(angle);
    const y2 = this.cy - this.r * Math.sin(angle);

    this.trackPath = `M ${this.cx - this.r} ${this.cy} A ${this.r} ${this.r} 0 0 1 ${this.cx + this.r} ${this.cy}`;
    // Large-arc-flag is the literal 0 fourth flag below — see class doc comment.
    this.valuePath = `M ${this.cx - this.r} ${this.cy} A ${this.r} ${this.r} 0 0 1 ${x2} ${y2}`;
    this.arcLen = this.r * angle;
  }
}
