import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePage } from './update.page';
import {SoustableComponent} from "./soustable/soustable.component";
import {UpdaterecComponent} from "./updaterec/updaterec.component";

const routes: Routes = [
  {
    path: '',
    component: UpdatePage,
    children: [
      {
        path: 'soustable',
        component: SoustableComponent
      },
      {
          path: 'updaterec',
          component: UpdaterecComponent
      },
      {
        path: '',
        redirectTo: 'admin/update/updaterec',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin/update/updaterec',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePageRoutingModule {}
