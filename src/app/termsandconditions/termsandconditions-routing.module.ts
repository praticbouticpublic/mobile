import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsandconditionsPage } from './termsandconditions.page';

const routes: Routes = [
  {
    path: '',
    component: TermsandconditionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsandconditionsPageRoutingModule {}
