import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomePage } from './welcome.page';
import { LoginPage } from '../login/login.page';
import { DebutPage } from '../debut/debut.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'admin/login',
    component: LoginPage
  },
  {
    path: 'admin/debut/:boutic/:method/:table',
    component: DebutPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomePageRoutingModule {}
