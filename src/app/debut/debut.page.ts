import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { strings } from '../strings';
import { OrderService } from '../order.service';
import { SessionfrontService } from '../sessionfront.service';
import { AlertController, MenuController, IonContent, IonSpinner } from '@ionic/angular/standalone';
import {HeaderService} from "../header.service";

@Component({
    selector: 'app-debut',
    templateUrl: './debut.page.html',
    styleUrls: ['./debut.page.scss'],
    imports: [IonContent, IonSpinner]
})
export class DebutPage implements OnInit {

    constructor(public httpClient: HttpClient, public router: Router, public route: ActivatedRoute,
        public order: OrderService, public session: SessionfrontService,
        public alert: AlertController, public menuCtrl: MenuController, public header:HeaderService)
    {

    }

    ngOnInit(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.order.razOrder();
        this.session.razSessionFront();
        sessionStorage.removeItem('barre');
        this.route.params.subscribe((params: Params) => {
            document.cookie = "ggCookie=ggCookie";
            this.session.setAliasBoutic(params['customer']);
            this.session.setMethod(params['method'] !== '' ? params['method'] : '3');
            this.session.setTable(params['table'] !== '' ? params['method'] : '0');
            this.initSession();
        });
    }

    initSession() {
        this.session.getAliasBoutic().then(customer => {
            this.session.getMethod().then(method => {
                this.session.getTable().then(async table => {
                    let objBouticIS = { requete: "initSession", customer, method, table };
                    this.httpClient.post<any>(environment.apiroot + 'front', objBouticIS, await this.header.buildHttpOptions()).subscribe({
                        next: (data: any) => {
                            this.header.setToken(data[0].body.token);
                            this.getBouticInfo();
                        },
                        error: (err: any) => {
                            this.presentAlert(strings.Error, err.error.error);
                        }
                    });
                });
            });
        });
    }

    getBouticInfo() {
        this.session.getAliasBoutic().then(async customer => {
            const objbouticinf = { requete: "getBouticInfo", customer };
            this.httpClient.post<string[]>(environment.apiroot + 'front', objbouticinf, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    let bouticid = +data[0];
                    if (bouticid) {
                        this.session.setBouticId(bouticid);
                        this.session.setLogo(data[1]);
                        this.session.setNomBoutic(data[2]);
                        this.getAboActif();
                    }
                    else
                        this.presentConfirmationAlert();
                },
                error: (err: any) => {
                    this.presentAlert(strings.Error, err.error.error);
                }
            });
        });
    }

    async getAboActif() {
        this.session.getBouticId().then(async bouticid => {
            const objaboactif = { requete: "aboactif", bouticid };
            this.httpClient.post<Object>(environment.apiroot + 'front', objaboactif, await this.header.buildHttpOptions()).subscribe({
                next: (abo: Object) => {
                    if (abo === null)
                        this.presentAlert(strings.Error, strings.NoActiveSubscription);
                    else
                        this.router.navigate(['admin/carte'], { replaceUrl: true });
                },
                error: (err: any) => {
                    this.presentAlert(strings.Error, err.error.error);
                }
            });
        });
    }

    async presentAlert(header: string, message: string): Promise<void> {
        const alert = await this.alert.create({
            header,
            message,
            buttons: ['OK'],
        });
        await alert.present();
    }

    async presentConfirmationAlert(): Promise<void> {
        const alert = await this.alert.create({
            header: strings.Error,
            message: strings.NoBoutic,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.router.navigate(['admin/welcome'], { replaceUrl: true });
                    }
                }
            ],
        });
        await alert.present();
    }

    async presentErrAlert(header: string, message: string): Promise<void> {
        const alert = await this.alert.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.router.navigate(['admin/carte'], { replaceUrl: true });
                    }
                }
            ],
        });
        await alert.present();
    }

}
