import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { GetbackService } from '../getback.service';
import { addIcons } from "ionicons";
import { locateOutline, barChartOutline } from "ionicons/icons";

@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.page.html',
    styleUrls: ['./deliveries.page.scss'],
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class DeliveriesPage {

    firsttime = true;

    constructor(public platform: Platform, public router: Router, public getback: GetbackService) {
        addIcons({ locateOutline, barChartOutline });

    }

}
