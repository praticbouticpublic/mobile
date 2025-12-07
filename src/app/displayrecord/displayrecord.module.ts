import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayrecordPageRoutingModule } from './displayrecord-routing.module';

import { DisplayrecordPage } from './displayrecord.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DisplayrecordPageRoutingModule,
    ],
  declarations: []
})
export class DisplayrecordPageModule {}
