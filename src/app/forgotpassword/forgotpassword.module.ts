import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotpasswordPageRoutingModule } from './forgotpassword-routing.module';
import { ForgotpasswordPage } from './forgotpassword.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonTitle, IonContent, IonSpinner, IonItem, IonLabel, IonInput, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ForgotpasswordPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonTitle,
        IonContent,
        IonSpinner,
        IonItem,
        IonLabel,
        IonInput,
        IonFab,
        IonFabButton,
        IonIcon, ForgotpasswordPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ForgotpasswordPageModule { }
