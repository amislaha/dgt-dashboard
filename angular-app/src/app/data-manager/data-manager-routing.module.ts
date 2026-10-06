import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagerShellComponent } from './data-manager-shell/data-manager-shell.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { SubmissionHubComponent } from './submission-hub/submission-hub.component';
import { WilayahComponent } from './wilayah/wilayah.component';

/**
 * One route per entity (25 of the 26 `EntityKey`s — `wpt` is served by `WilayahComponent`
 * instead, see below), all rendered by the same generic `EntityListComponent` distinguished by
 * `data.entityKey` — not one routed component per entity. Default route redirects to `wilayah`,
 * the header nav's landing page (moved here from `wpt` on request — see PORT_NOTES.md).
 *
 * Routes are written as inline literals rather than built via a small
 * `entityRoute(path, key)` helper (as this started out) because Angular 8's
 * ViewEngine AOT compiler can't statically fold a function call referenced
 * inside `@NgModule` metadata, even when the function is exported — it
 * needs the whole `routes` array to already be a plain object/array
 * literal.
 */
export const routes: Routes = [
  {
    path: '',
    component: DataManagerShellComponent,
    children: [
      { path: '', redirectTo: 'wilayah', pathMatch: 'full' },
      // `wpt`'s own entity list is embedded inside WilayahComponent (see its doc comment) rather
      // than routed to directly, so `data.entityKey: 'wpt'` lives here instead of on a `wpt` path.
      { path: 'wilayah', component: WilayahComponent, data: { entityKey: 'wpt', navId: 'wilayah' } },
      { path: 'skp', component: EntityListComponent, data: { entityKey: 'skp' } },
      { path: 'sp', component: EntityListComponent, data: { entityKey: 'sp' } },
      { path: 'komoditi', component: EntityListComponent, data: { entityKey: 'komoditi' } },
      { path: 'program', component: EntityListComponent, data: { entityKey: 'program' } },
      { path: 'satker', component: EntityListComponent, data: { entityKey: 'satker' } },
      { path: 'personel', component: EntityListComponent, data: { entityKey: 'personel' } },
      { path: 'iku', component: EntityListComponent, data: { entityKey: 'iku' } },
      { path: 'wilayahStatus', component: EntityListComponent, data: { entityKey: 'wilayahStatus' } },
      { path: 'wilayahCategory', component: EntityListComponent, data: { entityKey: 'wilayahCategory' } },
      { path: 'wilayahTarget', component: EntityListComponent, data: { entityKey: 'wilayahTarget' } },
      { path: 'project', component: EntityListComponent, data: { entityKey: 'project' } },
      { path: 'satkerType', component: EntityListComponent, data: { entityKey: 'satkerType' } },
      { path: 'strategicTarget', component: EntityListComponent, data: { entityKey: 'strategicTarget' } },
      { path: 'ikuDefinition', component: EntityListComponent, data: { entityKey: 'ikuDefinition' } },
      { path: 'ikuNko', component: EntityListComponent, data: { entityKey: 'ikuNko' } },
      { path: 'ikuStatus', component: EntityListComponent, data: { entityKey: 'ikuStatus' } },
      { path: 'produkJenis', component: EntityListComponent, data: { entityKey: 'produkJenis' } },
      { path: 'recommendationCategory', component: EntityListComponent, data: { entityKey: 'recommendationCategory' } },
      { path: 'profilCategory', component: EntityListComponent, data: { entityKey: 'profilCategory' } },
      { path: 'profilGroup', component: EntityListComponent, data: { entityKey: 'profilGroup' } },
      { path: 'profilMeasure', component: EntityListComponent, data: { entityKey: 'profilMeasure' } },
      { path: 'applicationSettings', component: EntityListComponent, data: { entityKey: 'applicationSettings' } },
      { path: 'approvalFlow', component: EntityListComponent, data: { entityKey: 'approvalFlow' } },
      { path: 'profilWilayah', component: EntityListComponent, data: { entityKey: 'profilWilayah' } },
      { path: 'produkWilayah', component: EntityListComponent, data: { entityKey: 'produkWilayah' } },
      // "Submission & Approval" — a single header item covering what used to be two rail entries
      // (Pengajuan Data, Approval); `data.navId` (not `entityKey`) is what
      // DataManagerShellComponent matches against, same as `wilayah` above.
      { path: 'submission', component: SubmissionHubComponent, data: { navId: 'submission' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagerRoutingModule {}
