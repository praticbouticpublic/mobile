import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdaterecordPage } from './updaterecord.page';

const routes: Routes = [
  {
    path: '',
    component: UpdaterecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdaterecordPageRoutingModule {}
