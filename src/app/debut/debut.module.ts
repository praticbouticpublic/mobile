import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebutPageRoutingModule } from './debut-routing.module';

import { DebutPage } from './debut.page';
import { MenuController } from '@ionic/angular/common';
import { IonContent, IonSpinner } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DebutPageRoutingModule,
        ReactiveFormsModule,
        IonContent,
        IonSpinner
    ],
    declarations: [DebutPage]
})
export class DebutPageModule { }
