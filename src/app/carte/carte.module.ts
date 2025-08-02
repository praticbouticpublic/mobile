import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartePageRoutingModule } from './carte-routing.module';

import { CartePage } from './carte.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonHeader, IonCard, IonImg, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton, IonItem, IonTextarea, IonLabel, IonSelect, IonSelectOption, IonFooter } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CartePageRoutingModule,
        IonHeader,
        IonCard,
        IonImg,
        IonToolbar,
        IonTitle,
        IonContent,
        IonSpinner,
        IonButton,
        IonItem,
        IonTextarea,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonFooter
    ],
    declarations: [CartePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartePageModule { }
