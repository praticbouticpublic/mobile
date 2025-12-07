import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionPage } from './subscription.page';
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPage,
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPageRoutingModule {}
