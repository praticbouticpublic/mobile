import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderstatusPage } from './orderstatus.page';

const routes: Routes = [
  {
    path: '',
    component: OrderstatusPage,
    redirectTo :'admin/displaytable/statutcmd/none/0'
  },
  {
    path: 'admin/displaytable/:table/:selcol/:selid', loadChildren: () => import('../../displaytable/displaytable.module').then(m =>
      m.DisplaytablePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderstatusPageRoutingModule {}
