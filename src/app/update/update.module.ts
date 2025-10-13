import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdatePageRoutingModule } from './update-routing.module';

import { UpdatePage } from './update.page';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UpdatePageRoutingModule,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel,
        UpdatePage
    ]
})
export class UpdatePageModule { }
