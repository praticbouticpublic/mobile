
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, IonRouterOutlet, MenuController, Platform } from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { addIcons } from "ionicons";
import { sendOutline, closeOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-shopsettings',
    templateUrl: './shopsettings.page.html',
    styleUrls: ['./shopsettings.page.scss'],
    imports: [IonicModule, ReactiveFormsModule]
})
export class ShopsettingsPage implements OnInit {
    shopsetForm: FormGroup;
    isSubmitted = false;
    loaded = false;
    autoshopset = false;

    customAlertOptions: any = {
        cssClass: 'customAlertCss',
    };

    constructor(public router: Router, public formBuilder: FormBuilder, public menuCtrl: MenuController,
        public httpClient: HttpClient, public alertController: AlertController, public platform: Platform,
        public storage: StorageService, public header:HeaderService, public routerOutlet: IonRouterOutlet) {
        addIcons({ sendOutline, closeOutline });

    }

    get errorControl() {
        return this.shopsetForm.controls;
    }

    ngOnInit() {
        this.storage.set('lasturl', this.router.url);
        this.shopsetForm = this.formBuilder.group({
            chxmethode: ['TOUS', [Validators.required]],
            chxpaie: ['TOUS', [Validators.required]],
            mntmincmd: [1, [Validators.required]],
            validsms: ['on', [Validators.required]],
        });
    }

    async onSubmit() {
        this.isSubmitted = true;
        this.loaded = false;
        if ((!this.shopsetForm.valid) && (this.autoshopset === false)) {
            return false;
        }
        else {
            this.storage.set('praticboutic_shopsettings_chxmethode', this.shopsetForm.value.chxmethode);
            this.storage.set('praticboutic_shopsettings_mntmincmd', this.shopsetForm.value.mntmincmd);
            this.storage.set('praticboutic_shopsettings_chxpaie', this.shopsetForm.value.chxpaie);
            this.storage.set('praticboutic_shopsettings_validsms', this.shopsetForm.value.validsms === 'on' ? '1' : '0');

            const shopsetmobpostData = {
                chxmethode: this.shopsetForm.value.chxmethode,
                chxpaie: this.shopsetForm.value.chxpaie,
                mntmincmd: this.shopsetForm.value.mntmincmd,
                validsms: this.shopsetForm.value.validsms === 'on' ? '1' : '0',
            };

            this.httpClient.post(environment.apiroot + 'boutic-configure', shopsetmobpostData, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.header.setToken(data.token);
                    if (data.result === 'OK') {
                        if (environment.formulechoice === 3)
                            this.router.navigate(['admin/subscriptionchoice/init'], { replaceUrl: false });
                        else
                            this.router.navigate(['admin/paymentdetails/init'], { replaceUrl: false });
                    }
                },
                error: (err: any) => {
                    this.shopsetmobAlert(err.error.text);
                    this.remadelaststep();
                }
            });
        }
    }

    onCancel() {
        this.loaded = true;
        this.storage.set('stepfailed', '');
        this.router.navigate(['admin/shopdetails'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.storage.set('lasturl', this.router.url);
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.get('praticboutic_shopsettings_chxmethode').then(chxmethode => {
            if (chxmethode !== null) {
                this.shopsetForm.controls.chxmethode.setValue(chxmethode);
            }
        });
        this.storage.get('praticboutic_shopsettings_mntmincmd').then(mntmincmd => {
            if (mntmincmd !== null) {
                this.shopsetForm.controls.mntmincmd.setValue(mntmincmd);
            }
        });
        this.storage.get('praticboutic_shopsettings_chxpaie').then(chxpaie => {
            if (chxpaie !== null) {
                this.shopsetForm.controls.chxpaie.setValue(chxpaie);
            }
        });
        this.storage.get('praticboutic_shopsettings_validsms').then(validsms => {
            if (validsms !== null) {
                this.shopsetForm.controls.validsms.setValue(validsms === '1' ? 'on' : 'off');
            }
        });
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'registration':
                case 'identification':
                case 'registrationdetails':
                case 'shopdetails':
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case 'buildboutic':
                case '':
                    break;
            }
        });
        this.loaded = true;
        this.routerOutlet.swipeGesture = true;
    }

    ionViewDidLeave(): void {
        this.loaded = false;
        this.menuCtrl.enable(true);
        this.routerOutlet.swipeGesture = false;
    }

    async shopsetmobAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème dans les paramètres de la boutic',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.loaded = false;
        this.storage.set('stepfailed', 'shopsettings');
        this.router.navigate(['admin/registration'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }
}
