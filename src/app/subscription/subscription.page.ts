
import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonList, IonItemDivider, IonLabel, IonItem, IonButton, IonChip, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../global.service';
import { strings } from '../strings';
import { addIcons } from "ionicons";
import { add, returnDownBackOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import { DecimalPipe } from '@angular/common';
import { IonicModule } from "@ionic/angular";

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.page.html',
    styleUrls: ['./subscription.page.scss'],
    imports: [IonicModule, DecimalPipe]
})

export class SubscriptionPage implements OnInit {
    subs: any;
    suboject: any;
    subscriptions: any;
    loaded = false;
    menuenabled = false;
    login: any;

    constructor(public httpClient: HttpClient, public alertController: AlertController, public global: GlobalService,
        public router: Router, public platform: Platform, public menuCtrl: MenuController, public storage: StorageService,
        public header:HeaderService, public routerOutlet:IonRouterOutlet) {
        addIcons({ add, returnDownBackOutline });

    }

    async onRefresh() {

        const postData = {
            login: this.login
        };

        this.httpClient.post(environment.apiroot + 'liens-creation-boutic', postData, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.subs = data.data;
                this.subscriptions = new Array();
                for (const sub of this.subs) {
                    let st =  JSON.parse(sub.stripe_subscription);
                  const subscription = {
                    subid : st.id,
                    aboref : sub.aboid.toString().padStart(10, '0'),
                    usagetype : st.items.data[0].price.recurring.usage_type,
                    decimalprice : st.items.data[0].price.unit_amount_decimal,
                    currency : st.items.data[0].price.metadata.currency_symbol,
                    interval : st.items.data[0].price.metadata.fr_interval,
                    status : st.status,
                    undercancel : st.cancel_at_period_end
                  };
                    if (subscription.status === 'active') {
                        this.menuCtrl.enable(true);
                        this.menuenabled = true;
                    }
                    this.subscriptions.push(subscription);
                }
                this.loaded = true;
            },
            error: (err: any) => {
                this.reconnect();
            }
        });
    }

    ngOnInit(): void {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.storage.get('login').then(login => {
            this.login = login;
        });
    }

    ionViewWillLeave() {
        // Restaure le comportement global (désactivé)
        this.routerOutlet.swipeGesture = false;
    }

    ionViewWillEnter(): void {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
                this.menuenabled = false;
            }
        });
        this.onRefresh();
        this.routerOutlet.swipeGesture = true;

    }

    onCancel(elem: any) {
        this.annulAlert(elem);
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

    async annulAlert(elem: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Annulation',
            subHeader: 'Demande de confirmation',
            message: 'Voulez-vous annuler cette  abonnement ?',
            buttons: [{
                text: 'Oui',
                cssClass: 'btns-modal-alert',
                handler: async (blah) => {

                    const postDataCancel = {
                        action: 'boannulerabonnement',
                        subscriptionid: elem.subid,
                        login: this.login,
                    };
                    this.httpClient.post(environment.apiroot + postDataCancel.action, postDataCancel, await this.header.buildHttpOptions()).subscribe({
                        next: (data: any) => {
                            this.header.setToken(data.token);
                            // Mettre à jour localement l'abonnement annulé
                            const sub = this.subscriptions.find((s: any) => s.subid === elem.subid);
                            if (sub) {
                                sub.undercancel = true;   // ou sub.status = 'canceled' selon ta logique
                            }
                            // Optionnel : rafraîchir la liste complète après un délai pour éviter la désynchronisation
                            setTimeout(() => this.onRefresh(), 3000);
                        },
                        error: (err: any) => {
                            this.reconnect();
                        }
                    });
                }
            }, 'Non']
        });

        await alert.present();

    }

    goToAddSubscription() {
        if (environment.formulechoice === 3)
            this.router.navigate(['admin/subscriptionchoice/back'], { replaceUrl: false });
        else
            this.router.navigate(['admin/paymentdetails/back'], { replaceUrl: false });

    }

    gotoLoginPage() {
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    reconnect() {
        this.loaded = false;
        this.storage.set('status', 'error');
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    exit() {
        this.router.navigate(['admin/logout'], { replaceUrl: true });
    }

    deleteboutic() {
      this.storage.get('login').then(email => {
          this.storage.get('bouticid').then(async bouticid => {
                  const obj = { bouticid, email };
                  this.httpClient.post<any>(environment.apiroot + 'suppression', obj, await this.header.buildHttpOptions()).subscribe({
                      next: (data: any) => {
                          this.exit();
                      },
                      error: (err: any) => {
                          this.presentAlert(strings.ErrConnect);
                      }
                  });
              });
          });
   }

    async confirmDelAlert() {
        const alert = this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Warning,
            subHeader: strings.AskConfirmation,
            message: strings.SuppresionCompte,
            buttons: [{
                text: strings.Yes,
                role: 'oui',
                handler: () => {
                    this.reconfirmDelAlert();
                },
            },
            {
                text: strings.No,
                role: 'non',
                handler: () => {

                }
            }]
        })

        await (await alert).present();

    }

    async reconfirmDelAlert() {
        const alert = this.alertController.create({
            cssClass: 'my-custom-class',
            header: strings.Warning,
            subHeader: strings.AskConfirmation,
            message: strings.SuppresionCompteTwice,
            buttons: [{
                text: strings.Yes,
                role: 'oui',
                handler: () => {
                    this.deleteboutic();
                },
            },
            {
                text: strings.No,
                role: 'non',
                handler: () => {

                }
            }]
        })

        await (await alert).present();
    }
}
