
import { Component, OnInit } from '@angular/core';
import { Platform, IonHeader, IonToolbar, IonImg, IonContent, IonItem, IonText, IonCol, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { addIcons } from "ionicons";
import { arrowUndoOutline } from "ionicons/icons";

@Component({
    selector: 'app-termsandconditions',
    templateUrl: './termsandconditions.page.html',
    styleUrls: ['./termsandconditions.page.scss'],
    imports: [IonHeader, IonToolbar, IonImg, IonContent, IonItem, IonText, IonCol, IonLabel, IonFab, IonFabButton, IonIcon]
})

export class TermsandconditionsPage implements OnInit {

    type: string;

    constructor(public platform: Platform, public router: Router, public global: GlobalService) {
        this.global.setFormComponent(this);
        this.type = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        addIcons({ arrowUndoOutline });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.type = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.type = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    }

    cancel() {
        if (this.type !== 'front')
            this.router.navigate(['admin/paymentdetails/' + this.type], { replaceUrl: true });
        else
            this.router.navigate(['admin/getinfo'], { replaceUrl: true });

    }

}
