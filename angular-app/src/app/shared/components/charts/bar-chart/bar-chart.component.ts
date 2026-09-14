import { Component, Input, OnChanges } from '@angular/core';
import { BarDatum } from '../chart.model';

interface BarView {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  valueLabel: string;
  labelX: number;
  valueY: number;
  tickY: number;
}

/** Ports the hand-rolled `barChart(data, opts)` SVG builder (dashboard/index.html:1036). */
@Component({
  selector: 'dgt-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @Input() data: BarDatum[] = [];
  @Input() width = 480;
  @Input() height = 200;
  @Input() max?: number;
  @Input() suffix = '';
  @Input() color = 'var(--primary)';
  @Input() ariaLabel = 'bar chart';

  bars: BarView[] = [];

  private readonly pad = { t: 10, r: 10, b: 34, l: 10 };

  ngOnChanges(): void {
    this.bars = this.build();
  }

  private build(): BarView[] {
    if (!this.data.length) {
      return [];
    }
    const { t, r, b, l } = this.pad;
    const innerW = this.width - l - r;
    const innerH = this.height - t - b;
    const max = this.max || Math.max(...this.data.map(d => d.value)) * 1.15;
    const bw = innerW / this.data.length;

    return this.data.map((d, i) => {
      const barH = (d.value / max) * innerH;
      const x = l + i * bw + bw * 0.18;
      const y = t + innerH - barH;
      const bwActual = bw * 0.64;
      const label = d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label;
      return {
        x, y, width: bwActual, height: Math.max(barH, 1.5),
        color: d.color || this.color,
        label,
        valueLabel: `${d.value}${this.suffix}`,
        labelX: x + bwActual / 2,
        valueY: y - 5,
        tickY: this.height - b + 15
      };
    });
  }
}
