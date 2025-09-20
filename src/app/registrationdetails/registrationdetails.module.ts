import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationdetailsPageRoutingModule } from './registrationdetails-routing.module';
import { RegistrationdetailsPage } from './registrationdetails.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonLabel, IonList, IonRadioGroup, IonRadio, IonInput, IonIcon, IonRow, IonCol, IonButton, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        RegistrationdetailsPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonSpinner,
        IonItem,
        IonLabel,
        IonList,
        IonRadioGroup,
        IonRadio,
        IonInput,
        IonIcon,
        IonRow,
        IonCol,
        IonButton,
        IonFab,
        IonFabButton, RegistrationdetailsPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class RegistrationdetailsPageModule { }
