import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsorderPage } from './detailsorder.page';
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
  {
    path: '',
    component: DetailsorderPage
  },
  {
    path: 'admin/orderlines',
    loadChildren: () => import('./orderlines/orderlines.module').then( m => m.OrderlinesPageModule)
  }
];

@NgModule({
  imports: [ IonicModule,  RouterModule.forChild(routes)],
  exports: [ RouterModule],
})
export class DetailsorderPageRoutingModule {}
