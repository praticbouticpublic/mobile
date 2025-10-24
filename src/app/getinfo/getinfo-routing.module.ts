import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetinfoPage } from './getinfo.page';
import { PaiementPage } from '../paiement/paiement.page';
import { TermsandconditionsPage } from '../termsandconditions/termsandconditions.page';

const routes: Routes = [
  {
    path: '',
    component: GetinfoPage
  },
  {
    path: 'admin/paiement',
    component: PaiementPage
  },
  {
    path: 'admin/termsandconditions',
    component: TermsandconditionsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetinfoPageRoutingModule {}
