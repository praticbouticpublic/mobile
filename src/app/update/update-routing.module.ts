import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatePage } from './update.page';
import {SoustableComponent} from "./soustable/soustable.component";
import {UpdaterecComponent} from "./updaterec/updaterec.component";
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: UpdatePage,
    children: [
      {
        path: 'soustable',
        component: SoustableComponent,
        canActivate: [identifiedGuard]
      },
      {
          path: 'updaterec',
          component: UpdaterecComponent,
          canActivate: [identifiedGuard]
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
