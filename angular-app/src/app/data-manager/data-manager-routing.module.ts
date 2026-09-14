import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataManagerShellComponent } from './data-manager-shell/data-manager-shell.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityKey } from './models/entity-key.model';

function entityRoute(path: string, entityKey: EntityKey) {
  return { path, component: EntityListComponent, data: { entityKey } };
}

/**
 * One route per entity, all rendered by the same generic `EntityListComponent`
 * distinguished by `data.entityKey` — not 8 separate routed components.
 * Default route redirects to `wpt`, the top of the WPT → SKP → SP hierarchy,
 * per the port spec.
 */
const routes: Routes = [
  {
    path: '',
    component: DataManagerShellComponent,
    children: [
      { path: '', redirectTo: 'wpt', pathMatch: 'full' },
      entityRoute('wpt', 'wpt'),
      entityRoute('skp', 'skp'),
      entityRoute('sp', 'sp'),
      entityRoute('komoditi', 'komoditi'),
      entityRoute('program', 'program'),
      entityRoute('satker', 'satker'),
      entityRoute('personel', 'personel'),
      entityRoute('iku', 'iku')
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagerRoutingModule {}
