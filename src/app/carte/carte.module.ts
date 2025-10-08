import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartePageRoutingModule } from './carte-routing.module';

import { CartePage } from './carte.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CartePageRoutingModule,
        CartePage
    ]
})
export class CartePageModule { }
