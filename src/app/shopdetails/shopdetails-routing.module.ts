import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopdetailsPage } from './shopdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ShopdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopdetailsPageRoutingModule {}
