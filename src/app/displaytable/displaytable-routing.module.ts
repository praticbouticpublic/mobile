import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplaytablePage } from './displaytable.page';

const routes: Routes = [
  {
    path: '',
    component: DisplaytablePage
  },
  {
    path: 'admin/insertrecord/:table/:selcol/:selid',
    loadChildren: () => import('./insertrecord/insertrecord.module').then( m => m.InsertrecordPageModule)
  },
  {
    path: 'admin/updaterecord/:table/:id/:selcol/:selid',
    loadChildren: () => import('./updaterecord/updaterecord.module').then( m => m.UpdaterecordPageModule)
  },
  {
    path: 'admin/viewrecord/:table/:id/:selcol/:selid',
    loadChildren: () => import('./viewrecord/viewrecord.module').then( m => m.ViewrecordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplaytablePageRoutingModule {}
