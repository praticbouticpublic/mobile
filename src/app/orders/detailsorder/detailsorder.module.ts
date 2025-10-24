import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailsorderPageRoutingModule } from './detailsorder-routing.module';

import { DetailsorderPage } from './detailsorder.page';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonCheckbox, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DetailsorderPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonItem,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonGrid,
        IonRow,
        IonCol,
        IonCheckbox,
        IonFab,
        IonFabButton,
        IonIcon,
        DetailsorderPage
    ]
})
export class DetailsorderPageModule { }
