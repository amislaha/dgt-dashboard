import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardShellComponent } from './dashboard-shell.component';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';
import { KawasanMapComponent } from './components/geospasial/kawasan-map.component';
import { GeospasialComponent } from './components/geospasial/geospasial.component';
import { ProfilComponent } from './components/profil/profil.component';
import { DemografiComponent } from './components/demografi/demografi.component';
import { InfrastrukturComponent } from './components/infrastruktur/infrastruktur.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { EkonomiComponent } from './components/ekonomi/ekonomi.component';
import { AnalitikComponent } from './components/analitik/analitik.component';
import { IntelijenComponent } from './components/intelijen/intelijen.component';

/**
 * DGT Dashboard feature module — Angular port of dashboard/index.html (see
 * CLAUDE.md "Architecture of dashboard/index.html"). Lazy-loaded from
 * app-routing.module.ts at the `/dashboard` path. Entry point:
 * DashboardShellComponent (rail + topbar via ShellModule's `<dgt-app-shell>`,
 * wrapping a `<router-outlet>` for the 8 module routes below).
 */
@NgModule({
  declarations: [
    DashboardShellComponent,
    ChatPanelComponent,
    KawasanMapComponent,
    GeospasialComponent,
    ProfilComponent,
    DemografiComponent,
    InfrastrukturComponent,
    MonitoringComponent,
    EkonomiComponent,
    AnalitikComponent,
    IntelijenComponent
  ],
  imports: [SharedModule, ShellModule, DashboardRoutingModule]
})
export class DashboardModule {}
