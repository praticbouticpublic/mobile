import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaiementPageRoutingModule } from './paiement-routing.module';

import { PaiementPage } from './paiement.page';
import { NgxStripeModule } from 'ngx-stripe';
import { IonHeader, IonCard, IonImg, IonToolbar, IonTitle, IonContent, IonSpinner, IonGrid, IonRow, IonCol, IonButton, IonFooter } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PaiementPageRoutingModule,
        ReactiveFormsModule,
        NgxStripeModule,
        ReactiveFormsModule,
        IonHeader,
        IonCard,
        IonImg,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSpinner,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        IonFooter,
        PaiementPage
    ]
})
export class PaiementPageModule { }
