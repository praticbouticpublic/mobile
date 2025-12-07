import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';
import { RouterModule } from '@angular/router';
import { IonHeader, IonImg, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonFabButton, IonIcon, IonButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WelcomePageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonImg,
        IonContent,
        IonItem,
        IonSelect,
        IonSelectOption,
        IonLabel,
        IonFabButton,
        IonIcon,
        IonButton,
        WelcomePage
    ]
})
export class WelcomePageModule { }
