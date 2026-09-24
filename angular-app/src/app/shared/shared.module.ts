import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RailNavComponent } from './components/rail-nav/rail-nav.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { PageHeadComponent } from './components/page-head/page-head.component';
import { KpiTileComponent } from './components/kpi-tile/kpi-tile.component';
import { SeverityBadgeComponent } from './components/severity-badge/severity-badge.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { DualLineChartComponent } from './components/charts/dual-line-chart/dual-line-chart.component';
import { DonutChartComponent } from './components/charts/donut-chart/donut-chart.component';
import { GaugeChartComponent } from './components/charts/gauge-chart/gauge-chart.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

export const COMPONENTS = [
  RailNavComponent,
  TopbarComponent,
  PageHeadComponent,
  KpiTileComponent,
  SeverityBadgeComponent,
  DrawerComponent,
  ToastContainerComponent,
  DataTableComponent,
  BarChartComponent,
  DualLineChartComponent,
  DonutChartComponent,
  GaugeChartComponent,
  ThemeToggleComponent
];

/**
 * Shared UI component library — the Angular equivalent of design-system/
 * (see CLAUDE.md). Every dashboard/data-manager feature module imports this
 * once instead of re-implementing `.panel`/`.badge`/`.table-wrap`/etc. per
 * tool, which is what the original static prototype did (copy-paste, not
 * shared code — see the token-reconciliation note in the port spec).
 */
@NgModule({
  declarations: [...COMPONENTS, SafeHtmlPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ...COMPONENTS, SafeHtmlPipe]
})
export class SharedModule {}
