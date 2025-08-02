import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TermsandconditionsPageRoutingModule } from './termsandconditions-routing.module';

import { TermsandconditionsPage } from './termsandconditions.page';
import { IonHeader, IonToolbar, IonImg, IonContent, IonItem, IonText, IonCol, IonLabel, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TermsandconditionsPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonItem,
        IonText,
        IonCol,
        IonLabel,
        IonFab,
        IonFabButton,
        IonIcon
    ],
    declarations: [TermsandconditionsPage]
})
export class TermsandconditionsPageModule { }
