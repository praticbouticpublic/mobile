import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveriesPage } from './deliveries.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveriesPage,
    children: [
      {
        path: 'displaytable/:table/:selcol/:selid',
        loadChildren: () => import('../displaytable/displaytable.module').then(m => m.DisplaytablePageModule)
      },
      {
        path: '',
        redirectTo: 'displaytable/barlivr/none/0',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin/deliveries/displaytable/barlivr/none/0',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class DeliveriesPageRoutingModule {}
