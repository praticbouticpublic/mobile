import {AfterViewInit, Component, ElementRef, inject, NgZone, ViewChild} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
    Platform,
    AlertController,
    IonRouterOutlet,
    IonLabel,
    IonSplitPane,
    IonContent, IonMenu, IonApp, IonList, IonImg, IonNote, IonMenuToggle, IonItem, IonIcon
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
import {HeaderService} from "./header.service";
import {GestureController, IonicModule} from "@ionic/angular";
import { MenuController } from "@ionic/angular";




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
        RouterLink
    ],
    standalone: true
})

export class AppComponent /*implements AfterViewInit*/ {
    prod = environment.production;
    token = '';
    activePageTitle = 'products';
    activeIndex: any;
    location: any;
    @ViewChild('mainContent', { static: true, read: ElementRef }) mainContent!: ElementRef;
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
            url: '/admin/displaytable/promotion/none/0',
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
        public msg: MessageService, public chkver: CheckversionService, private menuCtrl: MenuController,
        public header: HeaderService, private gestureCtrl: GestureController, public activatedRoute: ActivatedRoute)

    {
        console.log(myGlobals.httpOptions);
    }


  ngOnInit() {
        this.httpClient.post(environment.apiroot + 'session-marche', {}, myGlobals.httpOptions).subscribe({
            next: (response: any) => {
                //console.log(response);
                //console.log(response.token);
                this.header.setToken(response.token);

                if (Capacitor.isNativePlatform()) {
                    this.configureStatusBar();
                }

                this.initializeFirebase();

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
        //console.log(await this.header.buildHttpOptions());
        this.httpClient.post(environment.apiroot + 'check', {}, myGlobals.httpOptions).subscribe({
            next: (response: any) => {
                this.chkver.chargementAuthorisation(response.result);
                if (this.chkver.checkVersion()) {
                        this.location = location;
                        const URLmodel = 'assets/data/model.json';
                        this.httpClient.get(URLmodel).subscribe(dbd => {
                            this.model.chargementDbd(dbd);
                            this.storage.set('status', 'offline');
                            App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
                                //this.zone.run(() => {
                                    // Vérifiez si le deeplink contient `onboarding-complete`
                                    if (event.url.includes('praticboutic://onboarding-complete')) {
                                        this.router.navigateByUrl('/onboarding-complete', { replaceUrl: false });
                                    }

                                    // Example url: https://beerswift.app/tabs/tab2
                                    // slug = /tabs/tab2
                                    const slug = event.url.split(environment.frontroot).pop();
                                    if (slug) {
                                        this.router.navigate(['/' + slug], {replaceUrl: false});
                                    }
                                    // If no match, do nothing - let regular routing
                                    // logic take over
                               // });
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
                                        this.router.navigate(['admin/detailsorder/' + secondparturl], {replaceUrl: true});
                                        break;
                                    case 'insertrecord':
                                        switch (secondparturl) {
                                            case 'categorie':
                                                this.router.navigate(['admin/products/displaytable/categorie/none/0'], {replaceUrl: true});
                                                break;
                                            case 'article':
                                                this.router.navigate(['admin/products/displaytable/article/none/0'], {replaceUrl: true});
                                                break;
                                            case 'groupeopt':
                                                this.router.navigate(['admin/products/displaytable/groupeopt/none/0'], {replaceUrl: true});
                                                break;
                                            case 'barlivr':
                                                this.router.navigate(['admin/deliveries/displaytable/barlivr/none/0'], {replaceUrl: true});
                                                break;
                                            case 'cpzone':
                                                this.router.navigate(['admin/deliveries/displaytable/cpzone/none/0'], {replaceUrl: true});
                                                break;
                                            case 'relgrpoptart':
                                                this.router.navigate(['admin/update/displaytable/relgrpoptart/'
                                                + thirdparturl + '/' + fourthparturl], {replaceUrl: true});
                                                break;
                                            case 'option':
                                                this.router.navigate(['admin/update/displaytable/option/'
                                                + thirdparturl + '/' + fourthparturl], {replaceUrl: true});
                                                break;
                                            case 'statutcmd':
                                                this.router.navigate(['admin/customerarea/displaytable/statutcmd/none/0'], {replaceUrl: true});
                                                break;
                                        }
                                        break;
                                    case 'updaterecord':
                                        switch (secondparturl) {
                                            case 'categorie':
                                                this.router.navigate(['admin/products/displaytable/categorie/none/0'], {replaceUrl: true});
                                                break;
                                            case 'article':
                                                this.router.navigate(['admin/products/displaytable/article/none/0'], {replaceUrl: true});
                                                break;
                                            case 'groupeopt':
                                                this.router.navigate(['admin/products/displaytable/groupeopt/none/0'], {replaceUrl: true});
                                                break;
                                            case 'barlivr':
                                                this.router.navigate(['admin/deliveries/displaytable/barlivr/none/0'], {replaceUrl: true});
                                                break;
                                            case 'cpzone':
                                                this.router.navigate(['admin/deliveries/displaytable/cpzone/none/0'], {replaceUrl: true});
                                                break;
                                            case 'relgrpoptart':
                                                this.router.navigate(['admin/update/displaytable/relgrpoptart/'
                                                + fourthparturl + '/' + fifthparturl], {replaceUrl: true});
                                                break;
                                            case 'option':
                                                this.router.navigate(['admin/update/displaytable/option/'
                                                + fourthparturl + '/' + fifthparturl], {replaceUrl: true});
                                                break;
                                            case 'statutcmd':
                                                this.router.navigate(['admin/customerarea/displaytable/statutcmd/none/0'], {replaceUrl: true});
                                                break;
                                        }
                                        break;
                                    case 'update':
                                        switch (secondparturl) {
                                            case 'updaterecord':
                                                switch (thirdparturl) {
                                                    case 'article':
                                                        this.router.navigate(['admin/products/displaytable/article/none/0'], {replaceUrl: true});
                                                        break;
                                                    case 'groupeopt':
                                                        this.router.navigate(['admin/products/displaytable/groupeopt/none/0'], {replaceUrl: true});
                                                        break;
                                                }
                                                break;
                                            case 'displaytable':
                                                switch (thirdparturl) {
                                                    case 'relgrpoptart':
                                                        this.router.navigate(['admin/products/displaytable/article/none/0'], {replaceUrl: true});
                                                        break;
                                                    case 'option':
                                                        this.router.navigate(['admin/products/displaytable/groupeopt/none/0'], {replaceUrl: true});
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
                                                this.router.navigate(['admin/subscriptionchoice/init'], {replaceUrl: true});
                                                break;
                                            case 'back':
                                                this.router.navigate(['admin/subscriptionchoice/back'], {replaceUrl: true});
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
            this.router.navigate(['admin/products/displaytable/article/none/0'], { replaceUrl: true });
        }
        if (index === 2) {
            this.getback.publishGetback({ table: 'barlivr', action: 'menu' });
            this.router.navigate(['admin/deliveries/displaytable/barlivr/none/0'], { replaceUrl: true });
        }
    }

    showAlertStripe(bouticid: any) {

        const chargepostData = {
            bouticid
        };
        this.header.buildHttpOptions().then((httpOptions: HttpHeaders | {headers : HttpHeaders}):void => {
            this.httpClient.post(environment.apiroot + 'check-stripe-account', httpOptions).subscribe({
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

        })

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
        if (Capacitor.isNativePlatform()) {
            return;
        }
        initializeApp(environment.firebase);
    }

    ngAfterViewInit() {
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.setupSwipeGesture();
        }
    }

    setupSwipeGesture() {
        const gesture = this.gestureCtrl.create({
            el: this.mainContent.nativeElement,
            gestureName: 'custom-swipe-to-menu',
            threshold: 10,
            direction: 'x',
            onStart: ev => {
                // Ne rien faire si swipe ne commence pas depuis le bord gauche
                if (ev.startX > 30) return false;
                return true;
            },
            onMove: ev => {
                // Tu peux ajouter une animation ici si tu veux
            },
            onEnd: ev => {
                if (ev.deltaX > 100) {
                    this.menuCtrl.open('main-menu');
                }
            }
        });

        gesture.enable(true);
    }

}
