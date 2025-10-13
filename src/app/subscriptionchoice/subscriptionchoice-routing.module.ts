import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionchoicePage } from './subscriptionchoice.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionchoicePage
  },
  {
    path: 'admin/paymentdetails/:linkparam',
    loadChildren: () => import('./../paymentdetails/paymentdetails.module').then( m => m.PaymentdetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionchoicePageRoutingModule {}
