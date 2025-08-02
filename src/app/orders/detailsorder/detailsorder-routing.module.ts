import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsorderPage } from './detailsorder.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsorderPage
  },
  {
    path: 'admin/orderlines/:idcmd/:id',
    loadChildren: () => import('./orderlines/orderlines.module').then( m => m.OrderlinesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsorderPageRoutingModule {}
