import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinPage } from './fin.page';

const routes: Routes = [
  {
    path: '',
    component: FinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinPageRoutingModule {}
