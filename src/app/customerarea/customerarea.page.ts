import { Component, OnInit } from '@angular/core';
import { MenuController, Platform, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { addIcons } from "ionicons";
import { businessOutline, settingsOutline, colorPaletteOutline, toggleOutline, qrCodeOutline, personOutline } from "ionicons/icons";
import {IonicModule} from "@ionic/angular";


@Component({
    selector: 'app-customerarea',
    templateUrl: './customerarea.page.html',
    styleUrls: ['./customerarea.page.scss'],
    imports: [IonicModule]
})
export class CustomerareaPage implements OnInit {

    statutcmd: any;

    constructor(public menuCtrl: MenuController, public platform: Platform, public router: Router) {
        this.statutcmd = environment.statutcmd;
        addIcons({ businessOutline, settingsOutline, colorPaletteOutline, toggleOutline, qrCodeOutline, personOutline });
    }

    ngOnInit() {
        this.menuCtrl.enable(true);
    }

}
