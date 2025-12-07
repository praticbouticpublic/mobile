import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonTitle, IonContent, IonSpinner, IonLabel, IonItem, IonInput, IonIcon, IonRow, IonCol, IonButton, IonChip, IonFooter } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoginPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonTitle,
        IonContent,
        IonSpinner,
        IonLabel,
        IonItem,
        IonInput,
        IonIcon,
        IonRow,
        IonCol,
        IonButton,
        IonChip,
        IonFooter, LoginPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class LoginPageModule { }
