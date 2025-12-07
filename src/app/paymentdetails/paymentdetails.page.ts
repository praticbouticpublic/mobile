import { Component, EnvironmentInjector, inject, OnInit, signal, ViewChild } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonHeader, IonToolbar, IonImg, IonContent, IonSpinner, IonItem, IonRow, IonCol, IonLabel, IonInput, IonText, IonCheckbox, IonButton, IonIcon } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../global.service';
import * as myGlobals from '../../app/global';
import { PushNotificationService } from '../pushnotif.service';
import { StripeCardElementOptions, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripePaymentElementComponent, StripeService, injectStripe } from 'ngx-stripe';
import { UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { strings } from '../strings';
import * as st from './../subscriptiontype.enum';
import { SubscriptionService } from '../subscription.service';
import { Capacitor } from '@capacitor/core';
import { SubscriptionBase } from '../subscriptionbase';
import * as si from 'src/app/subscription.interface';
import { addIcons } from "ionicons";
import { sendOutline, closeOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";
import {SessionbackService} from "../sessionback.service";

@Component({
    selector: 'app-paymentdetails',
    templateUrl: './paymentdetails.page.html',
    styleUrls: ['./paymentdetails.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule, StripeCardComponent]
})

export class PaymentdetailsPage extends SubscriptionBase implements OnInit {

    type: any;
    subscriptionId: any;
    clientSecret: any;
    loaded = false;
    menuenabled = false;
    isSubmitted = false;

    @ViewChild(StripePaymentElementComponent)
    paymentElement!: StripePaymentElementComponent;

    private readonly fb = inject(UntypedFormBuilder);

    elementsOptions: StripeElementsOptions = {
        mode: 'subscription',
        currency: 'eur',
        amount: 0,
        locale: 'fr',
        appearance: {
            theme: 'flat',
        },
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css?family=Montserrat:wght@400;500'
            }
        ]
    };

    paymentElementOptions: StripePaymentElementOptions = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
        fields: {
            billingDetails: {
                address: {
                    postalCode: 'never',
                    country: 'never'
                }
            }

        }
    };

    paymentElementForm = this.fb.group({
        nom: ['', [Validators.required]],
        montant: [0, [Validators.required, Validators.pattern(/d+/)]],
        cgv: [false, [Validators.required]]
    });

    private environmentInjector = inject(EnvironmentInjector);

    @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;

    cardOptions: StripeCardElementOptions = {
        hidePostalCode: true,
        style: {
            base: {
                color: "#444444",
                backgroundColor: "#EEEEEE",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontWeight: "1",
                lineHeight: "2.5",
                fontSmoothing: "antialiased",
                fontSize: "18px",
                "::placeholder": {
                    color: "#444444"
                }
            },
            invalid: {
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    @ViewChild(StripeCardComponent) card!: StripeCardComponent;

    stripe = injectStripe(environment.pkey);
    paying = signal(false);

    get cgv() {
        return this.paymentElementForm.value.cgv;
    }

    constructor(router: Router, httpClient: HttpClient, public model: ModeleService, global: GlobalService,
        alertController: AlertController, public menuCtrl: MenuController, platform: Platform,
        public sub: SubscriptionService, storage: StorageService, public pushnotif: PushNotificationService,
        public stripeService: StripeService, public header:HeaderService
    , public routerOutlet: IonRouterOutlet, public sessionback: SessionbackService) {
        super(router, global, sub, alertController, platform, storage, httpClient, header);
        this.global.setFormComponent(this);
        addIcons({ sendOutline, closeOutline });
    }

    GetDeviceType(): number {
        let platform = Capacitor.getPlatform();
        let type = 0;
        switch (platform) {
            case 'web': type = 0; break;
            case 'android': type = 1; break;
            case 'ios': type = 2; break;
        }
        return type;
    }

    getLoaded() {
        return this.loaded;
    }

    setLoaded(myloaded: boolean) {
        this.loaded = myloaded;
    }

    async creationAbo(type: any, login: any) {
        let action: any;

        if (type == 'init')
            action = "configuration";
        else if (type == 'back')
            action = "boconfiguration";

        const obj = { login };

        this.httpClient.post<si.Prices>(environment.apiroot + action, obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                if (!data.prices) {
                    this.presentAlert('Pas de tarifs');
                    this.pasdetarif();
                }
                else {
                    data.prices.forEach((price) => {
                        switch (environment.formulechoice) {
                            case 1:
                                this.sub.setAboMode(st.SubscriptionType.COMMISSION);
                                if (price.lookupKey == "pb_conso")
                                    this.conso(type, login, price.id);
                                break;
                            case 2:
                                this.sub.setAboMode(st.SubscriptionType.ENGAGEMENT);
                                if (price.lookupKey == "pb_fixe")
                                    this.fixe(type, login, price.id);
                                break;
                            default:
                                break;

                        }
                    });
                }
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
                if (type == 'init')
                    this.remadelaststep();
                else if (type == 'back')
                    this.reconnect();
            }
        });
    }

    ngOnInit() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(false);
        this.menuenabled = false;
        this.storage.get('login').then(login => {
            this.type = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
            this.creationAbo(this.type, login);
        });

    }

    ionViewDidEnter() {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.enable(false);
        this.menuenabled = false;
        this.setLoaded(true);
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
    }

    ionViewWillEnter() {
        // Réactive le swipe-back uniquement sur cette page
        this.routerOutlet.swipeGesture = true;
    }

    ionViewWillLeave() {
        // Restaure le comportement global (désactivé)
        this.routerOutlet.swipeGesture = false;
    }

    onCancel() {
        this.setLoaded(false);
        if (this.type === 'init') {
            this.storage.set('stepfailed', '');
            if (environment.formulechoice === 3)
                this.router.navigate(['admin/subscriptionchoice/init'], { replaceUrl: true });
            else
                this.router.navigate(['admin/shopsettings'], { replaceUrl: true });
        }
        else if (this.type === 'back') {
            this.router.navigate(['admin/subscription'], { replaceUrl: true });
        }
    }

    gotoAdmin() {
        this.setLoaded(false);
        this.sub.clearAboMode();
        this.congratAlert();
    }

    async errpubkeyAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème lors de la récupération de la clé publique Stripe',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    ionViewDidLeave(): void {
        this.loaded = false;
    }

    gotoAccountPage() {
        this.setLoaded(false);
        this.sub.clearAboMode();
        this.menuCtrl.enable(true);
        this.router.navigate(['admin/subscription'], { replaceUrl: true });
    }

    async presentcongratAlert() {
        await this.congratAlert();
    }

    async congratAlert() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Fin de la création de votre boutic',
            subHeader: '',
            message: 'Félicitations! Nous vous redirigeons vers votre compte.',
            buttons: ['OK']
        });

        await alert.present();
        await alert.onDidDismiss().then(() => {
            this.setLoaded(false);
            this.storage.remove('stepfailed');
            this.storage.remove('praticboutic_registrationdetails_motdepasse');
            this.storage.remove('praticboutic_registrationdetails_qualite');
            this.storage.remove('praticboutic_registrationdetails_nom');
            this.storage.remove('praticboutic_registrationdetails_prenom');
            this.storage.remove('praticboutic_registrationdetails_prenom');
            this.storage.remove('praticboutic_registrationdetails_adresse1');
            this.storage.remove('praticboutic_registrationdetails_adresse2');
            this.storage.remove('praticboutic_registrationdetails_codepostal');
            this.storage.remove('praticboutic_registrationdetails_ville');
            this.storage.remove('praticboutic_registrationdetails_telephone');
            this.storage.remove('praticboutic_shopdetails_nom');
            this.storage.remove('praticboutic_shopdetails_aliasboutic');
            this.storage.remove('praticboutic_shopdetails_logo');
            this.storage.remove('praticboutic_shopdetails_email');
            this.storage.remove('praticboutic_shopsettings_chxmethode');
            this.storage.remove('praticboutic_shopsettings_mntmincmd');
            this.storage.remove('praticboutic_shopsettings_caisse');
            this.storage.remove('praticboutic_shopsettings_validsms');
            this.storage.remove('praticboutic_subscriptionchoice_cgv');
            this.storage.remove('praticboutic_subscriptionchoice_abonnement');

                this.storage.get('login').then(email => {
                    this.storage.get('mdp').then(async mdp => {
                        const postData = {
                            email,
                            password: mdp
                        };
                        this.httpClient.post(environment.apiroot + 'authorize', postData, await this.header.buildHttpOptions()).subscribe({
                            next: (response: any) => {
                                this.header.setToken(response.token);
                                this.storage.set('status', 'online');
                                this.storage.set('bouticid', response.bouticid);
                                this.storage.set('alias', response.nom);
                                this.storage.set('login', postData.email);
                                this.storage.set('mdp', postData.password);
                                this.storage.set('stripecustomerid', response.stripecustomerid);
                                this.global.setLogin(postData.email);
                                this.sessionback.setLogged(true);
                                const URLmodel = 'assets/data/model.json';
                                this.httpClient.get(URLmodel).subscribe(datadbd => {
                                    this.model.chargementDbd(datadbd);
                                    this.showAlertStripe(response.bouticid);
                                    this.router.navigate(['admin/products'], { replaceUrl: true });
                                    this.menuCtrl.enable(true);
                                });
                            },
                            error: (err: any) => {
                                this.presentAlert(err.error.error);
                                this.router.navigate(['admin/login'], { replaceUrl: true });
                            }
                        });
                    });
                });
            });

    }

    async showAlertStripe(bouticid: any) {
        const chargepostData = {
            bouticid
        };

        this.httpClient.post(environment.apiroot + 'check-stripe-account', chargepostData, await this.header.buildHttpOptions()).subscribe({
            next: (response: any) => {
                if (response.result === 'KO') {
                    this.presentAlertStripe();
                }
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
            }
        });
    }

    async presentAlertStripe() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Information',
            message: 'Le paiement par carte bancaire n\'est pas actif ! ' +
                'Vous ne pourrez pas recevoir de paiement par Carte bancaire ' +
                'Pour l\'activer rendez-vous ultérieurement dans la rubrique <b>\"Mon Argent\"</b> ' +
                'ou cliquez sur le bouton <b>\"Go to Stripe\"</b> ci-dessous',
            buttons:
                ['Me le rappeller ultétrieurement',
                    {
                        text: 'Go to Stripe',
                        cssClass: 'actionalert',
                        handler: (blah) => {
                            this.router.navigate(['admin/mymoney'], { replaceUrl: false });
                        }
                    }]
        });

        await alert.present();
    }

    remadelaststep() {
        this.storage.set('stepfailed', 'paymentdetails');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    remadelastbuildboutic() {
        this.storage.set('stepfailed', 'buildboutic');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    reconnect() {
        this.setLoaded(false);
        this.storage.set('status', 'error');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    buildboutic() {
        this.pushnotif.waitForToken().subscribe(async device_id => {
            const obj = { table: "", device_id, device_type: this.GetDeviceType() };
            this.httpClient.post(environment.apiroot + 'build-boutic', obj, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.gotoAdmin();
                },
                error: (err: any) => {
                    this.presentAlert(err.error.error);
                    this.remadelastbuildboutic();
                }
            });
        });
    }

    displayError(event: any) {
        this.setLoaded(true);
        let displayError = document.getElementById('card-element-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }

    createPaymentMethod(stripe: any, cardElement: any, customerId: any, priceId: any) {
        const nameInput = this.paymentElementForm.get('nom')?.value;

        return stripe
            .createPaymentMethod({
                type: 'card',
                card: cardElement.element,
                //billing_details: { nameInput },
            }).subscribe((result: any) => {
                if (result.error) {
                    this.displayError(result);
                } else {
                    this.createSubscription(
                        stripe,
                        customerId,
                        result.paymentMethod.id,
                        priceId
                    );
                }
            });
    }

    handlePaymentThatRequiresCustomerAction(
        stripe: any,
        subscription: any,
        invoice: any,
        priceId: any,
        paymentMethodId: any
    ) {
        let setupIntent = subscription.pending_setup_intent;

        if (setupIntent && setupIntent.status === 'requires_action') {
            return stripe
                .confirmCardSetup(setupIntent.client_secret, {
                    payment_method: paymentMethodId,
                })
                .then((result: any) => {
                    if (result.error) {
                        throw result;
                    } else {
                        if (result.setupIntent.status === 'succeeded') {
                            return {
                                priceId: priceId,
                                subscription: subscription,
                                invoice: invoice,
                                paymentMethodId: paymentMethodId,
                            };
                        }
                        else
                            return;
                    }
                });
        }
        else {
            return { subscription, priceId, paymentMethodId };
        }
    }

    async createSubscription(stripe: any, customerId: any, paymentMethodId: any, priceId: any) {
        let theaction;
        if (this.type == 'init')
            theaction = "consocreationabonnement";
        else if (this.type == 'back')
            theaction = "boconsocreationabonnement";

      const body = {
        action: theaction,
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        priceId: priceId,
      };

      this.httpClient.post<any>(environment.apiroot + theaction, body, await this.header.buildHttpOptions()).subscribe({
        next: (result:any) => {
            this.header.setToken(result.token);
          if (result.error) {
            this.presentAlert(result.error);
            this.isSubmitted = false;
            return;
          }

          if (this.type === 'init') {
            this.buildboutic();
          } else if (this.type === 'back') {
            this.gotoAccountPage();
          }

          const finalResult = {
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            subscription: result,
          };

          this.handlePaymentThatRequiresCustomerAction(stripe, finalResult, null, priceId, paymentMethodId);
          this.isSubmitted = false;
        },
        error: (error) => {
          this.displayError(error);
          this.isSubmitted = false;
        }
      });
    }


    pay() {
        const setMessage = (message: any) => {
            const messageDiv = document.querySelector('#messages') as HTMLElement;
            messageDiv.innerHTML = message;
        }
        if (this.paying()) return;

        this.paying.set(false);
        if (this.sub.getAboMode() === st.SubscriptionType.ENGAGEMENT) {
            if (!this.isSubmitted) {
                this.isSubmitted = true;
                const nameInput = this.paymentElementForm.get('nom')?.value;

                // Create payment method and confirm payment intent.
                this.stripeService.confirmCardPayment(this.sub.clientsecret, {
                    payment_method: {
                        card: this.cardElement.element,
                        billing_details: {
                            name: nameInput,
                        },
                    }
                }).subscribe((result: any) => {
                    if (result.error) {
                        setMessage(`Payment failed: ${result.error.message}`);
                        this.isSubmitted = false;
                    }
                    else {
                        if (this.type == 'init') {
                            this.buildboutic();
                        }
                        else if (this.type == 'back') {
                            this.gotoAccountPage();
                        }
                    }
                });
            }
        }
        else if (this.sub.abomode === st.SubscriptionType.COMMISSION) {
            if (!this.isSubmitted) {
                this.isSubmitted = true;
                this.createPaymentMethod(this.stripeService, this.card, this.sub.customerid, this.sub.priceid);
            }
        }
        else {
            this.presentAlert(strings.NoActiveSubscription);
        }
    }

}

