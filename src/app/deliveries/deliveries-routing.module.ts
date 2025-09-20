import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveriesPage } from './deliveries.page';
import {BarlivrComponent} from "./barlivr/barlivr.component";
import {CpzoneComponent} from "./cpzone/cpzone.component";

const routes: Routes = [
  {
    path: '',
    component: DeliveriesPage,
    children: [
        {
            path: 'barlivr',
            component: BarlivrComponent
        },
        {
            path: 'cpzone',
            component: CpzoneComponent
        },
      {
        path: '',
        redirectTo: 'barlivr',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'barlivr',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class DeliveriesPageRoutingModule {}
