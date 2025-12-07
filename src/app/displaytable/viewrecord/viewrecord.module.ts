import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewrecordPageRoutingModule } from './viewrecord-routing.module';
import { ViewrecordPage } from './viewrecord.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ViewrecordPageRoutingModule,
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
        ViewrecordPage
    ]
})
export class ViewrecordPageModule { }
