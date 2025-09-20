import { Component } from '@angular/core';
import { Platform, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from "ionicons";
import { listOutline, pricetagsOutline, gridOutline } from "ionicons/icons";

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
    imports: [IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, RouterLink, IonIcon, IonLabel]
})
export class ProductsPage {

     constructor(public platform: Platform, public router: Router) {
        addIcons({ listOutline, pricetagsOutline, gridOutline });

    }

    ionViewDidEnter() {

    }
}
