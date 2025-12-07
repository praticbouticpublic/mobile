import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayrecordPage } from './displayrecord.page';
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: DisplayrecordPage,
    canActivate: [identifiedGuard]
  },
    {
        path: 'insertrecord',
        loadChildren: () => import('../displaytable/insertrecord/insertrecord.module').then(m => m.InsertrecordPageModule),
        canActivate: [identifiedGuard]

    },
    {
        path: 'updaterecord',
        loadChildren: () => import('../displaytable/updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'viewrecord',
        loadChildren: () => import('../displaytable/viewrecord/viewrecord.module').then(m => m.ViewrecordPageModule),
        canActivate: [identifiedGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayrecordPageRoutingModule {}
