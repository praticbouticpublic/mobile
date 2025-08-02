import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogoutPage } from './logout.page';
import { LoginPage } from '../login/login.page';

const routes: Routes = [
  {
    path: '',
    component: LogoutPage
  },
  {
    path: 'admin/login',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogoutPageRoutingModule {}
