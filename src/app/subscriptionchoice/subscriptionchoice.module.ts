import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionchoicePageRoutingModule } from './subscriptionchoice-routing.module';
import { SubscriptionchoicePage } from './subscriptionchoice.page';
import { IonHeader, IonToolbar, IonImg, IonTitle, IonContent, IonSpinner, IonItem, IonText, IonCheckbox, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SubscriptionchoicePageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonTitle,
        IonContent,
        IonSpinner,
        IonItem,
        IonText,
        IonCheckbox,
        IonFab,
        IonFabButton,
        IonIcon,
        SubscriptionchoicePage
    ]
})
export class SubscriptionchoicePageModule { }
