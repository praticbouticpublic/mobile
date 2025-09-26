import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplaytablePage } from './displaytable.page';

const routes: Routes = [
    {
        path: '',
        component: DisplaytablePage
    },
    {
        path: 'insertrecord',
        loadChildren: () => import('./insertrecord/insertrecord.module').then(m => m.InsertrecordPageModule)
    },
    {
        path: 'updaterecord',
        loadChildren: () => import('./updaterecord/updaterecord.module').then(m => m.UpdaterecordPageModule)
    },
    {
        path: 'viewrecord',
        loadChildren: () => import('./viewrecord/viewrecord.module').then(m => m.ViewrecordPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DisplaytablePageRoutingModule {}
