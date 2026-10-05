import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountManagementComponent } from './account-management.component';
import { AccountFormComponent } from './account-form.component';

export const routes: Routes = [
  { path: '', component: AccountManagementComponent },
  { path: 'new', component: AccountFormComponent },
  { path: ':id', component: AccountFormComponent },
  { path: ':id/edit', component: AccountFormComponent }
];

@NgModule({
  declarations: [AccountManagementComponent, AccountFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AccountManagementModule {}
