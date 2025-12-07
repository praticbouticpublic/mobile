import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdaterecordPageRoutingModule } from './updaterecord-routing.module';
import { UpdaterecordPage } from './updaterecord.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UpdaterecordPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonFab,
        IonFabButton,
        IonIcon,
        UpdaterecordPage
    ],
})
export class UpdaterecordPageModule { }
