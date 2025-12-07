import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
    canActivate: [identifiedGuard]
  },
  {
    path: 'admin/detailsorder',
    loadChildren: () => import('./detailsorder/detailsorder.module').then( m => m.DetailsorderPageModule),
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {}
