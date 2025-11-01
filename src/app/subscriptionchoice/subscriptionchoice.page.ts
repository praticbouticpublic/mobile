import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuController, AlertController, Platform, IonHeader, IonToolbar, IonImg, IonTitle, IonContent, IonSpinner, IonItem, IonText, IonCheckbox, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../global.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as myGlobals from '../../app/global';
import * as st from 'src/app/subscriptiontype.enum';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionBase } from '../subscriptionbase';
import * as si from 'src/app/subscription.interface';
import { addIcons } from "ionicons";
import { sendOutline, closeOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-subscriptionchoice',
    templateUrl: './subscriptionchoice.page.html',
    styleUrls: ['./subscriptionchoice.page.scss'],
    imports: [IonicModule, ReactiveFormsModule]
})

export class SubscriptionchoicePage extends SubscriptionBase implements OnInit {
    subchoiceForm: FormGroup;
    isSubmitted = false;
    fixelinkparam: any;
    consolinkparam: any;
    apiroot = environment.apiroot;
    type: any;
    login: any;
    loaded = false;
    menuenabled = false;
    autosubchoice = false;
    aboconso: boolean = false;
    abofixe: boolean = false;
    subscription: st.SubscriptionType = 0;

    get cgv() {
        return this.subchoiceForm.value.cgv;
    }

    get abonnement() {
        return this.subchoiceForm.value.abonnement;
    }

    getlinkfixeparam() {
        return this.fixelinkparam;
    }

    setfixelinkparam(str: any) {
        this.fixelinkparam = str;
    }

    getlinkconsoparam() {
        return this.consolinkparam;
    }

    setconsolinkparam(str: any) {
        this.consolinkparam = str;
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController,
        public global: GlobalService, public sub: SubscriptionService, public alertController: AlertController,
        public platform: Platform, public storage: StorageService, public httpClient: HttpClient,
        public header:HeaderService) {
        super(router, global, sub, alertController, platform, storage, httpClient, header);
        this.global.setFormComponent(this);
        this.type = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        addIcons({ sendOutline, closeOutline });
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.subchoiceForm = this.formBuilder.group({
            abonnement: ['', [Validators.required]],
            cgv: [false, [Validators.required]]
        });
        this.global.setFormComponent(this);
    }


    onSubmitSubChoice() {
        this.loaded = false;
        this.isSubmitted = true;
        if (!this.subchoiceForm.valid) {
            this.loaded = true;
            this.isSubmitted = false;
            return;
        }
        else {
            if (this.subchoiceForm.value.cgv === true) {
                this.router.navigate(['admin/subscription/paymentdetails/' + this.type]);
            }
            this.isSubmitted = false;
            this.loaded = true;
        }
    }


    onSubmit() {
        this.loaded = false;
        this.isSubmitted = true;
        if ((!this.subchoiceForm.valid) && (this.autosubchoice === false)) {
            this.loaded = true;
            return false;
        }
        else {
            this.storage.set('praticboutic_subscriptionchoice_cgv', this.subchoiceForm.value.cgv);
            this.storage.set('praticboutic_subscriptionchoice_abonnement', this.subchoiceForm.value.abonnement);

            if (this.subchoiceForm.value.cgv === true) {
                if (this.subchoiceForm.value.abonnement === 'ABOFIXE') {
                    this.router.navigate(['admin/paymentdetails/' + this.type], { replaceUrl: false });
                }
                if (this.subchoiceForm.value.abonnement === 'ABOCONSO') {
                    this.router.navigate(['admin/paymentdetails/' + this.type], { replaceUrl: false });
                }
            }
            this.loaded = true;
        }
    }

    onCancel() {
        this.loaded = false;
        if (this.type === 'init') {
            this.storage.set('stepfailed', '');
            this.router.navigate(['admin/shopsettings'], { replaceUrl: true });
        }
        else if (this.type === 'back') {
            this.router.navigate(['admin/subscription'], { replaceUrl: true });
        }
    }

    ionViewDidEnter(): void {
        this.global.setFormComponent(this);
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.get('praticboutic_subscriptionchoice_abonnement').then(abonnement => {
            if (abonnement !== null) {
                this.subchoiceForm.controls.abonnement.setValue(abonnement);
            }
        });
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'buildboutic':
                    this.autosubchoice = true;
                    this.onSubmit();
                    break;
                case 'registration':
                case 'identification':
                case 'registrationdetails':
                case 'shopdetails':
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case '':
                    break;
            }
        });

        this.storage.get('login').then(login => {
            this.fixelinkparam = '';
            this.consolinkparam = '';
            this.changelink(this.type, login);
            this.loaded = true;
        });
    }

    ionViewDidLeave(): void {
        this.loaded = false;
        this.menuCtrl.enable(false);
        this.menuenabled = false;
    }

    async changelink(type: any, login: any) {
        let action: any;

        if (type == 'init')
            action = "configuration";
        else if (type == 'back')
            action = "boconfiguration";

        const obj = { action, login };

        this.httpClient.post<si.Prices>(environment.apiroot + action, obj, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                if (!data.prices) {
                    this.presentAlert('Pas de tarifs');
                    this.pasdetarif();
                }
                else {
                    data.prices.forEach((price) => {
                        if (price.lookup_key == "pb_fixe")
                            this.fixe(type, login, price.id);
                        else if (price.lookup_key == "pb_conso")
                            this.conso(type, login, price.id);
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

    onSelect(monabonnement: string) {
        if (monabonnement === 'ABOCONSO' && this.aboconso === false) {
            (document.getElementById('abocom') as HTMLIonImgElement).src = 'assets/img/commission_selected.png';
            (document.getElementById('abofixe') as HTMLIonImgElement).src = 'assets/img/engagement_unselected.png';
            this.aboconso = true;
            this.abofixe = false;
            this.subscription = st.SubscriptionType.COMMISSION;
        }
        else if (monabonnement === 'ABOFIXE' && this.abofixe === false) {
            (document.getElementById('abocom') as HTMLIonImgElement).src = 'assets/img/commission_unselected.png';
            (document.getElementById('abofixe') as HTMLIonImgElement).src = 'assets/img/engagement_selected.png';
            this.abofixe = true;
            this.aboconso = false;
            this.subscription = st.SubscriptionType.ENGAGEMENT;
        }
        else if (monabonnement === 'ABOCONSO' && this.aboconso === true) {
            (document.getElementById('abocom') as HTMLIonImgElement).src = 'assets/img/commission_unselected.png';
            (document.getElementById('abofixe') as HTMLIonImgElement).src = 'assets/img/engagement_selected.png';
            this.abofixe = true;
            this.aboconso = false;
            this.subscription = st.SubscriptionType.COMMISSION;
        }
        else if (monabonnement === 'ABOFIXE' && this.abofixe === true) {
            (document.getElementById('abocom') as HTMLIonImgElement).src = 'assets/img/commission_unselected.png';
            (document.getElementById('abofixe') as HTMLIonImgElement).src = 'assets/img/engagement_selected.png';
            this.abofixe = false;
            this.aboconso = true;
            this.subscription = st.SubscriptionType.ENGAGEMENT;
        }
        this.subchoiceForm.controls.abonnement.setValue(monabonnement);
        this.sub.setAboMode(this.subscription);
    }

    remadelaststep() {
        this.storage.set('stepfailed', 'subscriptionchoice');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

}
