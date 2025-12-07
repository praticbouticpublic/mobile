import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetinfoPageRoutingModule } from './getinfo-routing.module';

import { GetinfoPage } from './getinfo.page';
import { IonHeader, IonCard, IonImg, IonToolbar, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonRadioGroup, IonRadio, IonLabel, IonCheckbox, IonTextarea, IonFooter, IonButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GetinfoPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonCard,
        IonImg,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSpinner,
        IonItem,
        IonInput,
        IonRadioGroup,
        IonRadio,
        IonLabel,
        IonCheckbox,
        IonTextarea,
        IonFooter,
        IonButton,
        GetinfoPage
    ]
})
export class GetinfoPageModule { }
