import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderstatusPage } from './orderstatus.page';
import {identifiedGuard} from "../../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: OrderstatusPage,
    redirectTo :'admin/displaytable/statutcmd'
  },
  {
    path: 'admin/displaytable/:table/:selcol/:selid', loadChildren: () => import('../../displaytable/displaytable.module').then(m =>
      m.DisplaytablePageModule),
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderstatusPageRoutingModule {}
