import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RaddressingPage } from './raddressing.page';
import {identifiedGuard} from "../identified-guard";


const routes: Routes = [
  {
    path: '',
    component: RaddressingPage,
    canActivate: [identifiedGuard]
  },
  {
    path: 'admin/raddressing',
    loadChildren: () => import('../raddressing/raddressing.module').then(m => m.RaddressingPageModule),
    canActivate: [identifiedGuard]
  },
  {
    path: 'admin/changification/:email',
    loadChildren: () => import('./../changification/changification.module').then( m => m.ChangificationPageModule),
    canActivate: [identifiedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaddressingPageRoutingModule {}
