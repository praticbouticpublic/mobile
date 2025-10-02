import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangificationPage } from './changification.page';

const routes: Routes = [
  {
    path: '',
    component: ChangificationPage
  },
  {
    path: 'admin/changification/:courriel',
    loadChildren: () => import('../changification/changification.module').then(m => m.ChangificationPageModule)
  },
  {
    path: 'admin/raddressing',
    loadChildren: () => import('../raddressing/raddressing.module').then(m => m.RaddressingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangificationPageRoutingModule {}
