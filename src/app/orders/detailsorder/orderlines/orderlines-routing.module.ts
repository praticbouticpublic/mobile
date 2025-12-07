import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderlinesPage } from './orderlines.page';
import {identifiedGuard} from "../../../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: OrderlinesPage,
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderlinesPageRoutingModule {}
