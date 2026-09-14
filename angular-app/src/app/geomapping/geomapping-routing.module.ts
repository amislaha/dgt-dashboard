import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeomappingShellComponent } from './geomapping-shell.component';
import { PublicMappingComponent } from './components/public-mapping/public-mapping.component';
import { MyLayersComponent } from './components/my-layers/my-layers.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { TaskComponent } from './components/task/task.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

/**
 * One child route per rail view (`RAIL` in geomapping/index.html), rendered into the shell's
 * `<router-outlet>` inside its dock panel body — see GeomappingShellComponent's doc comment for
 * why this differs from the original's single `state.view` + `renderPanel()` dispatch. Only
 * `edit` (Edit Mode — manual drawing, GPS tracking, the feature editor + questionnaire) still
 * routes to the shared placeholder; see PORT_NOTES.md for that phase.
 */
const routes: Routes = [
  {
    path: '',
    component: GeomappingShellComponent,
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      { path: 'public', component: PublicMappingComponent },
      { path: 'mylayers', component: MyLayersComponent },
      { path: 'approval', component: ApprovalComponent },
      {
        path: 'edit',
        component: ComingSoonComponent,
        data: { title: 'Edit Mode - Tracking', description: 'Rekam titik/garis/poligon lewat GPS (Tracking Point/Line/Polygon) atau gambar manual, lalu isi form & kuesioner objek.' }
      },
      { path: 'task', component: TaskComponent },
      { path: 'activity', component: ActivityComponent },
      { path: '**', redirectTo: 'public' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeomappingRoutingModule {}
