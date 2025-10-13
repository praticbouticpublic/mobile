import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangificationPageRoutingModule } from './changification-routing.module';
import { ChangificationPage } from './changification.page';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChangificationPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        IonFab,
        IonFabButton,
        IonIcon,
        ChangificationPage
    ]
})
export class ChangificationPageModule { }
