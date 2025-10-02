import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPageRoutingModule } from './registration-routing.module';
import { RegistrationPage } from './registration.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonContent, IonLabel, IonItem, IonInput, IonButton, IonIcon, IonRow, IonCol, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        RegistrationPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonLabel,
        IonItem,
        IonInput,
        IonButton,
        IonIcon,
        IonRow,
        IonCol,
        IonFab,
        IonFabButton, RegistrationPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class RegistrationPageModule { }
