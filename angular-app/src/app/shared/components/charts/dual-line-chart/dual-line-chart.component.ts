import { AfterViewChecked, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

interface PointView {
  x: number;
  y: number;
}

/**
 * Ports `lineChartDual(labels, s1, s2, opts)` (dashboard/index.html:1071) — used
 * for the Monitoring module's "Kurva S" (planned vs. actual budget/program curve).
 * s1 = rencana (dashed, --series-2), s2 = realisasi (solid, --primary, draws in).
 */
@Component({
  selector: 'dgt-dual-line-chart',
  templateUrl: './dual-line-chart.component.html',
  styleUrls: ['./dual-line-chart.component.scss']
})
export class DualLineChartComponent implements OnChanges, AfterViewChecked {
  @Input() labels: string[] = [];
  @Input() s1: (number | null)[] = [];
  @Input() s2: (number | null)[] = [];
  @Input() width = 560;
  @Input() height = 210;

  @ViewChild('s2Path', { static: false }) s2PathRef?: ElementRef<SVGPathElement>;

  path1 = '';
  path2 = '';
  gridLines: number[] = [];
  tickLabels: { x: number; label: string }[] = [];
  points: PointView[] = [];
  lineLength = 0;

  private readonly pad = { t: 14, r: 14, b: 26, l: 14 };

  ngOnChanges(): void {
    this.build();
  }

  ngAfterViewChecked(): void {
    if (this.s2PathRef && this.path2) {
      const len = this.s2PathRef.nativeElement.getTotalLength();
      if (len && len !== this.lineLength) {
        this.lineLength = len;
      }
    }
  }

  private build(): void {
    const { t, r, b, l } = this.pad;
    const innerW = this.width - l - r;
    const innerH = this.height - t - b;
    const all = [...this.s1, ...this.s2].filter((v): v is number => v !== null && v !== undefined);
    const max = (all.length ? Math.max(...all) : 1) * 1.1 || 1;
    const stepX = this.labels.length > 1 ? innerW / (this.labels.length - 1) : innerW;

    const pathFor = (series: (number | null)[]): string => {
      let d = '';
      series.forEach((v, i) => {
        if (v === null || v === undefined) {
          return;
        }
        const x = l + i * stepX;
        const y = t + innerH - (v / max) * innerH;
        d += (d === '' ? 'M ' : ' L ') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      return d;
    };

    this.path1 = pathFor(this.s1);
    this.path2 = pathFor(this.s2);

    this.gridLines = [0, 1, 2, 3, 4].map(g => t + (innerH / 4) * g);

    this.tickLabels = this.labels
      .map((label, i) => ({ x: l + i * stepX, label }))
      .filter((_, i) => !(i % 2 !== 0 && this.labels.length > 8));

    this.points = this.s2
      .map((v, i) => (v === null || v === undefined ? null : { x: l + i * stepX, y: t + innerH - (v / max) * innerH }))
      .filter((p): p is PointView => p !== null);
  }
}
