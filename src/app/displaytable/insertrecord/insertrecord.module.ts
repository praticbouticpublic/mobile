import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertrecordPageRoutingModule } from './insertrecord-routing.module';
import { InsertrecordPage } from './insertrecord.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import {IonicModule} from "@ionic/angular";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InsertrecordPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        InsertrecordPage,
        IonicModule,
    ]
})
export class InsertrecordPageModule { }
