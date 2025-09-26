import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentificationPage } from './identification.page';

const routes: Routes = [
  {
    path: '',
    component: IdentificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentificationPageRoutingModule {}
