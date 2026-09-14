import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { DataManagerRoutingModule } from './data-manager-routing.module';
import { DataManagerShellComponent } from './data-manager-shell/data-manager-shell.component';
import { EntityFormComponent } from './entity-form/entity-form.component';
import { EntityListComponent } from './entity-list/entity-list.component';

/**
 * Feature module for the "DGT Data Manager" CRUD tool (see CLAUDE.md
 * data-manager/ and data-manager/README.md), lazy-loaded from
 * app-routing.module.ts. Entirely self-contained under src/app/data-manager/
 * — no cross-import from src/app/dashboard/, matching the two tools' original
 * independence (CLAUDE.md: "not connected to it at runtime").
 */
@NgModule({
  declarations: [DataManagerShellComponent, EntityListComponent, EntityFormComponent],
  imports: [SharedModule, ShellModule, DataManagerRoutingModule]
})
export class DataManagerModule {}
