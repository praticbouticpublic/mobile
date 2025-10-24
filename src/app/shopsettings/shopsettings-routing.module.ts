import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopsettingsPage } from './shopsettings.page';

const routes: Routes = [
  {
    path: '',
    component: ShopsettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopsettingsPageRoutingModule {}
