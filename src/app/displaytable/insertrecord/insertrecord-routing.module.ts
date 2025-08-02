import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsertrecordPage } from './insertrecord.page';

const routes: Routes = [
  {
    path: '',
    component: InsertrecordPage
  },
  {
    path: 'admin/products/displaytable/:table/:selcol/:selid',
    loadChildren: () => import('./../displaytable.module').then( m => m.DisplaytablePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertrecordPageRoutingModule {}
