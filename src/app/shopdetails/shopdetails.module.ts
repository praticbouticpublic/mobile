import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopdetailsPageRoutingModule } from './shopdetails-routing.module';
import { ShopdetailsPage } from './shopdetails.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonLabel, IonList, IonInput, IonButton, IonCheckbox, IonRow, IonCol, IonIcon, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ShopdetailsPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonSpinner,
        IonItem,
        IonLabel,
        IonList,
        IonInput,
        IonButton,
        IonCheckbox,
        IonRow,
        IonCol,
        IonIcon,
        IonFab,
        IonFabButton, ShopdetailsPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ShopdetailsPageModule { }
