import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderlinesPage } from './orderlines.page';

const routes: Routes = [
  {
    path: '',
    component: OrderlinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderlinesPageRoutingModule {}
