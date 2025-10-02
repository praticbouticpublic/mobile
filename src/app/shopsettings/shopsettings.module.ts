import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopsettingsPageRoutingModule } from './shopsettings-routing.module';
import { ShopsettingsPage } from './shopsettings.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonInput, IonRow, IonRadioGroup, IonRadio, IonCol, IonButton, IonIcon, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        ShopsettingsPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonSpinner,
        IonItem,
        IonLabel,
        IonList,
        IonSelect,
        IonSelectOption,
        IonInput,
        IonRow,
        IonRadioGroup,
        IonRadio,
        IonCol,
        IonButton,
        IonIcon,
        IonFab,
        IonFabButton, ShopsettingsPage], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class ShopsettingsPageModule { }
