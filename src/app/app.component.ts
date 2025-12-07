import {AfterViewInit, Component, ElementRef, inject, NgZone, ViewChild} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
    Platform,
    AlertController, IonContent, IonMenu, IonSplitPane, IonApp, IonRouterOutlet, IonList, IonImg, IonLabel, IonNote,
    IonMenuToggle, IonItem, IonIcon
} from '@ionic/angular/standalone';
import {ActivatedRoute, provideRouter, Router, RouterLink} from '@angular/router';
import { GetbackService } from './getback.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { StorageService } from './storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ModeleService } from './modele.service';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';
import { MessageService } from './message.service';
import { CheckversionService } from './checkversion.service'
import { CapacitorCrisp } from '@capgo/capacitor-crisp';
import * as myGlobals from '../app/global';
import { initializeApp } from "firebase/app";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { HeaderService } from "./header.service";
import {Browser} from "@capacitor/browser";
import {SelparamService} from "./selparam.service";
import {strings} from "./strings";
import {IonicModule} from "@ionic/angular";
import {PushNotificationService} from "./pushnotif.service";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
    imports: [
        IonContent,
        IonMenu,
        IonSplitPane,
        IonApp,
        IonRouterOutlet,
        IonList,
        IonImg,
        IonLabel,
        IonNote,
        IonMenuToggle,
        IonItem,
        IonIcon,
        RouterLink,
    ],
    standalone: true
})

export class AppComponent /*implements AfterViewInit*/ {
    prod = environment.production;
    token = '';
    activePageTitle = 'products';
    activeIndex: any;
    location: any;
    private urlOpenSub?: { remove: () => void };
    private processedDeepLink = false;

    //@ViewChild('mainContent', { static: true, read: ElementRef }) mainContent!: ElementRef;
    // eslint-disable-next-line @typescript-eslint/naming-convention

    //public activatedRoute =inject( ActivatedRoute);
    @ViewChild(RouterLink) routerLink!: RouterLink;
    Pages = [
        {
            title: 'Mes Commandes',
            url: '/admin/orders',
            icon: 'orders'
        },
        {
            title: 'Mes Produits',
            url: '/admin/products',
            icon: 'products'
        },
        {
            title: 'Mes Livraisons',
            url: '/admin/deliveries',
            icon: 'deliveries'
        },
        {
            title: 'Mes Promotions',
            url: '/admin/promotion',
            icon: 'discounts'
        },
        {
            title: 'Mon Argent',
            url: '/admin/mymoney',
            icon: 'mymoney'
        },
        {
            title: 'Mon Espace Client',
            url: '/admin/customerarea',
            icon: 'customerarea'
        },
        {
            title: 'Mes Abonnements',
            url: '/admin/subscription',
            icon: 'subscription'
        },
        {
            title: 'Déconnexion',
            url: '/admin/logout',
            icon: 'logout'
        }
    ];


    async configureStatusBar() {
        await StatusBar.setOverlaysWebView({ overlay: false }); // La webview ne sera pas sous la barre de statut
        await StatusBar.setStyle({ style: Style.Default }); // Style clair ou sombre, selon ta barre
    }



    constructor(location: Location, public platform: Platform,public router: Router, public zone: NgZone,
        public getback: GetbackService, public model: ModeleService, public storage: StorageService,
        public httpClient: HttpClient, public alertController: AlertController, public global: GlobalService,
        public msg: MessageService, public chkver: CheckversionService, public selparam: SelparamService,
        // private menuCtrl: MenuController,
        public header: HeaderService, private pushNotificationService: PushNotificationService,
        // private gestureCtrl: GestureController,
        public activatedRoute: ActivatedRoute)

    {
        this.selparam.initialize();
    }


  ngOnInit() {
        this.httpClient.post(environment.apiroot + 'session-marche', {}, myGlobals.httpOptions).subscribe({
            next: (response: any) => {
                this.header.setToken(response.token);
                if (Capacitor.isNativePlatform()) {
                    this.configureStatusBar();
                }
                this.initializeFirebase();
                this.initializePushNotifications();
                CapacitorCrisp.configure({ websiteID: environment.crispid });
                this.SessionStart();
            },
            error: (err: any) => {
                this.presentAlert(err.error.error);
            }
        });
    }

    SessionStart()
    {
        this.httpClient.post(environment.apiroot + 'check-version', {}, myGlobals.httpOptions).subscribe({
            next: (response: any) => {
                this.chkver.chargementAuthorisation(response);
                if (this.chkver.checkVersion()) {
                        this.location = location;
                        const URLmodel = 'assets/data/model.json';
                        this.httpClient.get(URLmodel).subscribe(dbd => {
                            this.model.chargementDbd(dbd);
                            this.storage.set('status', 'offline');
                            App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
                                if (this.processedDeepLink) {
                                    return;
                                }
                                const url = event.url || '';
                                // 1) Gestion explicite de la fin d’onboarding Stripe (schéma personnalisé iOS/Android)
                                if (url.startsWith('praticboutic://onboarding-complete')) {
                                    this.processedDeepLink = true;
                                    // Fermer le SFSafariViewController si ouvert
                                    Browser.close().catch(() => {});
                                    this.zone.run(() => {
                                        // Redirigez vers l’écran souhaité
                                        // Exemple: écran de confirmation ou tableau de bord
                                        this.router.navigateByUrl('/onboarding-complete', { replaceUrl: false });
                                    });
                                    // Réinitialiser le flag après un délai de sécurité
                                    setTimeout(() => {
                                        this.processedDeepLink = false;
                                    }, 5000);
                                    return; // Ne pas continuer avec la logique de slug
                                }
                                if (url.startsWith('praticboutic://onboarding-cancelled')) {
                                    this.processedDeepLink = true;
                                    Browser.close().catch(() => {});
                                    this.zone.run(() => {
                                        this.router.navigateByUrl('/backoffice', { replaceUrl: false });
                                    });
                                    setTimeout(() => {
                                        this.processedDeepLink = false;
                                    }, 5000);
                                    return;
                                }

                                // 2) Logique de slug uniquement pour les URL http(s) (Universal Links/Web)
                                if (url.startsWith('http://') || url.startsWith('https://')) {
                                    // Récupération du slug après le frontroot
                                    const slug = url
                                        .replace(environment.frontroot, '')   // supprime la racine connue
                                        .replace(/^\/+/, '');                 // enlève les / initiaux éventuels

                                    if (!slug) {
                                        this.presentAlert(strings.NoBoutic);
                                        console.warn('Slug vide donc alerte affichée');
                                        return;
                                    }

                                    // Extraction des segments avec valeurs par défaut
                                    const [segment1 = '', segment2 = '3', segment3 = '0'] = slug.split('/');
                                    console.log('QR scan segments:', { segment1, segment2, segment3 });
                                    if (!segment1) {
                                        console.warn('Segment1 vide → alerte affichée');
                                        this.presentAlert(strings.NoBoutic);
                                        return;
                                    }

                                    // Navigation dans la zone Angular
                                    this.zone.run(() => {
                                        const navigateUrl = `admin/debut/${segment1}/${segment2}/${segment3}`;
                                        console.log('Navigation vers URL:', navigateUrl);

                                        this.router.navigate([navigateUrl], { replaceUrl: true })
                                            .then(success => console.log('Navigation réussie ?', success))
                                            .catch(err => console.error('Erreur navigation:', err));
                                    });
                                }
                            });

                            this.platform.backButton.subscribeWithPriority(-1, () => {
                                // Get first part of url
                                const theurl = this.router.url;
                                const nexslash = this.router.url.indexOf('/', 1) + 1;
                                let zeroparturl: string;
                                let firstparturl: string;
                                let secondparturl: string;
                                let thirdparturl: string;
                                let fourthparturl: string;
                                let fifthparturl: string;
                                zeroparturl = theurl.substring(1, nexslash - 1);
                                const nextslash = this.router.url.indexOf('/', nexslash) + 1;
                                if (nextslash > 0) {
                                    firstparturl = theurl.substring(1, nextslash - 1);
                                    const next2slash = this.router.url.indexOf('/', nextslash) + 1;
                                    if (next2slash > 0) {
                                        secondparturl = theurl.substring(nextslash, next2slash - 1);
                                        const next3slash = this.router.url.indexOf('/', next2slash) + 1;
                                        if (next3slash > 0) {
                                            thirdparturl = theurl.substring(next2slash, next3slash - 1);
                                            const next4slash = this.router.url.indexOf('/', next3slash) + 1;
                                            if (next4slash > 0) {
                                                fourthparturl = theurl.substring(next3slash, next4slash - 1);
                                                const next5slash = this.router.url.indexOf('/', next4slash) + 1;
                                                if (next5slash > 0) {
                                                    fifthparturl = theurl.substring(next4slash, next5slash - 1);
                                                } else {
                                                    fifthparturl = theurl.substring(next4slash);
                                                }
                                            } else {
                                                fourthparturl = theurl.substring(next3slash);
                                            }
                                        } else {
                                            thirdparturl = theurl.substring(next2slash);
                                        }
                                    } else {
                                        secondparturl = theurl.substring(nextslash);
                                    }
                                } else {
                                    firstparturl = theurl.substring(nexslash);
                                    zeroparturl = theurl.substring(1);
                                }
                                this.selparam.getTable().then( table => {
                                    switch (firstparturl) {
                                        case 'welcome':
                                            if (this.global.getWillQuit() === false) {
                                                this.global.setWillQuit(true);
                                                setTimeout(() => {
                                                    this.global.setWillQuit(false);
                                                }, 5000);
                                            } else {
                                                App.exitApp();
                                            }
                                            break;
                                        case 'debut':
                                        case 'carte':
                                        case 'login':
                                            this.router.navigate(['admin/welcome'], {replaceUrl: true});
                                            break;
                                        case 'getinfo':
                                        case 'fin':
                                            this.router.navigate(['admin/carte'], {replaceUrl: true});
                                            break;
                                        case 'paiement':
                                            this.router.navigate(['admin/getinfo'], {replaceUrl: true});
                                            break;
                                        case 'orders':
                                        case 'products':
                                        case 'mymoney':
                                        case 'deliveries':
                                        case 'subscription':
                                        case 'customerarea':
                                        case 'forgotpassword':
                                        case 'registration':
                                        case 'registrationdetails':
                                            this.router.navigate(['admin/login'], {replaceUrl: true});
                                            break;
                                        case 'detailsorder':
                                            this.router.navigate(['admin/orders'], {replaceUrl: true});
                                            break;
                                        case 'orderlines':
                                            this.router.navigate(['admin/detailsorder'], {replaceUrl: true});
                                            break;
                                        case 'insertrecord':
                                            switch (table) {
                                                case 'categorie':
                                                    this.router.navigate(['admin/products/categorie'], {replaceUrl: true});
                                                    break;
                                                case 'article':
                                                    this.router.navigate(['admin/products/article'], {replaceUrl: true});
                                                    break;
                                                case 'groupeopt':
                                                    this.router.navigate(['admin/products/groupeopt'], {replaceUrl: true});
                                                    break;
                                                case 'barlivr':
                                                    this.router.navigate(['admin/deliveries/barlivr'], {replaceUrl: true});
                                                    break;
                                                case 'cpzone':
                                                    this.router.navigate(['admin/deliveries/cpzone'], {replaceUrl: true});
                                                    break;
                                                case 'relgrpoptart':
                                                case 'option':
                                                    this.selparam.setTable('groupeopt');
                                                    this.router.navigate(['admin/update/soustable'], {replaceUrl: true});
                                                    break;
                                                case 'statutcmd':
                                                    this.router.navigate(['admin/customerarea/statutcmd'], {replaceUrl: true});
                                                    break;
                                            }
                                            break;
                                        case 'updaterecord':
                                            switch (table) {
                                                case 'categorie':
                                                    this.router.navigate(['admin/products/categorie'], {replaceUrl: true});
                                                    break;
                                                case 'article':
                                                    this.router.navigate(['admin/products/article'], {replaceUrl: true});
                                                    break;
                                                case 'groupeopt':
                                                    this.router.navigate(['admin/products/groupeopt'], {replaceUrl: true});
                                                    break;
                                                case 'barlivr':
                                                    this.router.navigate(['admin/deliveries/barlivr'], {replaceUrl: true});
                                                    break;
                                                case 'cpzone':
                                                    this.router.navigate(['admin/deliveries/cpzone'], {replaceUrl: true});
                                                    break;
                                                case 'option':
                                                case 'relgrpoptart':
                                                    this.selparam.setTable('groupeopt');
                                                    this.router.navigate(['admin/update/soustable'], {replaceUrl: true});
                                                    break;
                                                case 'statutcmd':
                                                    this.router.navigate(['admin/customerarea/statutcmd'], {replaceUrl: true});
                                                    break;
                                            }
                                            break;
                                        case 'update':
                                            switch (secondparturl) {
                                                case 'updaterec':
                                                    switch (table) {
                                                        case 'article':
                                                            this.router.navigate(['admin/products/article'], {replaceUrl: true});
                                                            break;
                                                        case 'groupeopt':
                                                            this.router.navigate(['admin/products/groupeopt'], {replaceUrl: true});
                                                            break;
                                                    }
                                                    break;
                                                case 'soustable':
                                                    switch (table) {
                                                        case 'relgrpoptart':
                                                            this.router.navigate(['admin/products/article'], {replaceUrl: true});
                                                            break;
                                                        case 'option':
                                                            this.router.navigate(['admin/products/groupeopt'], {replaceUrl: true});
                                                            break;
                                                    }
                                                    break;
                                            }
                                            break;
                                        case 'subscriptionchoice':
                                            switch (secondparturl) {
                                                case 'init':
                                                    this.router.navigate(['admin/shopsettings'], {replaceUrl: true});
                                                    break;
                                                case 'back':
                                                    this.router.navigate(['admin/subscription'], {replaceUrl: true});
                                                    break;
                                            }
                                            break;
                                        case 'paymentdetails':
                                        case 'termsandconditions':
                                            switch (secondparturl) {
                                                case 'init':
                                                    this.router.navigate(['admin/shopsettings'], {replaceUrl: true});
                                                    break;
                                                case 'back':
                                                    this.router.navigate(['admin/subscription'], {replaceUrl: true});
                                                    break;
                                                case 'front':
                                                    this.router.navigate(['admin/getinfo'], {replaceUrl: true});
                                                    break;
                                            }
                                            break;
                                        case 'identification':
                                            this.router.navigate(['admin/registration'], {replaceUrl: true});
                                            break;
                                        case 'shopdetails':
                                            this.router.navigate(['admin/registrationdetails'], {replaceUrl: true});
                                            break;
                                        case 'shopsettings':
                                            this.router.navigate(['admin/shopdetails'], {replaceUrl: true});
                                            break;
                                    }
                                });
                                })

                            this.storage.get('login').then(email => {
                                if (email !== null) {
                                    this.global.setLogin(email);
                                }
                            });
                            this.storage.get('status').then(status => {
                                if (status === 'error') {
                                    this.storage.set('status', 'offline');
                                    this.storage.get('lasturl').then(res => {
                                        if (res !== null) {
                                            let zeroparturl: string;
                                            let firstparturl: string;
                                            let secondparturl: string;
                                            let nexslash = res.indexOf('/', 1) + 1;
                                            let nextslash = 0;
                                            if (nexslash > 0) {
                                                zeroparturl = res.substring(1, nexslash - 1);
                                                nextslash = res.indexOf('/', nexslash) + 1;
                                                if (nextslash > 0) {
                                                    firstparturl = res.substring(nexslash, nextslash - 1);
                                                } else {
                                                    firstparturl = res.substring(1);
                                                }
                                            }
                                            switch (firstparturl) {
                                                case 'welcome':
                                                case 'login':
                                                case 'carte':
                                                case 'getinfo':
                                                case 'paiement':
                                                case 'fin':
                                                case 'forgotpassword':
                                                case 'registration':
                                                case 'identification':
                                                case 'registrationdetails':
                                                case 'shopdetails':
                                                case 'shopsettings':
                                                    this.router.navigate([res], {replaceUrl: true});
                                                    break;
                                                case 'orders':
                                                case 'detailsorder':
                                                case 'orderlines':
                                                case 'products':
                                                case 'mymoney':
                                                case 'deliveries':
                                                case 'subscription':
                                                case 'customerarea':
                                                case 'insertrecord':
                                                case 'updaterecord':
                                                case 'update':

                                                    this.storage.get('bouticid').then(bouticid => {
                                                        this.showAlertStripe(bouticid);
                                                        this.router.navigate([res], {replaceUrl: true});
                                                    });

                                                    break;
                                                case 'subscriptionchoice':
                                                case 'paymentdetails':
                                                case 'termsandconditions':
                                                    const next2slash = res.indexOf('/', nextslash) + 1;
                                                    if (next2slash > 0) {
                                                        secondparturl = res.substring(nextslash, next2slash - 1);
                                                    } else {
                                                        secondparturl = res.substring(nextslash);
                                                    }
                                                    switch (secondparturl) {
                                                        case 'init':
                                                            this.router.navigate([decodeURI(res)], {replaceUrl: true});
                                                            break;
                                                        case 'back':

                                                            this.storage.get('bouticid').then(bouticid => {
                                                                this.showAlertStripe(bouticid);
                                                                this.router.navigate([decodeURI(res)], {replaceUrl: true});
                                                            });

                                                            break;
                                                    }
                                                    break;
                                            }
                                        } else {
                                            this.router.navigate([this.router.url], {replaceUrl: true});
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        this.presentMsgBlocage();
                    }
                },
                error: (err: any) => {
                    this.presentAlert(err.error.error);
                }
            });

    }


    frommenu(index: any) {
        if (index === 1) {
            this.getback.publishGetback({ table: 'article', action: 'menu' });
            this.router.navigate(['admin/products/article'], { replaceUrl: true });
        }
        if (index === 2) {
            this.getback.publishGetback({ table: 'barlivr', action: 'menu' });
            this.router.navigate(['admin/deliveries/barlivr'], { replaceUrl: true });
        }
    }

    async showAlertStripe(bouticid: any) {

        const chargepostData = {
            bouticid
        };

        this.httpClient.post(environment.apiroot + 'check-stripe-account', chargepostData, await this.header.buildHttpOptions()).subscribe({
            next: (response:any) => {
                this.header.setToken(response.token);
                if (response.result === 'KO')
                {
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
                            this.router.navigate(['admin/mymoney'], { replaceUrl: true });
                        }
                    }]
        });

        await alert.present();
    }

    async presentAlert(msg: any) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Erreur',
            subHeader: 'Erreur',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();
    }

    getlogin() {
        return this.global.getLogin();
    }

    async presentMsgBlocage() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Blocage Système',
            subHeader: 'Impossible de se connecter',
            message: 'La version de l\'application que vous utilisez est trop ancienne. Veuillez la mettre à jour.',
            backdropDismiss: false
        });

        await alert.present();
    }

    public async initializeFirebase(): Promise<void> {
        // Firebase doit être initialisé sur toutes les plateformes pour FCM
        try {
            initializeApp(environment.firebase);
            console.log('🔥 Firebase initialized successfully');
        } catch (error: any) {
            // Ignorer l'erreur si Firebase est déjà initialisé
            if (error.code !== 'app/duplicate-app') {
                console.error('❌ Firebase initialization error:', error);
            }
        }
    }

    ngOnDestroy() {
        if (this.urlOpenSub) {
            this.urlOpenSub.remove();
        }
    }

    private async initializePushNotifications(): Promise<void> {
        try {
            // Enregistrer les notifications push
            await this.pushNotificationService.register();
            console.log('🔔 Push notifications registered');
        } catch (error) {
            console.error('❌ Push notifications registration error:', error);
        }
    }

}
