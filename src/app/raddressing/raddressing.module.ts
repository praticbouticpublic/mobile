import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RaddressingPageRoutingModule } from './raddressing-routing.module';
import { RaddressingPage } from './raddressing.page';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RaddressingPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonItem,
        IonInput,
        IonFab,
        IonFabButton,
        IonIcon,
        RaddressingPage
    ]
})
export class RaddressingPageModule { }
