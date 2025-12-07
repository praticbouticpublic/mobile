
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuController, AlertController, Platform, IonRouterOutlet, IonicSafeString  } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { environment } from '../../environments/environment';
import { StorageService } from '../storage.service';
import { ModeleService } from '../modele.service';
import { GlobalService } from '../global.service';
import { MessageService } from '../message.service';
import { SessionbackService } from '../sessionback.service';
import { PushNotificationService } from '../pushnotif.service';
import { Capacitor } from '@capacitor/core';
import { addIcons } from "ionicons";
import { eye, eyeOff, logoGoogle } from "ionicons/icons";
import {HeaderService} from "../header.service";
import {SelparamService} from "../selparam.service";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})

export class LoginPage implements OnInit {
    loginFormGroup: FormGroup;
    isSubmitted = false;
    hide = true;
    data: any;
    subs: any;
    subscriptions: any;
    routed = false;
    loaded = false;
    userInfo: any;
    prod = environment.production;
    item: any;
    errconnect = false;
    autologin = false;
    login = '';
    mdp = '';
    lasturl = '';
    errconnectmsg = '';
    srvroot = environment.srvroot;
    apiroot = environment.apiroot;
    pathimg: any;
    timerHandle: any;
    notifid = 0;
    total: any;
    logged = false;
    appversion = environment.appversion;


    constructor(private router: Router, public menuCtrl: MenuController, private httpClient: HttpClient,
        public alertController: AlertController, public formBuilder: FormBuilder,
        public platform: Platform, public routerOutlet: IonRouterOutlet, public storage: StorageService,
        public model: ModeleService, public global: GlobalService, public msg: MessageService,
        private sessionback: SessionbackService, public selparam:SelparamService,
        public pushnotif: PushNotificationService, public header:HeaderService) {
        this.initializeApp();
        addIcons({ eye, eyeOff, logoGoogle });
    }

    async initializeApp() {
        SocialLogin.isLoggedIn({provider:"google"}).then(logged => {
            if (logged)
                SocialLogin.logout({provider:"google"});
        });
        await SocialLogin.initialize({
            google: {
                webClientId: '50443410557-13msq51mbn9se9875790c72he6ec1uk3.apps.googleusercontent.com', // Use Web Client ID for all platforms
                iOSClientId: '50443410557-crkf4ar7q8nmh7vn28ipmldtlunqcj89.apps.googleusercontent.com', // for iOS
                iOSServerClientId: '50443410557-13msq51mbn9se9875790c72he6ec1uk3.apps.googleusercontent.com', // Use iOs Server ID for all platforms
                mode: 'offline' // replaces grantOfflineAccess
            }
        });

    }

    get email(): string {
        return this.loginFormGroup.value.email;
    }

    get password(): string {
        return this.loginFormGroup.value.password;
    }

    get errorControl() {
        return this.loginFormGroup.controls;
    }

    iswillQuit() {
        return this.global.getWillQuit();
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

    ngOnInit() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.maxLength(255)]],
            password: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*?]).{8,}'),
            Validators.maxLength(255)]]
        });
        this.storage.get('status').then(status => {
            if (status === 'error') {
                this.lasturl = this.router.url;
            }
        });
        this.loaded = true;
        this.apiroot = environment.apiroot;
        this.pathimg = this.apiroot + 'upload/';
    }

    onSubmit() {
        this.isSubmitted = true;
        if ((!this.loginFormGroup.valid) && (this.autologin === false) && (this.logged === false)) {
            this.loaded = true;
            return false;
        }
        else {
            this.loaded = false;


            const postData = {
                email: this.autologin ? this.login : this.email,
                password: this.autologin ? this.mdp : this.password,
            };
            this.pushnotif.waitForToken().subscribe(async token => {
                this.httpClient.post(environment.apiroot + 'authorize', postData, await this.header.buildHttpOptions()).subscribe({
                    next: async (data: any) => {
                        this.header.setToken(data.token);
                        this.storage.set('status', 'online');
                        this.storage.set('bouticid', data.bouticid);
                        this.storage.set('alias', data.customer);
                        this.storage.set('login', postData.email);
                        this.storage.set('mdp', postData.password);
                        this.storage.set('stripecustomerid', data.stripecustomerid);
                        this.login = postData.email;
                        this.showAlertStripe(data.bouticid);
                        this.global.setLogin(postData.email);
                        this.global.setServer(this.apiroot);
                        const postDataDeviceId = {
                            action: 'setClientProp',
                            bouticid: data.bouticid,
                            prop: 'device_id',
                            valeur: token,
                        };
                        this.httpClient.post(environment.apiroot + 'set-client-prop', postDataDeviceId, await this.header.buildHttpOptions()).subscribe({
                            next: async (datadev: any) => {
                                const postDataDeviceType = {
                                    action: 'setClientProp',
                                    bouticid: data.bouticid,
                                    prop: 'device_type',
                                    valeur: this.GetDeviceType(),
                                };
                                this.httpClient.post(environment.apiroot + 'set-client-prop', postDataDeviceType, await this.header.buildHttpOptions()).subscribe({
                                    next: async (datadev: any) => {
                                        if ((this.autologin) && (!this.logged)) {
                                            this.router.navigate([this.lasturl], { replaceUrl: true });
                                        }
                                        else if (datadev.result === 'OK') {
                                            this.sessionback.setLogged(true);
                                            this.router.navigate(['admin/products'], { replaceUrl: true });
                                        }
                                        else {
                                            this.sessionback.setLogged(true);
                                            this.router.navigate(['admin/subscription'], { replaceUrl: true });
                                        }
                                    },
                                    error: (err: any) => {
                                        this.errconnect = true;
                                        this.errconnectmsg = err.error.error;
                                        this.autologin = false;
                                        this.storage.set('status', 'offline');
                                        this.lasturl = 'admin/login';
                                        this.storage.set('lasturl', this.lasturl);
                                        this.loginFormGroup.reset();
                                        this.loaded = true;
                                        this.presentAlert(err.error.error);
                                    }
                                });
                            },
                            error: (err: any) => {
                                this.errconnect = true;
                                this.errconnectmsg = err.error.error;
                                this.autologin = false;
                                this.storage.set('status', 'offline');
                                this.lasturl = 'admin/login';
                                this.storage.set('lasturl', this.lasturl);
                                this.loginFormGroup.reset();
                                this.loaded = true;
                                this.presentAlert(err.error.error);
                            }
                        });
                    },
                    error: (err: any) => {
                        this.errconnect = true;
                        this.errconnectmsg = err.error.error;
                        this.autologin = false;
                        this.storage.set('status', 'offline');
                        this.lasturl = 'admin/login';
                        this.storage.set('lasturl', this.lasturl);
                        this.loginFormGroup.reset();
                        this.loaded = true;
                        this.presentAlert(err.error.error);
                    }
                });
            });
        }
    }

    ionViewDidEnter(): void {
        let cmdfirst = true;
        this.loaded = false;
        this.menuCtrl.isOpen().then(data => {
            if (!data) {
                this.menuCtrl.enable(false);
            }
        });
        this.storage.set('stepfailed', '');
        this.storage.get('login').then(email => {
            if (email !== '') {
                this.login = email;
                this.storage.get('mdp').then(mdp => {
                    if (mdp !== '') {
                        this.mdp = mdp;
                        this.storage.get('status').then(status => {
                            if (status === 'error') {
                                this.storage.get('lasturl').then(lasturl => {
                                    if (lasturl !== '') {
                                        this.lasturl = lasturl;
                                        this.autologin = true;
                                        this.onSubmit();
                                    }
                                    else {
                                        this.autologin = false;
                                        this.storage.set('lasturl', this.router.url);
                                        this.loaded = true;
                                    }
                                });
                            }
                            else {
                                this.sessionback.getLogged().then(logged => {
                                    this.logged = logged;
                                    if (logged) {
                                        this.autologin = true;
                                        this.onSubmit();
                                    }
                                    else {
                                        this.autologin = false;
                                        this.storage.set('lasturl', this.router.url);
                                        this.loaded = true;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    ionViewDidLeave(): void {
        this.loaded = false;
        this.menuCtrl.enable(true);
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

    registration() {
        this.loaded = false;
        this.router.navigate(['admin/registration'], { replaceUrl: false });
    }

    forgotpassword() {
        this.loaded = false;
        this.router.navigate(['admin/forgotpassword'], { replaceUrl: true });
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

        const postData = {
            email: this.userInfo.email
        };
        this.pushnotif.waitForToken().subscribe(async token => {
            this.httpClient.post(environment.apiroot + 'google-signin', postData, await this.header.buildHttpOptions()).subscribe({
                next: async (response: any) =>
                {
                    this.header.setToken(response.token);
                    this.storage.set('login', this.userInfo.email);
                    this.login = postData.email;
                    if (response.status === 'OK') {
                        this.storage.set('status', 'online');
                        this.storage.set('mdp', response.password);
                        this.storage.set('login', this.userInfo.email);
                        this.storage.set('bouticid', response.bouticid);
                        this.storage.set('alias', response.customer);
                        this.storage.set('stripecustomerid', response.stripecustomerid);
                        this.global.setLogin(this.userInfo.email);
                        this.global.setServer(this.apiroot)
                        this.showAlertStripe(response.bouticid);
                        const postDataDevice = {
                            action: 'setClientProp',
                            bouticid: response.bouticid,
                            prop: 'device_id',
                            valeur: token
                        };
                        this.httpClient.post(environment.apiroot + 'set-client-prop', postDataDevice, await this.header.buildHttpOptions()).subscribe({
                            next: async (datadev: any) =>
                            {
                                const postDataDevice = {
                                    action: 'setClientProp',
                                    bouticid: response.bouticid,
                                    prop: 'device_type',
                                    valeur: this.GetDeviceType(),
                                };
                                this.httpClient.post(environment.apiroot + 'set-client-prop', postDataDevice, await this.header.buildHttpOptions()).subscribe({
                                    next: (datadev: any) =>
                                    {
                                        if (response.status === 'OK')
                                        {
                                            this.selparam.setTable('article');
                                            this.selparam.setIdtoup(0);
                                            this.selparam.setSelcol('');
                                            this.selparam.setSelid(0);
                                            this.router.navigate(['admin/products'], { replaceUrl: true });
                                        }
                                        else
                                            this.router.navigate(['admin/subscription'], { replaceUrl: true });
                                    },
                                    error: (err: any) =>
                                    {
                                        this.errconnect = true;
                                        this.loginFormGroup.reset();
                                        this.loaded = true;
                                        this.presentAlert(err.error.error);
                                    }
                                });
                            },
                            error: (err: any) =>
                            {
                                this.errconnect = true;
                                this.loginFormGroup.reset();
                                this.loaded = true;
                                this.presentAlert(err.error.error);
                            }
                        });
                    }
                    else if (response.status === 'KO')
                    {
                        sessionStorage.setItem('praticboutic_registration_courriel', this.userInfo.email);
                        this.router.navigate(['admin/registrationdetails']);
                    }
                },
                error: (err: any) =>
                {
                    this.errconnect = true;
                    this.loginFormGroup.reset();
                    this.loaded = true;
                    this.presentAlert(err.error.error);
                }
            });
        });
    }

    async showAlertStripe(bouticid: any) {

        const chargepostData = {
            bouticid
        };

        this.httpClient.post(environment.apiroot + 'check-stripe-account', chargepostData, await this.header.buildHttpOptions()).subscribe({
            next: (datastripe: any) => {
                if (datastripe.result === 'KO') {
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
            header: 'Information',
            cssClass: 'my-custom-class-alertestripe',
            message: new IonicSafeString('Le paiement par carte bancaire n\'est pas actif ! ' +
                'Vous ne pourrez pas recevoir de paiement par Carte bancaire ' +
                'Pour l\'activer rendez-vous ultérieurement dans la rubrique <b>\"Mon Argent\"</b> ' +
                'ou cliquez sur le bouton <span class=\'gsbl\'>\"GO TO STRIPE\"</span> ci-dessous'),
            buttons:
                [
                    {
                        text: 'Me le rappeler ultérieurement',
                        cssClass: 'alert-button-cancel'
                    },
                    {
                        text: 'Go to Stripe',
                        cssClass: 'alert-button-confirm',
                        handler: (blah) => {
                            this.router.navigate(['admin/mymoney'], { replaceUrl: true });
                        }
                    }
                ]
        });

        await alert.present();
    }

}
