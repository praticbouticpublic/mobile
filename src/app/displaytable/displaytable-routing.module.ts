import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplaytablePage } from './displaytable.page';
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
    {
        path: '',
        component: DisplaytablePage,
        canActivate: [identifiedGuard]
    },
    {
        path: 'insertrecord',
        loadChildren: () => import('./insertrecord/insertrecord.module').then(m => m.InsertrecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'updaterecord',
        loadChildren: () => import('./updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule),
        canActivate: [identifiedGuard]
    },
    {
        path: 'viewrecord',
        loadChildren: () => import('./viewrecord/viewrecord.module').then(m => m.ViewrecordPageModule),
        canActivate: [identifiedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DisplaytablePageRoutingModule {}
