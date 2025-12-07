import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MymoneyPageRoutingModule } from './mymoney-routing.module';

import { MymoneyPage } from './mymoney.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        MymoneyPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonSpinner, MymoneyPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class MymoneyPageModule { }
