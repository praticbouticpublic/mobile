import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoutPageRoutingModule } from './logout-routing.module';

import { LogoutPage } from './logout.page';
import { IonContent, IonSpinner } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LogoutPageRoutingModule,
        IonContent,
        IonSpinner,
        LogoutPage
    ]
})
export class LogoutPageModule { }
