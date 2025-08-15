import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerareaPage } from './customerarea.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerareaPage,
    children: [
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'displaytable/:table/:selcol/:selid',
        loadChildren: () => import('../displaytable/displaytable.module').then( m => m.DisplaytablePageModule)
      },
      {
        path: 'backoffice',
        loadChildren: () => import('./backoffice/backoffice.module').then( m => m.BackofficePageModule)
      },
      {
        path: 'qrcodegen',
        loadChildren: () => import('./qrcodegen/qrcodegen.module').then( m => m.QrcodegenPageModule)
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then( m => m.ClientPageModule)
      },
      {
        path: '',
        redirectTo: 'shop',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'customerarea',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerareaPageRoutingModule {}
