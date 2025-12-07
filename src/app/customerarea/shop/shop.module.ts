import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopPageRoutingModule } from './shop-routing.module';
import { ShopPage } from './shop.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonItem, IonInput, IonButton, IonIcon, IonImg, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ShopPageRoutingModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonSpinner,
        IonItem,
        IonInput,
        IonButton,
        IonIcon,
        IonImg,
        IonFab,
        IonFabButton, ShopPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ShopPageModule { }
