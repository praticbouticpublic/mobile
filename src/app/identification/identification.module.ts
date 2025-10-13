import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentificationPageRoutingModule } from './identification-routing.module';
import { IdentificationPage } from './identification.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonContent, IonLabel, IonItem, IonInput, IonRow, IonCol, IonButton, IonIcon, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        IdentificationPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonLabel,
        IonItem,
        IonInput,
        IonRow,
        IonCol,
        IonButton,
        IonIcon,
        IonFab,
        IonFabButton, IdentificationPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class IdentificationPageModule { }
