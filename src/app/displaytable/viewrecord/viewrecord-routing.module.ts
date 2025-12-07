import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewrecordPage } from './viewrecord.page';

const routes: Routes = [
  {
    path: '',
    component: ViewrecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewrecordPageRoutingModule {}
