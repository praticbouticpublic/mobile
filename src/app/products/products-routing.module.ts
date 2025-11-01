import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsPage } from './products.page';
import {RedirectComponent} from "../redirect/redirect.component";
import {CategorieComponent} from "./categorie/categorie.component";
import {ArticleComponent} from "./article/article.component";
import {GroupeoptComponent} from "./groupeopt/groupeopt.component";
import {identifiedGuard} from "../identified-guard";

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    children: [
      {
        path: 'categorie',
        component: CategorieComponent,
        canActivate: [identifiedGuard]
      },
      {
        path: 'article',
        component: ArticleComponent,
        canActivate: [identifiedGuard]
      },
      {
        path: 'groupeopt',
        component: GroupeoptComponent,
        canActivate: [identifiedGuard]
      },
      {
        path: '',
        redirectTo: 'article',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'article',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductsPageRoutingModule {}
