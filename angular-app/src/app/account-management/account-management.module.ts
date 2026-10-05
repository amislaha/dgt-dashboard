import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AccountShellComponent } from './account-shell.component';
import { AccountManagementComponent } from './account-management.component';
import { AccountFormComponent } from './account-form.component';
import { EntityListComponent } from './entity-list.component';
import { EntityFormComponent } from './entity-form.component';
import { PasswordComponent } from './password.component';
import { SettingsComponent } from './settings.component';
import { AuditComponent } from './audit.component';

// Static paths must stay above ':id' or they'd be swallowed as an account id.
export const routes: Routes = [
  {
    path: '',
    component: AccountShellComponent,
    children: [
      { path: '', component: AccountManagementComponent },
      { path: 'new', component: AccountFormComponent },
      { path: 'user-groups', component: EntityListComponent, data: { kind: 'user-groups' } },
      { path: 'user-groups/new', component: EntityFormComponent, data: { kind: 'user-groups' } },
      { path: 'user-groups/:id/edit', component: EntityFormComponent, data: { kind: 'user-groups' } },
      { path: 'applications', component: EntityListComponent, data: { kind: 'applications' } },
      { path: 'applications/new', component: EntityFormComponent, data: { kind: 'applications' } },
      { path: 'applications/:id/edit', component: EntityFormComponent, data: { kind: 'applications' } },
      { path: 'manage-password', component: PasswordComponent, data: { manage: true } },
      { path: 'password', component: PasswordComponent, data: { manage: false } },
      { path: 'settings', component: SettingsComponent },
      { path: 'audits', component: AuditComponent },
      { path: ':id', component: AccountFormComponent },
      { path: ':id/edit', component: AccountFormComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AccountShellComponent, AccountManagementComponent, AccountFormComponent,
    EntityListComponent, EntityFormComponent, PasswordComponent, SettingsComponent, AuditComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AccountManagementModule {}
