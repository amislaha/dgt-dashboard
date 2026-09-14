import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LauncherComponent } from './launcher.component';

const routes: Routes = [{ path: '', component: LauncherComponent }];

@NgModule({
  declarations: [LauncherComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class LauncherModule {}
