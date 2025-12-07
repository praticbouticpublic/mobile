import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentdetailsPageRoutingModule } from './paymentdetails-routing.module';
import { PaymentdetailsPage } from './paymentdetails.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxStripeModule, StripeElementsDirective, StripePaymentElementComponent } from 'ngx-stripe';
import { environment } from 'src/environments/environment';
import { IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonRow, IonCol, IonLabel, IonInput, IonText, IonCheckbox, IonButton, IonIcon, IonFab, IonFabButton } from "@ionic/angular/standalone";

@NgModule({
    imports: [CommonModule,
        FormsModule,
        PaymentdetailsPageRoutingModule,
        ReactiveFormsModule,
        NgxStripeModule.forRoot(environment.pkey),
        StripeElementsDirective,
        StripePaymentElementComponent,
        IonHeader,
        IonToolbar,
        IonImg,
        IonContent,
        IonSpinner,
        IonItem,
        IonRow,
        IonCol,
        IonLabel,
        IonInput,
        IonText,
        IonCheckbox,
        IonButton,
        IonIcon,
        IonFab,
        IonFabButton, PaymentdetailsPage],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})

export class PaymentdetailsPageModule { }
