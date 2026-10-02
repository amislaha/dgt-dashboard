import { Component, Input, OnChanges } from '@angular/core';

export interface ColSeries {
  name: string;
  color: string;
  values: number[];
}

interface Bar {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
}

interface Tick {
  y: number;
  label: string;
}

interface CatLabel {
  x: number;
  text: string;
  pct?: string;
}

const W = 1000;
const LEFT = 46;
const RIGHT = 990;
const TOP = 26;

/**
 * Plain SVG column chart for the Sibarduktrans statistics: one or more series grouped per category,
 * a light grid with a "nice" y-axis, optional share labels above single-series bars, and (for long
 * category names) slanted x labels — the look of the source site's column charts. Rendered as a
 * viewBox so it scales with its card.
 */
@Component({
  selector: 'dgt-sib-column-chart',
  template: `
    <svg class="sc" [attr.viewBox]="'0 0 ' + w + ' ' + height" preserveAspectRatio="xMidYMid meet" role="img" [attr.aria-label]="ariaLabel">
      <g class="grid">
        <ng-container *ngFor="let t of ticks">
          <line [attr.x1]="left" [attr.x2]="right" [attr.y1]="t.y" [attr.y2]="t.y"></line>
          <text [attr.x]="left - 8" [attr.y]="t.y + 3.5" text-anchor="end">{{ t.label }}</text>
        </ng-container>
        <line class="v" *ngFor="let c of cats" [attr.x1]="c.x - band / 2" [attr.x2]="c.x - band / 2" [attr.y1]="top" [attr.y2]="base"></line>
        <line class="v" [attr.x1]="right" [attr.x2]="right" [attr.y1]="top" [attr.y2]="base"></line>
      </g>
      <g>
        <rect *ngFor="let b of bars" [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h" [attr.fill]="b.color" rx="1.5"><title>{{ b.title }}</title></rect>
      </g>
      <g class="pct" *ngIf="showPct">
        <text *ngFor="let c of cats; let i = index" [attr.x]="c.x" [attr.y]="pctY[i]" text-anchor="middle" [attr.fill]="series[0].color">{{ c.pct }}</text>
      </g>
      <g class="xl">
        <text *ngFor="let c of cats" [attr.x]="c.x" [attr.y]="base + 16" [attr.text-anchor]="rotate ? 'end' : 'middle'" [attr.transform]="rotate ? 'rotate(-35 ' + c.x + ' ' + (base + 16) + ')' : null">{{ c.text }}</text>
      </g>
    </svg>
    <div class="legend" *ngIf="series.length > 1">
      <span *ngFor="let s of series"><i [style.background]="s.color"></i>{{ s.name }}</span>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .sc { width: 100%; height: auto; display: block; font-family: var(--font-sans); }
      .grid line { stroke: var(--border); stroke-width: 1; }
      .grid line.v { stroke: var(--border-soft); }
      .grid text { font-size: 10.5px; fill: var(--text-dim); }
      .pct text { font-size: 10px; font-weight: 600; }
      .xl text { font-size: 10px; fill: var(--text-dim); }
      .legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; font-size: 11.5px; color: var(--text-dim); }
      .legend i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; }
    `
  ]
})
export class SibColumnChartComponent implements OnChanges {
  @Input() categories: string[] = [];
  @Input() series: ColSeries[] = [];
  /** Share labels (e.g. "15.3%") shown above each bar — single-series charts only. */
  @Input() pctLabels: string[] | null = null;
  /** Slant the x labels (long province names). */
  @Input() rotate = false;
  @Input() ariaLabel = 'Grafik kolom';
  @Input() height = 330;

  readonly w = W;
  readonly left = LEFT;
  readonly right = RIGHT;
  readonly top = TOP;

  base = 0;
  band = 0;
  bars: Bar[] = [];
  ticks: Tick[] = [];
  cats: CatLabel[] = [];
  pctY: number[] = [];

  get showPct(): boolean {
    return !!this.pctLabels && this.series.length === 1;
  }

  ngOnChanges(): void {
    const n = this.categories.length;
    const bottomPad = this.rotate ? 112 : 40;
    this.base = this.height - bottomPad;
    const ph = this.base - TOP;
    this.band = n ? (RIGHT - LEFT) / n : 0;

    const rawMax = Math.max(1, ...this.series.map(s => Math.max(0, ...s.values)));
    const step = this.niceStep(rawMax / 5);
    const max = Math.ceil(rawMax / step) * step;
    const y = (v: number) => this.base - (v / max) * ph;

    this.ticks = [];
    for (let v = 0; v <= max + 1e-9; v += step) {
      this.ticks.push({ y: y(v), label: Number(v.toFixed(2)).toLocaleString('id-ID') });
    }

    const groupW = this.band * 0.72;
    const barW = this.series.length ? groupW / this.series.length : 0;
    this.bars = [];
    this.pctY = [];
    this.cats = this.categories.map((text, i) => ({
      x: LEFT + i * this.band + this.band / 2,
      text,
      pct: this.pctLabels ? this.pctLabels[i] : undefined
    }));
    this.categories.forEach((cat, i) => {
      const x0 = LEFT + i * this.band + (this.band - groupW) / 2;
      let top = this.base;
      this.series.forEach((s, j) => {
        const v = s.values[i] || 0;
        const h = (v / max) * ph;
        top = Math.min(top, this.base - h);
        this.bars.push({
          x: x0 + j * barW,
          y: this.base - h,
          w: Math.max(2, barW - 1),
          h,
          color: s.color,
          title: `${cat} · ${s.name}: ${v.toLocaleString('id-ID')}`
        });
      });
      this.pctY.push(top - 5);
    });
  }

  private niceStep(raw: number): number {
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / pow;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow;
  }
}
