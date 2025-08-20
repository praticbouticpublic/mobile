import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdaterecordPage } from './updaterecord.page';

const routes: Routes = [
  {
    path: '',
    component: UpdaterecordPage
  },
  {
    path: 'admin/products/updaterecord/:table/:id/:selcol/:selid',
    loadChildren: () => import('./updaterecord.module').then( m => m.UpdaterecordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdaterecordPageRoutingModule {}
