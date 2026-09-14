import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeomappingShellComponent } from './geomapping-shell.component';
import { PublicMappingComponent } from './components/public-mapping/public-mapping.component';
import { MyLayersComponent } from './components/my-layers/my-layers.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

/**
 * One child route per rail view (`RAIL` in geomapping/index.html), rendered into the shell's
 * `<router-outlet>` inside its dock panel body — see GeomappingShellComponent's doc comment for
 * why this differs from the original's single `state.view` + `renderPanel()` dispatch. Approval/
 * Edit/Task/Activity route to a shared placeholder until their own phases land (PORT_NOTES.md).
 */
const routes: Routes = [
  {
    path: '',
    component: GeomappingShellComponent,
    children: [
      { path: '', redirectTo: 'public', pathMatch: 'full' },
      { path: 'public', component: PublicMappingComponent },
      { path: 'mylayers', component: MyLayersComponent },
      {
        path: 'approval',
        component: ComingSoonComponent,
        data: { title: 'Approval', description: 'Alur verifikasi objek survei (setuju/tolak) oleh koordinator sebelum dipublikasikan.' }
      },
      {
        path: 'edit',
        component: ComingSoonComponent,
        data: { title: 'Edit Mode - Tracking', description: 'Rekam titik/garis/poligon lewat GPS (Tracking Point/Line/Polygon) atau gambar manual, lalu isi form & kuesioner objek.' }
      },
      {
        path: 'task',
        component: ComingSoonComponent,
        data: { title: 'Task', description: 'Daftar tugas survei lapangan yang perlu diselesaikan.' }
      },
      {
        path: 'activity',
        component: ComingSoonComponent,
        data: { title: 'Activity', description: 'Log aktivitas seluruh perubahan pada data geomapping.' }
      },
      { path: '**', redirectTo: 'public' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeomappingRoutingModule {}
