import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrcodegenPageRoutingModule } from './qrcodegen-routing.module';
import { QrcodegenPage } from './qrcodegen.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonItem, IonRadioGroup, IonRadio, IonInput, IonButton } from "@ionic/angular/standalone";

@NgModule({
    declarations: [QrcodegenPage], imports: [CommonModule,
        FormsModule,
        QrcodegenPageRoutingModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonItem,
        IonRadioGroup,
        IonRadio,
        IonInput,
        IonButton
    ], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class QrcodegenPageModule { }
