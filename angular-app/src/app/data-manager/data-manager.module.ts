import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DataManagerRoutingModule } from './data-manager-routing.module';
import { DataManagerShellComponent } from './data-manager-shell/data-manager-shell.component';
import { EntityFormComponent } from './entity-form/entity-form.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { SubmissionApprovalComponent } from './submission-approval/submission-approval.component';
import { SubmissionHubComponent } from './submission-hub/submission-hub.component';
import { SubmissionComponent } from './submission/submission.component';
import { WilayahMapComponent } from './wilayah/wilayah-map/wilayah-map.component';
import { WilayahComponent } from './wilayah/wilayah.component';

/**
 * Feature module for the "DGT Data Manager" CRUD tool (see CLAUDE.md
 * data-manager/ and data-manager/README.md), lazy-loaded from
 * app-routing.module.ts. Entirely self-contained under src/app/data-manager/
 * — no cross-import from src/app/dashboard/, matching the two tools' original
 * independence (CLAUDE.md: "not connected to it at runtime").
 *
 * No longer imports `ShellModule`/uses `<dgt-app-shell>` — `DataManagerShellComponent` moved from a
 * rail+topbar sidebar layout to its own header-nav template (see that component's doc comment and
 * PORT_NOTES.md), so the shared sidebar shell isn't needed here any more (dashboard still uses it).
 */
@NgModule({
  declarations: [
    DataManagerShellComponent,
    EntityListComponent,
    EntityFormComponent,
    SubmissionComponent,
    SubmissionApprovalComponent,
    SubmissionHubComponent,
    WilayahComponent,
    WilayahMapComponent
  ],
  imports: [SharedModule, DataManagerRoutingModule]
})
export class DataManagerModule {}
