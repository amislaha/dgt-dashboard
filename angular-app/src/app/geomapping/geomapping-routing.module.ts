import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeomappingShellComponent } from './geomapping-shell.component';
import { PublicMappingComponent } from './components/public-mapping/public-mapping.component';
import { MyLayersComponent } from './components/my-layers/my-layers.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { TaskComponent } from './components/task/task.component';
import { ActivityComponent } from './components/activity/activity.component';
import { EditComponent } from './components/edit/edit.component';

/**
 * One child route per rail view (`RAIL` in geomapping/index.html), rendered into the shell's
 * `<router-outlet>` inside its dock panel body — see GeomappingShellComponent's doc comment for
 * why this differs from the original's single `state.view` + `renderPanel()` dispatch.
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
      { path: 'edit', component: EditComponent },
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
