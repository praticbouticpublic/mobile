import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaiementPage } from './paiement.page';
import { GetinfoPage } from '../getinfo/getinfo.page';

const routes: Routes = [
  {
    path: '',
    component: PaiementPage
  },
  {
    path: 'admin/getinfo',
    component: GetinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaiementPageRoutingModule {}
