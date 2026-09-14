import { Component, Input, OnChanges } from '@angular/core';
import { DonutSegment } from '../chart.model';

interface DonutArcView {
  color: string;
  label: string;
  value: number;
  dashArray: string;
  dashOffset: string;
}

/** Ports `donut(segments, opts)` (dashboard/index.html:1126). */
@Component({
  selector: 'dgt-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnChanges {
  @Input() segments: DonutSegment[] = [];
  @Input() size = 150;
  @Input() stroke = 16;
  @Input() centerLabel?: string;
  @Input() centerSub = '';

  arcs: DonutArcView[] = [];
  r = 0;
  cx = 0;
  cy = 0;

  ngOnChanges(): void {
    this.build();
  }

  private build(): void {
    this.r = (this.size - this.stroke) / 2;
    this.cx = this.size / 2;
    this.cy = this.size / 2;
    const total = this.segments.reduce((s, d) => s + d.value, 0) || 1;
    const circumf = 2 * Math.PI * this.r;
    let offset = 0;

    this.arcs = this.segments.map(seg => {
      const frac = seg.value / total;
      const len = frac * circumf;
      const arc: DonutArcView = {
        color: seg.color,
        label: seg.label,
        value: seg.value,
        dashArray: `${len} ${circumf - len}`,
        dashOffset: (-offset).toFixed(2)
      };
      offset += len;
      return arc;
    });
  }
}
