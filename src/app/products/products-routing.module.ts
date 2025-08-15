import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsPage } from './products.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    children: [
      {
        path: 'displaytable/:table/:selcol/:selid',
        loadChildren: () => import('../displaytable/displaytable.module').then(m => m.DisplaytablePageModule)
      },
      {
        path: '',
        redirectTo: 'displaytable/article/none/0',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'admin/products/displaytable/article/none/0',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductsPageRoutingModule {}
