import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebutPage } from './debut.page';

const routes: Routes = [
  {
    path: '',
    component: DebutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebutPageRoutingModule {}
