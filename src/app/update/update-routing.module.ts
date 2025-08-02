import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePage } from './update.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePage,
    children: [
      {
        path: 'displaytable/:table/:selcol/:selid',
        loadChildren: () => import('../displaytable/displaytable.module').then(m => m.DisplaytablePageModule)
      },
      {
        path: 'updaterecord/:table/:id/:selcol/:selid',
        loadChildren: () => import('../displaytable/updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule)
      },
      {
        path: '',
        redirectTo: 'admin/update/updaterecord/:table/:id/:selcol/:selid',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin/update/updaterecord/:table/:id/:selcol/:selid',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePageRoutingModule {}
