import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionPageRoutingModule } from './subscription-routing.module';
import { SubscriptionPage } from './subscription.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItemDivider, IonLabel, IonItem, IonButton, IonChip, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        SubscriptionPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonSpinner,
        IonList,
        IonItemDivider,
        IonLabel,
        IonItem,
        IonButton,
        IonChip,
        IonFab,
        IonFabButton,
        IonIcon, SubscriptionPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class SubscriptionPageModule { }
