import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagerShellComponent } from './data-manager-shell/data-manager-shell.component';
import { EntityListComponent } from './entity-list/entity-list.component';

/**
 * One route per entity, all rendered by the same generic `EntityListComponent`
 * distinguished by `data.entityKey` — not 8 separate routed components.
 * Default route redirects to `wpt`, the top of the WPT → SKP → SP hierarchy,
 * per the port spec.
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
      { path: '', redirectTo: 'wpt', pathMatch: 'full' },
      { path: 'wpt', component: EntityListComponent, data: { entityKey: 'wpt' } },
      { path: 'skp', component: EntityListComponent, data: { entityKey: 'skp' } },
      { path: 'sp', component: EntityListComponent, data: { entityKey: 'sp' } },
      { path: 'komoditi', component: EntityListComponent, data: { entityKey: 'komoditi' } },
      { path: 'program', component: EntityListComponent, data: { entityKey: 'program' } },
      { path: 'satker', component: EntityListComponent, data: { entityKey: 'satker' } },
      { path: 'personel', component: EntityListComponent, data: { entityKey: 'personel' } },
      { path: 'iku', component: EntityListComponent, data: { entityKey: 'iku' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagerRoutingModule {}
