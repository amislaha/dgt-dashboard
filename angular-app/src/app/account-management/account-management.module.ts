import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountManagementComponent } from './account-management.component';

export const routes: Routes = [{ path: '', component: AccountManagementComponent }];

@NgModule({
  declarations: [AccountManagementComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AccountManagementModule {}
