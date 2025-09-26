import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayrecordPage } from './displayrecord.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayrecordPage
  },
    {
        path: 'insertrecord',
        loadChildren: () => import('../displaytable/insertrecord/insertrecord.module').then(m => m.InsertrecordPageModule)
    },
    {
        path: 'updaterecord',
        loadChildren: () => import('../displaytable/updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule)
    },
    {
        path: 'viewrecord',
        loadChildren: () => import('../displaytable/viewrecord/viewrecord.module').then(m => m.ViewrecordPageModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayrecordPageRoutingModule {}
