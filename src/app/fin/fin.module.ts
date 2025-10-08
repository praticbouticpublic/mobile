import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinPageRoutingModule } from './fin-routing.module';

import { FinPage } from './fin.page';
import { IonHeader, IonCard, IonImg, IonToolbar, IonTitle, IonContent, IonSpinner, IonFooter, IonButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FinPageRoutingModule,
        IonHeader,
        IonCard,
        IonImg,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSpinner,
        IonFooter,
        IonButton,
        FinPage
    ]
})
export class FinPageModule { }
