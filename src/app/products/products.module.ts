import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ProductsPageRoutingModule,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel, RouterLink, IonRouterOutlet, ProductsPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ProductsPageModule { }
