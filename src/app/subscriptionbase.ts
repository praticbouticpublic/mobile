import { Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular/standalone";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { GlobalService } from "./global.service";
import { StorageService } from "./storage.service";
import { SubscriptionService } from "./subscription.service";
import * as myGlobals from './../app/global';
import * as st from 'src/app/subscriptiontype.enum';
import * as si from 'src/app/subscription.interface'
import {HeaderService} from "./header.service";

export abstract class SubscriptionBase {
    loaded = false;

    constructor(public router: Router, public global: GlobalService, public sub: SubscriptionService, public alertController: AlertController,
        public platform: Platform, public storage: StorageService, public httpClient: HttpClient, public header:HeaderService) {

    }

    async fixe(type: any, login: any, priceId: any) {
        let action: any;
        if (type == 'init')
            action = "creationabonnement";
        else if (type == 'back')
            action = "bocreationabonnement";
        const obj = { action: action, login: login, priceid: priceId };
        this.httpClient.post<si.Abonnement>(environment.apiroot + action, obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.header.setToken(data.token);
                this.sub.setAbonementFixeParam(data.subscriptionId, data.clientSecret);
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
                if (type == 'init') {
                    this.remadelaststep();
                }

                else if (type == 'back')
                    this.reconnect();
            }
        });
    }


    async conso(type: any, login: any, priceId: any) {
        let action: any;

        if (type == 'init')
            action = "conso";
        else if (type == 'back')
            action = "boconso";

        const obj = { action: action, login: login, priceid: priceId };
        this.httpClient.post<si.Conso>(environment.apiroot + action, obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.sub.setAbonementConsoParam(data.customerId, data.priceId);
            },
            error: (err: any) => {
                this.presentAlert(err.error);
                if (type == 'init')
                    this.remadelaststep();
                else if (type == 'back')
                    this.reconnect();
            }
        });
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème API',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    reconnect() {
        this.loaded = false;
        this.storage.set('status', 'error');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    pasdetarif() {
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

    gotocgv(type: any) {
        this.loaded = false;
        this.router.navigate(['admin/termsandconditions/' + type], { replaceUrl: false });
    }

    abstract remadelaststep(): void;


}
