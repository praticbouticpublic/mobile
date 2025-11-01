import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderlinesPageRoutingModule } from './orderlines-routing.module';
import { OrderlinesPage } from './orderlines.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonLabel, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        OrderlinesPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonItem,
        IonLabel,
        IonFab,
        IonFabButton,
        IonIcon, OrderlinesPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class OrderlinesPageModule { }
