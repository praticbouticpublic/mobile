import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewrecordPage } from './viewrecord.page';

const routes: Routes = [
  {
    path: '',
    component: ViewrecordPage
  },
  {
    path: 'admin/products/viewrecord/:table/:id/:selcol/:selid',
    loadChildren: () => import('./viewrecord.module').then( m => m.ViewrecordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewrecordPageRoutingModule {}
