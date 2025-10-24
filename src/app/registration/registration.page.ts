/* eslint-disable @typescript-eslint/naming-convention */

import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, Platform, IonHeader, IonToolbar, IonImg, IonContent, IonLabel, IonItem, IonInput, IonButton, IonIcon, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { environment } from 'src/environments/environment';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { PushNotificationService } from '../pushnotif.service';
import { GlobalService } from '../global.service';
import { addIcons } from "ionicons";
import { logoGoogle, sendOutline, arrowUndoOutline } from "ionicons/icons";
import {HeaderService} from "../header.service";
import { IonRouterOutlet } from '@ionic/angular/standalone';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class RegistrationPage implements OnInit {

    isSubmitted = false;
    registrationFormGroup: FormGroup;
    autoregistration = false;
    login: any;
    loaded = false;
    userInfo: any;
    apiroot = environment.apiroot;

    constructor(public menuCtrl: MenuController, public router: Router, public formBuilder: FormBuilder, public httpClient: HttpClient,
        public alertController: AlertController, public platform: Platform, public storage: StorageService,
        public pushnotif: PushNotificationService, public global: GlobalService, public header:HeaderService, private routerOutlet: IonRouterOutlet) {
        addIcons({ logoGoogle, sendOutline, arrowUndoOutline });

    }

    get email(): string {
        return this.registrationFormGroup.value.email;
    }

    get errorControl() {
        return this.registrationFormGroup.controls;
    }

    ngOnInit() {
        this.registrationFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'), Validators.maxLength(255)]]
        });
        this.storage.set('lasturl', this.router.url);
        this.loaded = true;
    }

    async onSubmit() {
        this.isSubmitted = true;
        if ((this.registrationFormGroup.status === 'VALID') || (this.autoregistration === true)) {
            const dblemailpostData = {
                email: this.autoregistration ? this.login : this.email
            };

            this.httpClient.post(environment.apiroot + 'verify-email', dblemailpostData, await this.header.buildHttpOptions()).subscribe({
                next: (data: any) => {
                    this.header.setToken(data.token);
                    if (data !== 'KO') {
                        this.storage.set('login', dblemailpostData.email);
                        this.storage.set('emailcode', '');
                        this.router.navigate(['admin/identification/' + dblemailpostData.email], { replaceUrl: false });
                    }
                    else {
                        this.dblemailAlert('Le courriel que vous avez entré est déjà utilisé');
                    }
                },
                error: (err: any) => {
                    this.dblemailAlert(err.error.error);
                    this.remadelaststep();
                }
            });
        }
    }

    cancel() {
        this.storage.set('stepfailed', '');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    ionViewDidEnter(): void {
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.set('lasturl', this.router.url);
        this.storage.get('stepfailed').then(stepfailed => {
            switch (stepfailed) {
                case 'registrationdetails':
                case 'shopdetails':
                case 'shopsettings':
                case 'subscriptionchoice':
                case 'paymentdetails':
                case 'buildboutic':
                    this.storage.get('login').then(login => {
                        this.autoregistration = true;
                        this.login = login;
                        this.onSubmit();
                    });
                    break;
                case 'registration':
                case 'identification':
                case '':
                    break;
            }
        });
        this.routerOutlet.swipeGesture = true;
    }

    ionViewDidLeave(): void {
        this.menuCtrl.enable(true);
        this.routerOutlet.swipeGesture = true;

    }

    async dblemailAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème Lors de la vérifcation du courriel',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

    }

    remadelaststep() {
        this.storage.set('stepfailed', 'registration');
        this.router.navigate(['admin/login'], { replaceUrl: true });
    }

    bak(ref: any, elem: any) {
        this.storage.set(ref, elem);
    }

    async googleSignup() {
        const googleUser = await SocialLogin.login({
            provider: 'google',
            options: {
                scopes: ['email', 'profile'],
                forceRefreshToken: true // if you need refresh token
            }
        });
        this.userInfo = googleUser;
        this.loaded = false;
        this.autoregistration = true;
        this.login = this.userInfo.email;
        const dblemailpostData = {
            email: this.autoregistration ? this.login : this.email
        };

        this.httpClient.post(environment.apiroot + 'verify-email', dblemailpostData, await this.header.buildHttpOptions()).subscribe({
            next: (data: any) => {
                this.header.setToken(data.token);
                if (data !== 'KO') {
                    this.storage.set('login', dblemailpostData.email);
                    this.storage.set('emailcode', '');
                    this.router.navigate(['admin/registrationdetails'], { replaceUrl: true });
                }
                else {
                    this.dblemailAlert('Le courriel que vous avez entré est déjà utilisé');
                }
            },
            error: (err: any) => {
                this.dblemailAlert(err.error.error);
                this.remadelaststep();
            }
        });
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Problème Lors de l\'identification',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

}
