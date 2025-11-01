import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { PresentationtableComponent } from '../components/presentationtable/presentationtable.component';
import { PresentationrecordComponent } from '../components/presentationrecord/presentationrecord.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import {IonicModule} from "@ionic/angular";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        SharedRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbCarouselModule,
        NgbPagination,
        PresentationtableComponent, PresentationrecordComponent
    ],
    exports: [PresentationtableComponent, PresentationrecordComponent],
})
export class SharedModule { }
