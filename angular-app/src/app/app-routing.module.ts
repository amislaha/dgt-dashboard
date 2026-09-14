import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./launcher/launcher.module').then(m => m.LauncherModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'data-manager', loadChildren: () => import('./data-manager/data-manager.module').then(m => m.DataManagerModule) },
  { path: 'geomapping', loadChildren: () => import('./geomapping/geomapping.module').then(m => m.GeomappingModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
