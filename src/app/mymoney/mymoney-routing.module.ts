import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MymoneyPage } from './mymoney.page';
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: MymoneyPage,
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MymoneyPageRoutingModule {}
