import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerareaPageRoutingModule } from './customerarea-routing.module';
import { CustomerareaPage } from './customerarea.page';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CustomerareaPageRoutingModule,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel,
        CustomerareaPage
    ]
})
export class CustomerareaPageModule { }
