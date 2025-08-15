import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { PresentationtableComponent } from '../components/presentationtable/presentationtable.component';
import { PresentationrecordComponent } from '../components/presentationrecord/presentationrecord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { IonSpinner, IonItem, IonInput, IonCheckbox, IonLabel, IonSelect, IonSelectOption, IonButton, IonImg, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@NgModule({
    declarations: [PresentationtableComponent, PresentationrecordComponent],
    imports: [
        CommonModule,
        SharedRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbCarouselModule,
        NgIf,
        NgbPagination,
        IonSpinner,
        IonItem,
        IonInput,
        IonCheckbox,
        IonLabel,
        IonSelect,
        IonSelectOption,
        IonButton,
        IonImg,
        IonSpinner,
        IonGrid,
        IonRow,
        IonCol,
        IonCheckbox,
        IonSelect,
        IonSelectOption
    ],
    exports: [PresentationtableComponent, PresentationrecordComponent],
})
export class SharedModule { }
