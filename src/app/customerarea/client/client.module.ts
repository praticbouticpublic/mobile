import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientPageRoutingModule } from './client-routing.module';
import { ClientPage } from './client.page';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonIcon, IonRadioGroup, IonRadio, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ClientPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonSpinner,
        IonItem,
        IonInput,
        IonIcon,
        IonRadioGroup,
        IonRadio,
        IonFab,
        IonFabButton,
        ClientPage
    ]
})
export class ClientPageModule { }
