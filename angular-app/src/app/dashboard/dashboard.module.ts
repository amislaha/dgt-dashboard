import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardShellComponent } from './dashboard-shell.component';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';
import { KawasanMapComponent } from './components/geospasial/kawasan-map.component';
import { GeospasialComponent } from './components/geospasial/geospasial.component';
import { ProfilComponent } from './components/profil/profil.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { EkonomiComponent } from './components/ekonomi/ekonomi.component';
import { AnalitikComponent } from './components/analitik/analitik.component';
import { IntelijenComponent } from './components/intelijen/intelijen.component';

/**
 * DGT Dashboard feature module — Angular port of dashboard/index.html (see
 * CLAUDE.md "Architecture of dashboard/index.html"). Lazy-loaded from
 * app-routing.module.ts at the `/dashboard` path. Entry point:
 * DashboardShellComponent (rail + topbar via ShellModule's `<dgt-app-shell>`,
 * wrapping a `<router-outlet>` for the 6 module routes below — DGT.md's
 * original spec had 8; Demografi & Pembauran and Infrastruktur & Kolaborasi
 * K/L were removed on request, see dashboard/PORT_NOTES.md).
 */
@NgModule({
  declarations: [
    DashboardShellComponent,
    ChatPanelComponent,
    KawasanMapComponent,
    GeospasialComponent,
    ProfilComponent,
    MonitoringComponent,
    EkonomiComponent,
    AnalitikComponent,
    IntelijenComponent
  ],
  imports: [SharedModule, ShellModule, DashboardRoutingModule]
})
export class DashboardModule {}
