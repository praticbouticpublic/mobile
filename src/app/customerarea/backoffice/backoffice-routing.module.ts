import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackofficePage } from './backoffice.page';
import {identifiedGuard} from "../../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: BackofficePage,
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficePageRoutingModule {}
