import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { WelcomePage } from '../welcome/welcome.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'admin/welcome',
    component: WelcomePage
  },
  {
    path: 'admin/products',
    loadChildren: () => import('../products/products.module').then( m => m.ProductsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
