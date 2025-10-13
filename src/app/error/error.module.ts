import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorPageRoutingModule } from './error-routing.module';

import { ErrorPage } from './error.page';
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ErrorPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        ErrorPage
    ]
})
export class ErrorPageModule { }
