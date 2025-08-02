import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrcodegenPage } from './qrcodegen.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodegenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrcodegenPageRoutingModule {}
