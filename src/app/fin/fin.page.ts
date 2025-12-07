import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { environment } from 'src/environments/environment';
import { OrderService } from '../order.service';
import { SessionfrontService } from '../sessionfront.service';
import { strings } from '../strings';
import { AlertController } from '@ionic/angular/standalone';
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-fin',
    templateUrl: './fin.page.html',
    styleUrls: ['./fin.page.scss'],
    imports: [IonicModule, RouterLink]
})
export class FinPage implements OnInit {

    loadingState = true;
    srvroot = environment.srvroot
    apiroot = environment.apiroot;
    heightfortheBottom = '0px";';
    logo = '';
    nom = '';

    constructor(public httpClient: HttpClient, public alert: AlertController, public router: Router, public route: ActivatedRoute,
        public order: OrderService, public session: SessionfrontService, public header:HeaderService)
    {

    }

    getShowBarre(): boolean {
        return (sessionStorage.getItem('barre') !== 'fermer');
    }

    setShowBarre(etat: boolean) {
        sessionStorage.setItem('barre', etat ? 'fermer' : '');
    }

    ngOnInit() {
        this.session.getLogo().then(logo => {
            this.logo = logo;
            this.session.getNomBoutic().then(nomboutic => {
                this.nom = nomboutic;
                this.order.getNom().then(nom => {
                    this.order.getPrenom().then(prenom => {
                        this.order.getAdr1().then(adresse1 => {
                            this.order.getAdr2().then(adresse2 => {
                                this.order.getCodePostal().then(codepostal => {
                                    this.order.getVille().then(ville => {
                                        this.order.getTelephone().then(telephone => {
                                            this.order.getPaiement().then(paiement => {
                                                this.order.getVente().then(vente => {
                                                    this.order.getInfoSup().then(infosup => {
                                                        this.order.getCommande().then(items => {
                                                            this.order.getFraisLivr().then(fraislivr => {
                                                                this.order.getRemise().then(async remise => {

                                                                        let commande = {
                                                                            nom, prenom, adresse1, adresse2, codepostal, ville, telephone, paiement, vente, infosup,
                                                                            items, fraislivr, remise
                                                                        };
                                                                        if (commande.items.length > 0) {
                                                                            this.httpClient.post<any>(this.apiroot + 'depart-commande', commande, await this.header.buildHttpOptions()).subscribe({
                                                                                next: (data: any) => {
                                                                                    this.header.setToken(data.token);
                                                                                    this.order.razOrder();
                                                                                    this.order.removeMemControl();
                                                                                    this.loadingState = false;
                                                                                },
                                                                                error: (err: any) => {
                                                                                    this.presentErrAlert(strings.ErrConnect, err.error.error);
                                                                                    this.router.navigate(['admin/paiement'], { replaceUrl: true });
                                                                                }
                                                                            });
                                                                        }

                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    gotoDebut() {
        this.session.getAliasBoutic().then(aliasboutic => {
            this.session.getMethod().then(method => {
                this.session.getTable().then(table => {
                    this.router.navigate(['admin/debut/' + aliasboutic + '/' + method + '/' + table], { replaceUrl: true });
                });
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
                        this.session.getAliasBoutic(true).then(aliasboutic => {
                            this.session.getMethod(true).then(method => {
                                this.session.getTable(true).then(table => {
                                    this.router.navigate(['admin/debut/' + aliasboutic + '/' + method + '/' + table], { replaceUrl: true })
                                });
                            });
                        });
                    }
                }
            ],
        });
        await alert.present();
    }


}
