import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentdetailsPage } from './paymentdetails.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentdetailsPageRoutingModule {}
