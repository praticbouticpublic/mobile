import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsPageRoutingModule } from './products-routing.module';
import { ProductsPage } from './products.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@NgModule({
    declarations: [ProductsPage], imports: [CommonModule,
        FormsModule,
        ProductsPageRoutingModule,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel
    ], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ProductsPageModule { }
