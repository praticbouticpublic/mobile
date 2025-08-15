import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveriesPageRoutingModule } from './deliveries-routing.module';
import { DeliveriesPage } from './deliveries.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@NgModule({
    declarations: [DeliveriesPage], imports: [CommonModule,
        FormsModule,
        DeliveriesPageRoutingModule,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel
    ], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class DeliveriesPageModule { }
