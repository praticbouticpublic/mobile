import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisplaytablePageRoutingModule } from './displaytable-routing.module';
import { DisplaytablePage } from './displaytable.page';
import { SharedModule } from '../shared/shared.module';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DisplaytablePageRoutingModule,
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
        DisplaytablePage
    ]
})
export class DisplaytablePageModule { }
