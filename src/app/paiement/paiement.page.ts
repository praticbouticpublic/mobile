import { HttpClient } from '@angular/common/http';
import { Component, EnvironmentInjector, OnInit, ViewChild, inject, runInInjectionContext, signal } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orderline, OrderService } from '../order.service';
import { SessionfrontService } from '../sessionfront.service';
import { strings } from '../strings';
import { TypeMethod } from '../typemethod.enum';
import { injectStripe, StripePaymentElementComponent, StripeElementsDirective } from 'ngx-stripe';
import {
    StripeElementsOptions,
    StripePaymentElementOptions
} from '@stripe/stripe-js';
import { AlertController, MenuController } from '@ionic/angular/standalone';
import {HeaderService} from "../header.service";
import { DecimalPipe } from '@angular/common';
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-paiement',
    templateUrl: './paiement.page.html',
    styleUrls: ['./paiement.page.scss'],
    imports: [IonicModule, RouterLink, StripeElementsDirective, StripePaymentElementComponent, DecimalPipe]
})

export class PaiementPage implements OnInit {
    parseFloat = parseFloat;

    vente = '';
    paiement = '';
    remise = 0;
    fraislivr = 0;
    method = 0;
    mnysys = 'STRIPE MARKETPLACE';
    loadingState = true;
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    logo = '';
    table = 0;
    somme = 0;
    nom = '';

    heightfortheBottom = '0px';
    commande: Orderline[] = new Array;
    displayedColumns: string[] = ['nom', 'prix', 'quantite', 'total'];
    complete = false;
    stripe: any;
    paying: any;

    @ViewChild(StripePaymentElementComponent)
    paymentElement!: StripePaymentElementComponent;

    private readonly fb = inject(UntypedFormBuilder);

    elementsOptions: StripeElementsOptions = {
        locale: 'fr',
        appearance: {
            theme: 'flat',
        },
    };

    paymentElementOptions: StripePaymentElementOptions = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
        fields: {
            billingDetails: {
                address: {
                    country: 'never'
                }
            }

        }
    };

    private environmentInjector = inject(EnvironmentInjector);

    constructor(public httpClient: HttpClient, public alert: AlertController, public router: Router, public route: ActivatedRoute,
        public order: OrderService, public session: SessionfrontService, public menuCtrl: MenuController,
        public header:HeaderService) {

    }

    getShowBarre(): boolean {
        return (sessionStorage.getItem('barre') !== 'fermer');
    }

    setShowBarre(etat: boolean) {
        sessionStorage.setItem('barre', etat ? 'fermer' : '');
    }

    ngOnInit() {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.session.getLogo().then(logo => {
            this.logo = logo;
            this.order.getPaiement().then(modep => {
                this.paiement = modep;
                this.order.getVente().then(model => {
                    this.vente = model;
                    this.order.getCommande().then(items => {
                        this.commande = items;
                        this.session.getTable().then(table => {
                            this.table = table;
                            this.order.getSousTotal().then(soustotal => {
                                this.somme = soustotal;
                                this.order.getRemise().then(remise => {
                                    this.remise = remise;
                                    this.session.getMethod().then(method => {
                                        this.method = method;
                                        this.order.getFraisLivr().then(fraislivr => {
                                            this.fraislivr = fraislivr;
                                            this.order.getCodePromo().then(codepromo => {
                                                this.session.getNomBoutic().then(nomboutic => {
                                                    this.nom = nomboutic;
                                                    this.session.getAliasBoutic().then(async boutic => {
                                                        const moneySystemParam = await this.getParam('MONEY_SYSTEM');
                                                        moneySystemParam.subscribe({
                                                            next: (data: any) => {
                                                                    this.mnysys = ((data[0] !== null) ? data[0] : 'STRIPE MARKETPLACE');
                                                                    this.loadingState = false;
                                                                    if ((method === TypeMethod.CLICKNCOLLECT) && (modep === "COMPTANT")) {
                                                                        let pkey = environment.pkey;
                                                                        this.setupStripePayment(pkey, items, boutic, model, fraislivr, codepromo);
                                                                    }
                                                                },
                                                                error: (err: any) => this.presentErrAlert(strings.ErrConnect, err.error.error)
                                                            })

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

    pay() {
        if (this.paying()) return;
        this.paying.set(true);

        this.stripe.confirmPayment({
            elements: this.paymentElement.elements,
            confirmParams: {
                //return_url: window.location.origin + '/boutic/fin',
                payment_method_data: {
                    billing_details: {
                        address: {
                            country: 'FR'
                        },
                    },
                },
            },
            redirect: 'if_required'
        })
            .subscribe((result: any) => {
                this.paying.set(false);
                //console.log('Résultat', result);
                if (result.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    this.presentAlert('Echec', result.error.message);
                } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer
                        //this.openDialog('Réussite', '');
                        this.router.navigate(['admin/fin'], { replaceUrl: true });
                    }
                }
            });
    }


    async getParam(nomparam: string): Promise<Observable<any>> {
        const bouticid = await this.session.getBouticId();
        const objmntcmdmini = { requete: 'getparam', bouticid, param: nomparam };
        return this.httpClient.post<string>(environment.apiroot + 'front', objmntcmdmini, await this.header.buildHttpOptions());
    }


    Retour() {
        this.router.navigate(['admin/getinfo'], { replaceUrl: true });
    }

    gotoFin() {
        this.router.navigate(['admin/fin'], { replaceUrl: true })
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
                        this.router.navigate(['admin/debut/' + this.session.getAliasBoutic(true) + '/' + this.session.getMethod(true) + '/' + this.session.getTable(true)], { replaceUrl: true })
                    }
                }
            ],
        });
        await alert.present();
    }

    private async setupStripePayment(pkey: string, items: any, boutic: any, model: any, fraislivr: any, codepromo: any) {
        const stripeAccountData = await new Promise<string>(async (resolve, reject) => {
            (await this.getParam('STRIPE_ACCOUNT_ID')).subscribe({
                next: (data) => resolve(data),
                error: (err) => reject(err)
            });
        });
        const caid = ((stripeAccountData[0] !== null) ? stripeAccountData[0] : '');

        runInInjectionContext(this.environmentInjector, async () => {
            this.stripe = injectStripe(pkey, { stripeAccount: caid });
            this.paying = signal(false);
            var purchase = {
                items, boutic, model, fraislivr, codepromo
            };

            this.httpClient.post<any>(this.apiroot + 'create', purchase, await this.header.buildHttpOptions()).subscribe({
                next: (pi: any) => {
                    this.header.setToken(pi.token);
                    this.loadingState = false;
                    this.elementsOptions.clientSecret = pi.intent;
                },
                error: (err: any) => this.presentAlert(strings.ErrConnect, err.error.error)
            });
        });
    }

}


