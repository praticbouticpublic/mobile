import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsorderPage } from './detailsorder.page';
import {IonicModule} from "@ionic/angular";
import {identifiedGuard} from "../../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: DetailsorderPage,
    canActivate: [identifiedGuard]
  },
  {
    path: 'admin/orderlines',
    loadChildren: () => import('./orderlines/orderlines.module').then( m => m.OrderlinesPageModule),
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [ IonicModule,  RouterModule.forChild(routes)],
  exports: [ RouterModule],
})
export class DetailsorderPageRoutingModule {}
