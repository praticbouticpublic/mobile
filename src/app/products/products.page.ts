import { Component } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from "ionicons";
import { listOutline, pricetagsOutline, gridOutline } from "ionicons/icons";

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
    standalone: false
})
export class ProductsPage {

    firsttime = true;
    selid = 0;
    selcol = '';
    table = '';

    constructor(public platform: Platform, public router: Router) {
        addIcons({ listOutline, pricetagsOutline, gridOutline });

    }

    ionViewDidEnter() {

    }
}
