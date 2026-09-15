import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardShellComponent } from './dashboard-shell.component';
import { GeospasialComponent } from './components/geospasial/geospasial.component';
import { ProfilComponent } from './components/profil/profil.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { EkonomiComponent } from './components/ekonomi/ekonomi.component';
import { AnalitikComponent } from './components/analitik/analitik.component';
import { IntelijenComponent } from './components/intelijen/intelijen.component';

/**
 * Geospasial is the default/index child route, matching `state.tab`
 * defaulting to `"geospasial"` in dashboard/index.html (it's the landing
 * module — see CLAUDE.md "Geospasial module layout").
 */
export const routes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      { path: '', redirectTo: 'geospasial', pathMatch: 'full' },
      { path: 'geospasial', component: GeospasialComponent, data: { navId: 'geospasial' } },
      { path: 'profil', component: ProfilComponent, data: { navId: 'profil' } },
      { path: 'monitoring', component: MonitoringComponent, data: { navId: 'monitoring' } },
      { path: 'ekonomi', component: EkonomiComponent, data: { navId: 'ekonomi' } },
      { path: 'analitik', component: AnalitikComponent, data: { navId: 'analitik' } },
      { path: 'intelijen', component: IntelijenComponent, data: { navId: 'intelijen' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
