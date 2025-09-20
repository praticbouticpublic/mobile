import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RaddressingPage } from './raddressing.page';


const routes: Routes = [
  {
    path: '',
    component: RaddressingPage
  },
  {
    path: 'admin/raddressing',
    loadChildren: () => import('../raddressing/raddressing.module').then(m => m.RaddressingPageModule)
  },
  {
    path: 'admin/changification/:email',
    loadChildren: () => import('./../changification/changification.module').then( m => m.ChangificationPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaddressingPageRoutingModule {}
